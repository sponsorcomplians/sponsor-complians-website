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
  Loader2, Sparkles, UserPlus, Check, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (id: number) => void;
}

export default function AddContactDialog({ open, onOpenChange, onSuccess }: AddContactDialogProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    source: "manual" as const,
    status: "new" as const,
    notes: "",
  });
  const [enriching, setEnriching] = useState(false);
  const [enrichedFields, setEnrichedFields] = useState<Set<string>>(new Set());

  const utils = trpc.useUtils();
  const createContact = trpc.contacts.create.useMutation({
    onSuccess: (data) => {
      toast.success("Contact created successfully");
      utils.contacts.list.invalidate();
      utils.contacts.stats.invalidate();
      onOpenChange(false);
      resetForm();
      if (onSuccess) onSuccess(data.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create contact");
    },
  });

  const enrichContact = trpc.enrichment.enrichContact.useMutation();

  const resetForm = () => {
    setForm({
      firstName: "", lastName: "", email: "", phone: "",
      company: "", jobTitle: "", source: "manual", status: "new", notes: "",
    });
    setEnrichedFields(new Set());
  };

  const handleEnrich = async () => {
    if (!form.firstName && !form.lastName && !form.email && !form.company) {
      toast.error("Enter at least a name, email, or company to enrich");
      return;
    }
    setEnriching(true);
    try {
      const result = await enrichContact.mutateAsync({
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        email: form.email || undefined,
        company: form.company || undefined,
        jobTitle: form.jobTitle || undefined,
      });

      if (result.error) {
        toast.error("Could not find enrichment data");
        return;
      }

      const newEnriched = new Set<string>();
      const updates: Partial<typeof form> = {};

      if (result.phone && !form.phone) { updates.phone = result.phone; newEnriched.add("phone"); }
      if (result.company && !form.company) { updates.company = result.company; newEnriched.add("company"); }
      if (result.jobTitle && !form.jobTitle) { updates.jobTitle = result.jobTitle; newEnriched.add("jobTitle"); }
      if (result.firstName && !form.firstName) { updates.firstName = result.firstName; newEnriched.add("firstName"); }
      if (result.lastName && !form.lastName) { updates.lastName = result.lastName; newEnriched.add("lastName"); }
      if (result.email && !form.email) { updates.email = result.email; newEnriched.add("email"); }

      // Add enriched info to notes
      const enrichNotes: string[] = [];
      if (result.linkedinUrl) enrichNotes.push(`LinkedIn: ${result.linkedinUrl}`);
      if (result.companyWebsite) enrichNotes.push(`Company Website: ${result.companyWebsite}`);
      if (result.companyIndustry) enrichNotes.push(`Industry: ${result.companyIndustry}`);
      if (result.companySize) enrichNotes.push(`Company Size: ${result.companySize}`);
      if (result.companyAddress) enrichNotes.push(`Company Address: ${result.companyAddress}`);
      if (result.bio) enrichNotes.push(`Bio: ${result.bio}`);

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
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error("First name, last name, and email are required");
      return;
    }
    createContact.mutate(form);
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
            <UserPlus className="w-5 h-5 text-[#0d9488]" /> Add Contact
          </SheetTitle>
          <SheetDescription>
            Add a new contact to your database. Use the enrichment button to auto-fill fields.
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
                  Auto-fill fields from web data. Enter a name, email, or company first.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={enriching || (!form.firstName && !form.email && !form.company)}
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

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-[#374151]">First Name *</Label>
              <Input
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="John"
                className={`mt-1 ${fieldClass("firstName")}`}
                required
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-[#374151]">Last Name *</Label>
              <Input
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
                className={`mt-1 ${fieldClass("lastName")}`}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="john@company.com"
              className={`mt-1 ${fieldClass("email")}`}
              required
            />
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

          {/* Company */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Company</Label>
            <Input
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder="Acme Ltd"
              className={`mt-1 ${fieldClass("company")}`}
            />
          </div>

          {/* Job Title */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Job Title</Label>
            <Input
              value={form.jobTitle}
              onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
              placeholder="HR Director"
              className={`mt-1 ${fieldClass("jobTitle")}`}
            />
          </div>

          {/* Source & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-[#374151]">Source</Label>
              <select
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value as any }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
              >
                <option value="manual">Manual</option>
                <option value="contact_form">Contact Form</option>
                <option value="newsletter">Newsletter</option>
                <option value="signup">Signup</option>
                <option value="download">Download</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-xs font-medium text-[#374151]">Status</Label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-xs font-medium text-[#374151]">Notes</Label>
            <Textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Add any notes about this contact..."
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
              disabled={createContact.isPending}
              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2"
            >
              {createContact.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Contact</>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
