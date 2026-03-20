import { trpc } from "@/lib/trpc";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileSpreadsheet, ArrowRight, ArrowLeft, Check,
  AlertTriangle, Loader2, X, ChevronDown, Download,
  Users, CheckCircle2, XCircle, Trash2, Eye,
} from "lucide-react";
import { toast } from "sonner";

type Step = "upload" | "map" | "preview" | "importing" | "complete";

interface ParsedCSV {
  headers: string[];
  rows: string[][];
  fileName: string;
  totalRows: number;
}

interface FieldMapping {
  csvColumn: string;
  dbField: string;
}

const DB_FIELDS = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "phone", label: "Phone", required: false },
  { key: "company", label: "Company", required: false },
  { key: "jobTitle", label: "Job Title", required: false },
  { key: "tags", label: "Tags", required: false },
  { key: "_skip", label: "— Skip this column —", required: false },
];

// Auto-detect mapping based on header names
function autoMap(headers: string[]): FieldMapping[] {
  const mappings: FieldMapping[] = [];
  const patterns: Record<string, RegExp> = {
    firstName: /^(first[\s_-]?name|given[\s_-]?name|fname|first)$/i,
    lastName: /^(last[\s_-]?name|surname|family[\s_-]?name|lname|last)$/i,
    email: /^(email|e[\s_-]?mail|email[\s_-]?address)$/i,
    phone: /^(phone|telephone|tel|mobile|cell|phone[\s_-]?number)$/i,
    company: /^(company|company[\s_-]?name|organisation|organization|org|business)$/i,
    jobTitle: /^(job[\s_-]?title|title|position|role|designation)$/i,
    tags: /^(tags|tag|labels|categories|groups)$/i,
  };

  for (const header of headers) {
    let matched = false;
    for (const [field, regex] of Object.entries(patterns)) {
      if (regex.test(header.trim())) {
        mappings.push({ csvColumn: header, dbField: field });
        matched = true;
        break;
      }
    }
    if (!matched) {
      mappings.push({ csvColumn: header, dbField: "_skip" });
    }
  }
  return mappings;
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

export default function ImportContacts({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step, setStep] = useState<Step>("upload");
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importResult, setImportResult] = useState<any>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bulkImport = trpc.contacts.bulkImport.useMutation();
  const utils = trpc.useUtils();

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);

      if (headers.length === 0 || rows.length === 0) {
        toast.error("CSV file appears to be empty or invalid");
        return;
      }

      setCsvData({
        headers,
        rows,
        fileName: file.name,
        totalRows: rows.length,
      });

      const autoMappings = autoMap(headers);
      setMappings(autoMappings);
      setStep("map");
      toast.success(`Loaded ${rows.length.toLocaleString()} rows from ${file.name}`);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const updateMapping = (csvColumn: string, dbField: string) => {
    setMappings(prev => prev.map(m => m.csvColumn === csvColumn ? { ...m, dbField } : m));
  };

  const requiredFieldsMapped = () => {
    const mapped = new Set(mappings.filter(m => m.dbField !== "_skip").map(m => m.dbField));
    return mapped.has("firstName") && mapped.has("lastName") && mapped.has("email");
  };

  const getPreviewData = () => {
    if (!csvData) return [];
    return csvData.rows.slice(0, 5).map(row => {
      const obj: Record<string, string> = {};
      mappings.forEach(m => {
        if (m.dbField !== "_skip") {
          const colIdx = csvData.headers.indexOf(m.csvColumn);
          if (colIdx >= 0) obj[m.dbField] = row[colIdx] || "";
        }
      });
      return obj;
    });
  };

  const handleImport = async () => {
    if (!csvData) return;
    setStep("importing");
    setImportProgress(0);

    // Build contacts from CSV data using mappings
    const contactsToImport: any[] = [];
    let skippedNoEmail = 0;

    for (const row of csvData.rows) {
      const obj: Record<string, string> = {};
      mappings.forEach(m => {
        if (m.dbField !== "_skip") {
          const colIdx = csvData.headers.indexOf(m.csvColumn);
          if (colIdx >= 0) obj[m.dbField] = row[colIdx] || "";
        }
      });

      if (!obj.email || !obj.email.includes("@")) {
        skippedNoEmail++;
        continue;
      }

      contactsToImport.push({
        firstName: obj.firstName || "Unknown",
        lastName: obj.lastName || "",
        email: obj.email.trim().toLowerCase(),
        phone: obj.phone || undefined,
        company: obj.company || undefined,
        jobTitle: obj.jobTitle || undefined,
        source: "other" as const,
        tags: obj.tags || undefined,
      });
    }

    // Import in batches of 100
    const BATCH_SIZE = 100;
    let totalImported = 0;
    let totalSkipped = skippedNoEmail;
    let totalErrors = 0;
    const allErrorDetails: string[] = [];

    for (let i = 0; i < contactsToImport.length; i += BATCH_SIZE) {
      const batch = contactsToImport.slice(i, i + BATCH_SIZE);
      try {
        const result = await bulkImport.mutateAsync({
          contacts: batch,
          skipDuplicates,
        });
        totalImported += result.imported;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
        allErrorDetails.push(...result.errorDetails);
      } catch (err: any) {
        totalErrors += batch.length;
        allErrorDetails.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${err?.message || "Unknown error"}`);
      }
      setImportProgress(Math.min(100, Math.round(((i + batch.length) / contactsToImport.length) * 100)));
    }

    setImportResult({
      imported: totalImported,
      skipped: totalSkipped,
      errors: totalErrors,
      errorDetails: allErrorDetails.slice(0, 10),
      total: csvData.totalRows,
    });
    setStep("complete");

    // Invalidate contacts cache
    utils.contacts.list.invalidate();
    utils.contacts.stats.invalidate();
  };

  const resetWizard = () => {
    setStep("upload");
    setCsvData(null);
    setMappings([]);
    setImportResult(null);
    setImportProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Import Contacts
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Upload a CSV file to bulk-import contacts into your database</p>
        </div>
        <Button variant="outline" className="gap-2 text-sm" onClick={() => onNavigate("contacts")}>
          <ArrowLeft className="w-4 h-4" /> Back to Contacts
        </Button>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2">
          {[
            { key: "upload", label: "1. Upload CSV", icon: Upload },
            { key: "map", label: "2. Map Fields", icon: ArrowRight },
            { key: "preview", label: "3. Preview", icon: Eye },
            { key: "complete", label: "4. Complete", icon: Check },
          ].map((s, i) => {
            const isActive = s.key === step || (step === "importing" && s.key === "complete");
            const isPast = ["upload", "map", "preview", "importing", "complete"].indexOf(step) >
              ["upload", "map", "preview", "importing", "complete"].indexOf(s.key as Step);
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-[#0d9488]/10 text-[#0d9488]" :
                  isPast ? "bg-emerald-50 text-emerald-600" :
                  "text-[#9CA3AF]"
                }`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 ${isPast ? "bg-emerald-300" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive ? "border-[#0d9488] bg-[#0d9488]/5" : "border-gray-200 hover:border-[#0d9488]/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileSpreadsheet className="w-16 h-16 text-[#0d9488]/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
              Drag and drop your CSV file here
            </h3>
            <p className="text-[#6B7280] text-sm mb-6">
              or click to browse. Supports .csv files up to 10 MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              <Upload className="w-4 h-4" /> Choose File
            </Button>
          </div>

          <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg">
            <h4 className="text-sm font-medium text-[#374151] mb-2">Expected CSV Format</h4>
            <p className="text-xs text-[#6B7280] mb-3">
              Your CSV should have a header row. The wizard will auto-detect common column names like
              "First Name", "Last Name", "Email", "Phone", "Company", "Job Title", and "Tags".
            </p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs text-[#6B7280] overflow-x-auto">
              First Name,Last Name,Email,Phone,Company,Tags<br />
              John,Smith,john@example.com,+44 7700 900000,Acme Ltd,"sponsor,compliance"
            </div>
          </div>
        </div>
      )}

      {/* Step: Map Fields */}
      {step === "map" && csvData && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#1F2937]">Map CSV Columns to Contact Fields</h3>
                <p className="text-sm text-[#6B7280] mt-1">
                  We auto-detected some mappings. Review and adjust as needed.
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {csvData.fileName} — {csvData.totalRows.toLocaleString()} rows
              </Badge>
            </div>

            {!requiredFieldsMapped() && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm text-amber-700">
                  Please map <strong>First Name</strong>, <strong>Last Name</strong>, and <strong>Email</strong> — these are required.
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {mappings.map((mapping) => (
              <div key={mapping.csvColumn} className="flex items-center gap-4 p-3 rounded-lg bg-[#F9FAFB]">
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#374151]">{mapping.csvColumn}</div>
                  <div className="text-xs text-[#9CA3AF] mt-0.5">
                    Sample: {csvData.rows[0]?.[csvData.headers.indexOf(mapping.csvColumn)] || "—"}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <div className="flex-1">
                  <select
                    value={mapping.dbField}
                    onChange={(e) => updateMapping(mapping.csvColumn, e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] ${
                      mapping.dbField === "_skip"
                        ? "border-gray-200 text-[#9CA3AF]"
                        : "border-[#0d9488]/30 text-[#374151]"
                    }`}
                  >
                    {DB_FIELDS.map(f => (
                      <option key={f.key} value={f.key}>
                        {f.label} {f.required ? "*" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                className="rounded border-gray-300 text-[#0d9488] focus:ring-[#0d9488]"
              />
              Skip duplicate emails (recommended)
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={resetWizard} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              onClick={() => setStep("preview")}
              disabled={!requiredFieldsMapped()}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              Preview Import <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && csvData && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-[#1F2937]">Preview Import Data</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Showing first 5 rows of {csvData.totalRows.toLocaleString()} total. Verify the data looks correct before importing.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-200">
                  {mappings.filter(m => m.dbField !== "_skip").map(m => {
                    const field = DB_FIELDS.find(f => f.key === m.dbField);
                    return (
                      <th key={m.csvColumn} className="text-left px-4 py-2.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        {field?.label || m.dbField}
                        {field?.required && <span className="text-red-400 ml-0.5">*</span>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getPreviewData().map((row, i) => (
                  <tr key={i} className="hover:bg-[#F9FAFB]">
                    {mappings.filter(m => m.dbField !== "_skip").map(m => (
                      <td key={m.csvColumn} className="px-4 py-2.5 text-sm text-[#374151]">
                        {row[m.dbField] || <span className="text-[#D1D5DB]">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg">
            <h4 className="text-sm font-medium text-[#374151] mb-2">Import Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-[#9CA3AF]">Total rows:</span>{" "}
                <span className="font-medium text-[#1F2937]">{csvData.totalRows.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF]">Fields mapped:</span>{" "}
                <span className="font-medium text-[#1F2937]">{mappings.filter(m => m.dbField !== "_skip").length}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF]">Skip duplicates:</span>{" "}
                <span className="font-medium text-[#1F2937]">{skipDuplicates ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep("map")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              onClick={handleImport}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              <Upload className="w-4 h-4" /> Import {csvData.totalRows.toLocaleString()} Contacts
            </Button>
          </div>
        </div>
      )}

      {/* Step: Importing */}
      {step === "importing" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0d9488] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1F2937] mb-2">Importing Contacts...</h3>
          <p className="text-[#6B7280] text-sm mb-6">
            Please do not close this page. This may take a moment for large files.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-[#6B7280] mb-2">
              <span>Progress</span>
              <span>{importProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#0d9488] to-[#14b8a6] h-3 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === "complete" && importResult && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="text-center mb-8">
            {importResult.errors === 0 ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">
              {importResult.errors === 0 ? "Import Complete!" : "Import Completed with Issues"}
            </h3>
            <p className="text-[#6B7280] text-sm">
              {importResult.imported.toLocaleString()} contacts were successfully imported.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[#F9FAFB] rounded-lg text-center">
              <div className="text-2xl font-bold text-[#1F2937]">{importResult.total.toLocaleString()}</div>
              <div className="text-xs text-[#9CA3AF]">Total Rows</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-700">{importResult.imported.toLocaleString()}</div>
              <div className="text-xs text-emerald-600">Imported</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700">{importResult.skipped.toLocaleString()}</div>
              <div className="text-xs text-amber-600">Skipped</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{importResult.errors}</div>
              <div className="text-xs text-red-600">Errors</div>
            </div>
          </div>

          {importResult.errorDetails?.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-700 mb-2">Error Details</h4>
              <ul className="text-xs text-red-600 space-y-1">
                {importResult.errorDetails.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={resetWizard} className="gap-2">
              <Upload className="w-4 h-4" /> Import Another File
            </Button>
            <Button
              onClick={() => onNavigate("contacts")}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              <Users className="w-4 h-4" /> View All Contacts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
