import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Users, ChevronLeft, ChevronRight, Loader2,
  Mail, Phone, Building2, Tag, Eye, Upload, Download,
  Filter, X, UserPlus, MoreHorizontal, ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import AddContactDialog from "@/components/AddContactDialog";

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  contact_form: { label: "Contact Form", color: "bg-blue-50 text-blue-700 border-blue-200" },
  newsletter: { label: "Newsletter", color: "bg-purple-50 text-purple-700 border-purple-200" },
  signup: { label: "Signup", color: "bg-green-50 text-green-700 border-green-200" },
  download: { label: "Download", color: "bg-amber-50 text-amber-700 border-amber-200" },
  manual: { label: "Manual", color: "bg-slate-50 text-slate-700 border-slate-200" },
  other: { label: "GHL Import", color: "bg-teal-50 text-teal-700 border-teal-200" },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  contacted: { label: "Contacted", color: "bg-blue-50 text-blue-700 border-blue-200" },
  qualified: { label: "Qualified", color: "bg-purple-50 text-purple-700 border-purple-200" },
  converted: { label: "Converted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  archived: { label: "Archived", color: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function AllContacts({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [showAddContact, setShowAddContact] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const PAGE_SIZE = 50;

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (val: string) => {
    setSearch(val);
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(0);
    }, 400);
    setSearchTimeout(t);
  };

  const queryInput = useMemo(() => ({
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
    search: debouncedSearch || undefined,
    source: sourceFilter || undefined,
    status: statusFilter || undefined,
  }), [page, debouncedSearch, sourceFilter, statusFilter]);

  const { data, isLoading } = trpc.contacts.list.useQuery(queryInput);
  const { data: stats } = trpc.contacts.stats.useQuery();

  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);
  const startIdx = page * PAGE_SIZE + 1;
  const endIdx = Math.min((page + 1) * PAGE_SIZE, data?.total ?? 0);

  const clearFilters = () => {
    setSourceFilter("");
    setStatusFilter("");
    setSearch("");
    setDebouncedSearch("");
    setPage(0);
  };

  const hasFilters = sourceFilter || statusFilter || debouncedSearch;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            All Contacts
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {stats ? `${Number(stats.total).toLocaleString()} contacts in your database` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => onNavigate("import")}
          >
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
          <Button
            className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2 text-sm"
            onClick={() => setShowAddContact(true)}
          >
            <UserPlus className="w-4 h-4" /> Add Contact
          </Button>
          <AddContactDialog
            open={showAddContact}
            onOpenChange={setShowAddContact}
            onSuccess={(id) => onNavigate(`contact-${id}`)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1F2937]">{Number(stats.total).toLocaleString()}</div>
                <div className="text-xs text-[#9CA3AF]">Total Contacts</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1F2937]">
                  {stats.bySource?.find((s: any) => s.source === "other")?.count
                    ? Number(stats.bySource.find((s: any) => s.source === "other")?.count).toLocaleString()
                    : "0"}
                </div>
                <div className="text-xs text-[#9CA3AF]">GHL Imported</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1F2937]">{Number(stats.recentCount).toLocaleString()}</div>
                <div className="text-xs text-[#9CA3AF]">Last 7 Days</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1F2937]">
                  {stats.bySource?.filter((s: any) => s.source !== "other").reduce((sum: number, s: any) => sum + Number(s.count), 0).toLocaleString() ?? "0"}
                </div>
                <div className="text-xs text-[#9CA3AF]">Website Leads</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <Input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name, email, company..."
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            className={`gap-2 text-sm ${showFilters ? "bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488]" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" /> Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
            )}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="text-xs text-[#9CA3AF] gap-1" onClick={clearFilters}>
              <X className="w-3 h-3" /> Clear
            </Button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Source</label>
              <select
                value={sourceFilter}
                onChange={e => { setSourceFilter(e.target.value); setPage(0); }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
              >
                <option value="">All Sources</option>
                <option value="other">GHL Import</option>
                <option value="contact_form">Contact Form</option>
                <option value="newsletter">Newsletter</option>
                <option value="signup">Signup</option>
                <option value="download">Download</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#374151] bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#0d9488]" />
            <span className="ml-3 text-[#6B7280] text-sm">Loading contacts...</span>
          </div>
        ) : !data?.items?.length ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-[#6B7280] font-medium mb-2">
              {hasFilters ? "No contacts match your filters" : "No contacts yet"}
            </h3>
            <p className="text-[#9CA3AF] text-sm mb-4">
              {hasFilters ? "Try adjusting your search or filter criteria." : "Import contacts from a CSV file or add them manually."}
            </p>
            {hasFilters ? (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" /> Clear Filters
              </Button>
            ) : (
              <Button onClick={() => onNavigate("import")} className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2">
                <Upload className="w-4 h-4" /> Import Contacts
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Source</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Tags</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.items.map((contact: any) => {
                    const sourceMeta = SOURCE_LABELS[contact.source] || SOURCE_LABELS.other;
                    const statusMeta = STATUS_LABELS[contact.status] || STATUS_LABELS.new;
                    let parsedTags: string[] = [];
                    try {
                      if (contact.tags) parsedTags = JSON.parse(contact.tags);
                    } catch { /* ignore */ }

                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                        onClick={() => onNavigate(`contact-${contact.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d9488] to-[#14b8a6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {(contact.firstName?.[0] || "?").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-[#1F2937] text-sm truncate">
                                {contact.firstName} {contact.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6B7280] truncate max-w-[200px]">{contact.email}</td>
                        <td className="px-4 py-3 text-sm text-[#6B7280] hidden md:table-cell">
                          {contact.phone || <span className="text-[#D1D5DB]">—</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6B7280] hidden lg:table-cell truncate max-w-[150px]">
                          {contact.company || <span className="text-[#D1D5DB]">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-[10px] ${sourceMeta.color}`}>
                            {sourceMeta.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Badge variant="outline" className={`text-[10px] ${statusMeta.color}`}>
                            {statusMeta.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {parsedTags.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              {parsedTags.slice(0, 2).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-[9px] bg-gray-50 text-gray-600 border-gray-200">
                                  {tag}
                                </Badge>
                              ))}
                              {parsedTags.length > 2 && (
                                <span className="text-[10px] text-[#9CA3AF]">+{parsedTags.length - 2}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#D1D5DB] text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#9CA3AF]">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); onNavigate(`contact-${contact.id}`); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-[#9CA3AF] hover:text-[#0d9488] transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-[#F9FAFB]">
              <div className="text-sm text-[#6B7280]">
                Showing <span className="font-medium text-[#1F2937]">{startIdx}</span> to{" "}
                <span className="font-medium text-[#1F2937]">{endIdx}</span> of{" "}
                <span className="font-medium text-[#1F2937]">{Number(data.total).toLocaleString()}</span> contacts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" /> Previous
                </Button>
                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (page < 3) {
                      pageNum = i;
                    } else if (page > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          page === pageNum
                            ? "bg-[#0d9488] text-white"
                            : "text-[#6B7280] hover:bg-gray-100"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  {totalPages > 5 && page < totalPages - 3 && (
                    <>
                      <span className="text-[#9CA3AF] text-xs">...</span>
                      <button
                        onClick={() => setPage(totalPages - 1)}
                        className="w-8 h-8 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  className="gap-1 text-xs"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
