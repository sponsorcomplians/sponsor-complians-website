import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Loader2, Sparkles, Building2, Check,
} from "lucide-react";
import { toast } from "sonner";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (id: number) => void;
}

export default function AddCompanyDialog({ open, onOpenChange, onSuccess }: AddCompanyDialogProps) {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [enriching, setEnriching] = useState(false);
  const [enrichedFields, setEnrichedFields] = useState<Set<string>>(new Set());

  const utils = trpc.useUtils();
  const createCompany = trpc.companies.create.useMutation({
    onSuccess: (data) => {
      toast.success("Company created successfully");
      utils.companies.list.invalidate();
      onOpenChange(false);
      resetForm();
      if (onSuccess) onSuccess((data as any).id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create company");
    },
  });

  const enrichCompany = trpc.enrichment.enrichCompany.useMutation();

  const resetForm = () => {
    setForm({
      name: "", industry: "", size: "", website: "",
      phone: "", address: "", notes: "",
    });
    setEnrichedFields(new Set());
  };

  const handleEnrich = async () => {
    if (!form.name && !form.website) {
      toast.error("Enter at least a company name or website to enrich");
      return;
    }
    setEnriching(true);
    try {
      const result = await enrichCompany.mutateAsync({
        name: form.name || undefined,
        website: form.website || undefined,
        industry: form.industry || undefined,
      });

      if (result.error) {
        toast.error("Could not find enrichment data");
        return;
      }

      const newEnriched = new Set<string>();
      const updates: Partial<typeof form> = {};

      if (result.industry && !form.industry) { updates.industry = result.industry; newEnriched.add("industry"); }
      if (result.size && !form.size) { updates.size = result.size; newEnriched.add("size"); }
      if (result.website && !form.website) { updates.website = result.website; newEnriched.add("website"); }
      if (result.phone && !form.phone) { updates.phone = result.phone; newEnriched.add("phone"); }
      if (result.address && !form.address) { updates.address = result.address; newEnriched.add("address"); }
      if (result.name && !form.name) { updates.name = result.name; newEnriched.add("name"); }

      // Add enriched info to notes
      const enrichNotes: string[] = [];
      if (result.description) enrichNotes.push(`Description: ${result.description}`);
      if (result.linkedinUrl) enrichNotes.push(`LinkedIn: ${result.linkedinUrl}`);
      if (result.foundedYear) enrichNotes.push(`Founded: ${result.foundedYear}`);
      if (result.revenue) enrichNotes.push(`Revenue: ${result.revenue}`);
      if (result.employeeCount) enrichNotes.push(`Employees: ${result.employeeCount}`);
      if (result.headquarters) enrichNotes.push(`HQ: ${result.headquarters}`);
      if (result.specialties) enrichNotes.push(`Specialties: ${result.specialties}`);

      if (enrichNotes.length > 0) {
        const existingNotes = form.notes ? form.notes + "\n\n" : "";
        updates.notes = existingNotes + "--- Enriched Data ---\n" + enrichNotes.join("\n");
        newEnriched.add("notes");
      }

      if (Object.keys(updates).length > 0) {
        setForm(prev => ({ ...prev, ...updates }));
        setEnrichedFields(prev => {
          const merged = new Set(Array.from(prev));
          newEnriched.forEach(f => merged.add(f));
          return merged;
        });
        toast.success(`Found ${newEnriched.size} new field${newEnriched.size !== 1 ? "s" : ""}`);
      } else {
        toast.info("No additional data found");
      }
    } catch (err: any) {
      toast.error(err.message || "Enrichment failed");
    } finally {
      setEnriching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }
    createCompany.mutate(form);
  };

  const fieldClass = (field: string) =>
    enrichedFields.has(field)
      ? "border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-200"
      : "";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-[#1F2937]">
            <Building2 className="w-5 h-5 text-[#6366f1]" /> Add Company
          </SheetTitle>
          <SheetDescription>
            Add a new company to your database. Use enrichment to auto-fill from web data.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Enrichment Button */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Smart Enrichment
                </div>
                <p className="text-[11px] text-purple-600 mt-0.5">
                  Auto-fill company details from web data. Enter a name or website first.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={enriching || (!form.name && !form.website)}
                onClick={handleEnrich}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 text-xs"
              >
                {enriching ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5" /> Enrich</>
                )}
              </Button>
            </div>
            {enrichedFields.size > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700">
                <Check className="w-3.5 h-3.5" />
                {enrichedFields.size} field{enrichedFields.size !== 1 ? "s" : ""} enriched
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Company Name *</Label>
            <Input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Acme Ltd"
              className={`mt-1 ${fieldClass("name")}`}
              required
            />
          </div>

          {/* Industry */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Industry</Label>
            <Input
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              placeholder="e.g. Healthcare, Technology, Recruitment"
              className={`mt-1 ${fieldClass("industry")}`}
            />
          </div>

          {/* Size & Website */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-[#374151]">Company Size</Label>
              <Input
                value={form.size}
                onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                placeholder="e.g. 50-200"
                className={`mt-1 ${fieldClass("size")}`}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-[#374151]">Website</Label>
              <Input
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="www.acme.co.uk"
                className={`mt-1 ${fieldClass("website")}`}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Phone</Label>
            <Input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+44 20 1234 5678"
              className={`mt-1 ${fieldClass("phone")}`}
            />
          </div>

          {/* Address */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Address</Label>
            <Input
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="123 Business Park, London"
              className={`mt-1 ${fieldClass("address")}`}
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Add any notes about this company..."
              className={`mt-1 min-h-[80px] ${fieldClass("notes")}`}
            />
          </div>

          {/* Submit */}
          <SheetFooter className="pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCompany.isPending}
              className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white gap-2"
            >
              {createCompany.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><Building2 className="w-4 h-4" /> Create Company</>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
