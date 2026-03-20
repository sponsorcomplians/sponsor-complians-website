import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Search, Loader2, Plus, ArrowLeft, Users,
  Globe, Phone, MapPin, Briefcase, Calendar, Mail,
  PoundSterling, Edit, Trash2, X, Save, ExternalLink, Camera,
} from "lucide-react";
import { toast } from "sonner";
import AddCompanyDialog from "@/components/AddCompanyDialog";

function formatGBP(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

/* ─── Company Detail View ─── */
function CompanyDetail({ companyId, onBack, onNavigate }: {
  companyId: number;
  onBack: () => void;
  onNavigate: (page: string) => void;
}) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { data: company, isLoading } = trpc.companies.getById.useQuery({ id: companyId });
  const { data: contactsData } = trpc.companies.getContacts.useQuery(
    { companyName: (company as any)?.name || "" },
    { enabled: !!(company as any)?.name }
  );
  const { data: dealsData } = trpc.companies.getDeals.useQuery(
    { companyId },
    { enabled: !!companyId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16">
        <Building2 className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
        <h3 className="text-[#6B7280] font-medium mb-2">Company not found</h3>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Companies
        </Button>
      </div>
    );
  }

  const uploadAvatar = trpc.companies.uploadAvatar.useMutation();
  const utils = trpc.useUtils();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large. Max 5MB."); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await uploadAvatar.mutateAsync({ id: companyId, fileBase64: base64, contentType: file.type, fileName: file.name });
        utils.companies.getById.invalidate({ id: companyId });
        toast.success("Company logo updated");
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to upload logo");
      setUploadingAvatar(false);
    }
  };

  const c = company as any;
  const contacts = (contactsData || []) as any[];
  const deals = (dealsData || []) as any[];
  const totalDealValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const activeDeals = deals.filter((d: any) => d.stage !== "won" && d.stage !== "lost");

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#0d9488] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </button>

      {/* Company Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#0f172a] to-[#1e293b]" />
        <div className="px-6 pb-6 relative">
          <div className="flex items-start justify-between -mt-8">
            <div className="flex items-start gap-4">
              <div className="relative group/avatar">
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt={c.name} className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
                    {(c.name?.[0] || "?").toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                </label>
              </div>
              <div className="pt-9">
                <h1 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {c.name}
                </h1>
                {c.industry && <p className="text-sm text-[#6B7280]">{c.industry}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-9">
              <Button
                size="sm"
                className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-1 text-xs"
                onClick={() => {
                  if (contacts.length > 0) {
                    const emails = contacts.map((ct: any) => ct.email).filter(Boolean).join(",");
                    window.open(`mailto:${emails}?subject=${encodeURIComponent(`Regarding ${c.name}`)}`, "_blank");
                  } else {
                    toast.info("No contacts with email addresses found for this company");
                  }
                }}
              >
                <Mail className="w-3 h-3" /> Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-[#1F2937] mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.website && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Website</div>
                    <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noopener" className="text-sm text-[#0d9488] hover:underline flex items-center gap-1">
                      {c.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
              {c.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Phone</div>
                    <a href={`tel:${c.phone}`} className="text-sm text-[#1F2937] hover:text-[#0d9488]">{c.phone}</a>
                  </div>
                </div>
              )}
              {c.industry && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Industry</div>
                    <div className="text-sm text-[#1F2937]">{c.industry}</div>
                  </div>
                </div>
              )}
              {c.size && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Size</div>
                    <div className="text-sm text-[#1F2937]">{c.size}</div>
                  </div>
                </div>
              )}
              {c.address && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#9CA3AF]">Address</div>
                    <div className="text-sm text-[#1F2937]">{c.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Associated Contacts */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1F2937]">Contacts ({contacts.length})</h2>
            </div>
            {contacts.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] text-center py-4">No contacts associated with this company</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {contacts.map((contact: any) => (
                  <button
                    key={contact.id}
                    onClick={() => onNavigate(`contact:${contact.id}`)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(contact.firstName?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1F2937] truncate">{contact.firstName} {contact.lastName}</div>
                      <div className="text-[10px] text-[#9CA3AF] truncate">{contact.email}</div>
                    </div>
                    {contact.phone && (
                      <span className="text-[10px] text-[#9CA3AF] shrink-0">{contact.phone}</span>
                    )}
                    <Badge variant="outline" className="text-[10px] shrink-0">{contact.status}</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Deal Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Deal Summary</h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1F2937]">{formatGBP(totalDealValue)}</div>
                <div className="text-[10px] text-[#9CA3AF]">Total deal value</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <div className="text-lg font-bold text-indigo-600">{activeDeals.length}</div>
                  <div className="text-[10px] text-indigo-500">Active</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50">
                  <div className="text-lg font-bold text-emerald-600">{deals.filter((d: any) => d.stage === "won").length}</div>
                  <div className="text-[10px] text-emerald-500">Won</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deals List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Deals ({deals.length})</h3>
            {deals.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] text-center py-4">No deals yet</p>
            ) : (
              <div className="space-y-2">
                {deals.map((deal: any) => {
                  const stageColors: Record<string, string> = {
                    lead: "bg-indigo-50 text-indigo-600 border-indigo-200",
                    qualified: "bg-teal-50 text-teal-600 border-teal-200",
                    proposal: "bg-amber-50 text-amber-600 border-amber-200",
                    negotiation: "bg-blue-50 text-blue-600 border-blue-200",
                    won: "bg-emerald-50 text-emerald-600 border-emerald-200",
                    lost: "bg-red-50 text-red-600 border-red-200",
                  };
                  return (
                    <div key={deal.id} className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#1F2937] truncate">{deal.title}</span>
                        <Badge variant="outline" className={`text-[10px] ${stageColors[deal.stage] || ""}`}>{deal.stage}</Badge>
                      </div>
                      {deal.value && <div className="text-sm font-bold text-[#1F2937]">{formatGBP(deal.value)}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-medium text-[#1F2937] text-sm mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Contacts</span>
                <span className="text-xs font-medium text-[#1F2937]">{contacts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Total Deals</span>
                <span className="text-xs font-medium text-[#1F2937]">{deals.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Added</span>
                <span className="text-xs text-[#1F2937]">{new Date(c.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Companies List ─── */
export default function CompaniesPage({ onNavigate, initialCompanyName }: {
  onNavigate: (page: string) => void;
  initialCompanyName?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [findingCompany, setFindingCompany] = useState(!!initialCompanyName);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const pageSize = 50;

  const { data, isLoading } = trpc.companies.list.useQuery({
    limit: pageSize,
    offset: page * pageSize,
    search: search || undefined,
  });

  // If navigated from a contact with a company name, find the company
  const { data: searchResult } = trpc.companies.list.useQuery(
    { search: initialCompanyName, limit: 1 },
    { enabled: !!initialCompanyName && findingCompany }
  );

  // Auto-select company when found by name
  if (findingCompany && searchResult?.items?.[0]) {
    setSelectedCompanyId(searchResult.items[0].id);
    setFindingCompany(false);
  }

  if (selectedCompanyId) {
    return (
      <CompanyDetail
        companyId={selectedCompanyId}
        onBack={() => setSelectedCompanyId(null)}
        onNavigate={onNavigate}
      />
    );
  }

  const companies = [...(data?.items || [])].sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Companies
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">{total} companies in your database</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-white gap-2 text-sm"
            onClick={() => setShowAddCompany(true)}
          >
            <Plus className="w-4 h-4" /> Add Company
          </Button>
          <AddCompanyDialog
            open={showAddCompany}
            onOpenChange={setShowAddCompany}
            onSuccess={(id) => setSelectedCompanyId(id)}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Building2 className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
          <h3 className="text-[#6B7280] font-medium mb-2">No companies found</h3>
          <p className="text-sm text-[#9CA3AF]">Companies are auto-created from contact imports</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Industry</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Size</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Website</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Added</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company: any) => (
                  <tr
                    key={company.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCompanyId(company.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(company.name?.[0] || "?").toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1F2937] hover:text-[#0d9488]">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">{company.industry || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{company.size || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{company.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {company.website ? (
                        <a
                          href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener"
                          className="text-[#0d9488] hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          {company.website.replace(/^https?:\/\//, "").slice(0, 30)} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280]">
                      {new Date(company.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-xs text-[#9CA3AF]">
                Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="text-xs">Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="text-xs">Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
