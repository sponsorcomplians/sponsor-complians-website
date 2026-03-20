import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Plus, Search, TrendingUp, Target,
  BarChart3, Building2, Calendar,
  ChevronDown, Pencil, Trash2, X, Save,
  ArrowRight, PoundSterling, Calculator, Filter,
  LayoutGrid, List, Percent, Tag, Minus,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Stage Config ─── */
const STAGES = [
  { key: "lead", label: "Lead", color: "#6366f1", bgColor: "bg-indigo-50", borderColor: "border-indigo-200", probability: 10 },
  { key: "qualified", label: "Qualified", color: "#0d9488", bgColor: "bg-teal-50", borderColor: "border-teal-200", probability: 25 },
  { key: "proposal", label: "Proposal", color: "#f59e0b", bgColor: "bg-amber-50", borderColor: "border-amber-200", probability: 50 },
  { key: "negotiation", label: "Negotiation", color: "#3b82f6", bgColor: "bg-blue-50", borderColor: "border-blue-200", probability: 75 },
  { key: "won", label: "Won", color: "#22c55e", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", probability: 100 },
  { key: "lost", label: "Lost", color: "#ef4444", bgColor: "bg-red-50", borderColor: "border-red-200", probability: 0 },
] as const;

/* ─── Products ─── */
const PRODUCTS = [
  { key: "compliance_audit", label: "Sponsor Compliance Audit", avgValue: 250000 },
  { key: "ho_visit_prep", label: "Home Office Visit Preparation", avgValue: 350000 },
  { key: "skilled_worker_recruitment", label: "Skilled Worker Recruitment", avgValue: 249500 },
  { key: "hr_doc_review", label: "HR & Documentation Review", avgValue: 150000 },
  { key: "complians_hub", label: "ComplIANS Hub Subscription", avgValue: 99900 },
  { key: "sponsored_listing", label: "Sponsored Job Listing", avgValue: 14900 },
  { key: "premium_listing", label: "Premium Job Listing", avgValue: 44900 },
  { key: "managed_recruitment", label: "Managed Recruitment", avgValue: 249500 },
  { key: "other", label: "Other", avgValue: 100000 },
];

function formatGBP(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);
}

/* ─── Deal Card (Kanban) ─── */
function DealCard({ deal, onEdit, onMove, onDelete, onNavigate }: {
  deal: any;
  onEdit: (deal: any) => void;
  onMove: (dealId: number, stage: string) => void;
  onDelete: (dealId: number) => void;
  onNavigate: (page: string) => void;
}) {
  const stageConfig = STAGES.find(s => s.key === deal.stage);
  const nextStage = STAGES[STAGES.findIndex(s => s.key === deal.stage) + 1];
  const prevStage = STAGES[STAGES.findIndex(s => s.key === deal.stage) - 1];

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-[#1F2937] line-clamp-1">{deal.title}</h4>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(deal)} className="p-1 rounded hover:bg-gray-100 text-[#9CA3AF]">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(deal.id)} className="p-1 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      {deal.value && (
        <div className="text-lg font-bold text-[#1F2937] mb-1">{formatGBP(deal.value)}</div>
      )}
      {deal.product && (
        <div className="text-[10px] text-[#6B7280] mb-2">{PRODUCTS.find(p => p.key === deal.product)?.label || deal.product}</div>
      )}
      <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mb-2">
        {deal.companyName && (
          <button
            onClick={() => onNavigate(`company:${encodeURIComponent(deal.companyName)}`)}
            className="flex items-center gap-1 hover:text-[#0d9488] transition-colors"
          >
            <Building2 className="w-3 h-3" /> {deal.companyName}
          </button>
        )}
        {deal.expectedCloseDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date(deal.expectedCloseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </span>
        )}
      </div>
      {deal.probability != null && (
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-0.5">
            <span>Probability</span>
            <span>{deal.probability}%</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${deal.probability}%`, backgroundColor: stageConfig?.color || "#6366f1" }} />
          </div>
        </div>
      )}
      {/* Stage move buttons */}
      <div className="flex items-center gap-1 pt-1 border-t border-gray-50">
        {prevStage && prevStage.key !== "lost" && (
          <button
            onClick={() => onMove(deal.id, prevStage.key)}
            className="flex items-center gap-0.5 text-[10px] text-[#9CA3AF] hover:text-[#6366f1] transition-colors"
          >
            <ChevronDown className="w-3 h-3 rotate-90" /> {prevStage.label}
          </button>
        )}
        <div className="flex-1" />
        {nextStage && (
          <button
            onClick={() => onMove(deal.id, nextStage.key)}
            className="flex items-center gap-0.5 text-[10px] font-medium hover:text-[#0d9488] transition-colors"
            style={{ color: nextStage.color }}
          >
            {nextStage.label} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── New Deal Form ─── */
function NewDealForm({ companies, onSave, onCancel }: {
  companies: any[];
  onSave: (deal: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    companyId: 0,
    value: "",
    product: "",
    stage: "lead",
    probability: 10,
    expectedCloseDate: "",
    notes: "",
  });

  const handleProductChange = (product: string) => {
    const p = PRODUCTS.find(pr => pr.key === product);
    setForm(f => ({
      ...f,
      product,
      value: p ? String(p.avgValue / 100) : f.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-[#1F2937]">New Deal</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-[#4B5563] mb-1 block">Deal Title *</label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Neptune Solutions - Compliance Audit" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#4B5563] mb-1 block">Company *</label>
            <select
              value={form.companyId}
              onChange={e => setForm(f => ({ ...f, companyId: Number(e.target.value) }))}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
            >
              <option value={0}>Select company...</option>
              {companies.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#4B5563] mb-1 block">Product / Service</label>
            <select
              value={form.product}
              onChange={e => handleProductChange(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
            >
              <option value="">Select product...</option>
              {PRODUCTS.map(p => (
                <option key={p.key} value={p.key}>{p.label} ({formatGBP(p.avgValue)})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#4B5563] mb-1 block">Value (£)</label>
              <Input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] mb-1 block">Stage</label>
              <select
                value={form.stage}
                onChange={e => {
                  const stage = e.target.value;
                  const s = STAGES.find(st => st.key === stage);
                  setForm(f => ({ ...f, stage, probability: s?.probability ?? f.probability }));
                }}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
              >
                {STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#4B5563] mb-1 block">Probability (%)</label>
              <Input type="number" min={0} max={100} value={form.probability} onChange={e => setForm(f => ({ ...f, probability: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-[#4B5563] mb-1 block">Expected Close</label>
              <Input type="date" value={form.expectedCloseDate} onChange={e => setForm(f => ({ ...f, expectedCloseDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#4B5563] mb-1 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 min-h-[60px]"
              placeholder="Additional notes..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white"
            disabled={!form.title || !form.companyId}
            onClick={() => onSave({
              ...form,
              companyId: form.companyId,
              value: form.value ? Math.round(Number(form.value) * 100) : undefined,
              expectedCloseDate: form.expectedCloseDate ? new Date(form.expectedCloseDate) : undefined,
              probability: form.probability,
            })}
          >
            <Save className="w-4 h-4 mr-1" /> Create Deal
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Revenue Forecast Calculator (Enhanced) ─── */
type OfferLine = { id: number; name: string; type: "percentage" | "fixed"; value: number };
type CalcItem = { product: string; quantity: number; unitPrice: number; discount: number };

function RevenueForecast({ deals }: { deals: any[] }) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcItems, setCalcItems] = useState<CalcItem[]>([
    { product: PRODUCTS[0].key, quantity: 1, unitPrice: PRODUCTS[0].avgValue / 100, discount: 0 },
  ]);
  const [offers, setOffers] = useState<OfferLine[]>([]);
  const [nextOfferId, setNextOfferId] = useState(1);

  const activeDeals = deals.filter(d => d.stage !== "won" && d.stage !== "lost");
  const wonDeals = deals.filter(d => d.stage === "won");
  const lostDeals = deals.filter(d => d.stage === "lost");

  const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const weightedValue = activeDeals.reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const lostValue = lostDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const winRate = wonDeals.length + lostDeals.length > 0
    ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
    : 0;

  // By product breakdown
  const byProduct = PRODUCTS.map(p => {
    const productDeals = activeDeals.filter(d => d.product === p.key);
    return {
      ...p,
      count: productDeals.length,
      totalValue: productDeals.reduce((sum, d) => sum + (d.value || 0), 0),
      weightedValue: productDeals.reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0),
    };
  }).filter(p => p.count > 0);

  // Monthly forecast (next 3 months)
  const now = new Date();
  const months = [0, 1, 2].map(offset => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    const monthDeals = activeDeals.filter(deal => {
      if (!deal.expectedCloseDate) return offset === 0;
      const closeDate = new Date(deal.expectedCloseDate);
      return closeDate >= d && closeDate <= monthEnd;
    });
    return {
      label: d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      deals: monthDeals.length,
      value: monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      weighted: monthDeals.reduce((sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0) / 100), 0),
    };
  });

  // Calculator logic
  const addCalcItem = () => {
    setCalcItems(items => [...items, { product: PRODUCTS[0].key, quantity: 1, unitPrice: PRODUCTS[0].avgValue / 100, discount: 0 }]);
  };
  const removeCalcItem = (idx: number) => {
    setCalcItems(items => items.filter((_, i) => i !== idx));
  };
  const updateCalcItem = (idx: number, field: keyof CalcItem, val: any) => {
    setCalcItems(items => items.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: val };
      if (field === "product") {
        const p = PRODUCTS.find(pr => pr.key === val);
        if (p) updated.unitPrice = p.avgValue / 100;
      }
      return updated;
    }));
  };
  const addOffer = () => {
    setOffers(o => [...o, { id: nextOfferId, name: "", type: "percentage", value: 0 }]);
    setNextOfferId(n => n + 1);
  };
  const removeOffer = (id: number) => {
    setOffers(o => o.filter(off => off.id !== id));
  };
  const updateOffer = (id: number, field: keyof OfferLine, val: any) => {
    setOffers(o => o.map(off => off.id === id ? { ...off, [field]: val } : off));
  };

  // Calculate totals
  const itemSubtotals = calcItems.map(item => {
    const gross = item.quantity * item.unitPrice;
    const discountAmount = gross * (item.discount / 100);
    return gross - discountAmount;
  });
  const subtotal = itemSubtotals.reduce((sum, v) => sum + v, 0);
  let afterOffers = subtotal;
  const offerBreakdown = offers.map(offer => {
    let deduction = 0;
    if (offer.type === "percentage") {
      deduction = afterOffers * (offer.value / 100);
    } else {
      deduction = offer.value;
    }
    afterOffers -= deduction;
    return { ...offer, deduction };
  });
  const projectedRevenue = Math.max(0, afterOffers);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Pipeline Value</span>
          </div>
          <div className="text-xl font-bold text-[#1F2937]">{formatGBP(pipelineValue)}</div>
          <div className="text-[10px] text-[#9CA3AF]">{activeDeals.length} active deals</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-teal-500" />
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Weighted Forecast</span>
          </div>
          <div className="text-xl font-bold text-[#0d9488]">{formatGBP(weightedValue)}</div>
          <div className="text-[10px] text-[#9CA3AF]">probability-adjusted</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <PoundSterling className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Won Revenue</span>
          </div>
          <div className="text-xl font-bold text-emerald-600">{formatGBP(wonValue)}</div>
          <div className="text-[10px] text-[#9CA3AF]">{wonDeals.length} deals closed</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[10px] text-[#9CA3AF]">Win Rate</span>
          </div>
          <div className="text-xl font-bold text-[#1F2937]">{winRate}%</div>
          <div className="text-[10px] text-[#9CA3AF]">{wonDeals.length}W / {lostDeals.length}L</div>
        </div>
      </div>

      {/* Monthly Forecast */}
      {months.some(m => m.deals > 0) && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-medium text-[#1F2937] text-sm mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0d9488]" /> Monthly Revenue Forecast
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {months.map(m => (
              <div key={m.label} className="text-center p-3 rounded-lg bg-gray-50">
                <div className="text-xs font-medium text-[#4B5563] mb-1">{m.label}</div>
                <div className="text-lg font-bold text-[#1F2937]">{formatGBP(m.weighted)}</div>
                <div className="text-[10px] text-[#9CA3AF]">{m.deals} deals · {formatGBP(m.value)} total</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Breakdown */}
      {byProduct.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-medium text-[#1F2937] text-sm mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0d9488]" /> Pipeline by Product
          </h3>
          <div className="space-y-2">
            {byProduct.map(p => (
              <div key={p.key} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm text-[#1F2937]">{p.label}</div>
                  <div className="text-[10px] text-[#9CA3AF]">{p.count} deal{p.count !== 1 ? "s" : ""}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#1F2937]">{formatGBP(p.totalValue)}</div>
                  <div className="text-[10px] text-[#0d9488]">{formatGBP(p.weightedValue)} weighted</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Projection Calculator */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl"
        >
          <h3 className="font-medium text-[#1F2937] text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#6366f1]" /> Revenue Projection Calculator
          </h3>
          <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${showCalculator ? "rotate-180" : ""}`} />
        </button>

        {showCalculator && (
          <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
            <p className="text-xs text-[#6B7280]">Add products/services, set quantities, per-item discounts, and offers to forecast revenue accurately.</p>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_80px_100px_80px_40px] gap-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-1">
                <span>Product</span>
                <span>Qty</span>
                <span>Unit Price (£)</span>
                <span>Discount %</span>
                <span></span>
              </div>
              {calcItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_80px_100px_80px_40px] gap-2 items-center">
                  <select
                    value={item.product}
                    onChange={e => updateCalcItem(idx, "product", e.target.value)}
                    className="rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateCalcItem(idx, "quantity", Math.max(1, Number(e.target.value)))}
                    className="text-xs h-8"
                  />
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={e => updateCalcItem(idx, "unitPrice", Number(e.target.value))}
                    className="text-xs h-8"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={item.discount}
                    onChange={e => updateCalcItem(idx, "discount", Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="text-xs h-8"
                  />
                  <button
                    onClick={() => removeCalcItem(idx)}
                    disabled={calcItems.length <= 1}
                    className="p-1.5 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCalcItem} className="text-xs gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Product Line
              </Button>
            </div>

            {/* Item Subtotals */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
              {calcItems.map((item, idx) => {
                const gross = item.quantity * item.unitPrice;
                const discountAmt = gross * (item.discount / 100);
                const net = gross - discountAmt;
                const productLabel = PRODUCTS.find(p => p.key === item.product)?.label || item.product;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">
                      {productLabel} × {item.quantity}
                      {item.discount > 0 && <span className="text-red-500 ml-1">(-{item.discount}%)</span>}
                    </span>
                    <span className="font-medium text-[#1F2937]">{formatGBP(Math.round(net * 100))}</span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between text-sm font-semibold pt-1.5 border-t border-gray-200">
                <span className="text-[#1F2937]">Subtotal</span>
                <span className="text-[#1F2937]">{formatGBP(Math.round(subtotal * 100))}</span>
              </div>
            </div>

            {/* Offers / Promotions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#4B5563] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#f59e0b]" /> Offers & Promotions
                </h4>
                <Button variant="outline" size="sm" onClick={addOffer} className="text-xs gap-1 h-7">
                  <Plus className="w-3 h-3" /> Add Offer
                </Button>
              </div>
              {offers.length === 0 && (
                <p className="text-[10px] text-[#9CA3AF]">No offers applied. Add an offer to adjust the projection.</p>
              )}
              {offers.map(offer => (
                <div key={offer.id} className="grid grid-cols-[1fr_120px_100px_40px] gap-2 items-center">
                  <Input
                    value={offer.name}
                    onChange={e => updateOffer(offer.id, "name", e.target.value)}
                    placeholder="e.g. Early Bird Discount"
                    className="text-xs h-8"
                  />
                  <select
                    value={offer.type}
                    onChange={e => updateOffer(offer.id, "type", e.target.value)}
                    className="rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (£)</option>
                  </select>
                  <Input
                    type="number"
                    min={0}
                    value={offer.value}
                    onChange={e => updateOffer(offer.id, "value", Number(e.target.value))}
                    className="text-xs h-8"
                    placeholder={offer.type === "percentage" ? "%" : "£"}
                  />
                  <button
                    onClick={() => removeOffer(offer.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Offer Breakdown + Final Projection */}
            {offers.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-3 space-y-1.5">
                {offerBreakdown.map(offer => (
                  <div key={offer.id} className="flex items-center justify-between text-xs">
                    <span className="text-[#92400e] flex items-center gap-1">
                      <Minus className="w-3 h-3" />
                      {offer.name || "Unnamed Offer"}
                      <span className="text-[10px] text-[#b45309]">
                        ({offer.type === "percentage" ? `${offer.value}%` : formatGBP(Math.round(offer.value * 100))})
                      </span>
                    </span>
                    <span className="font-medium text-red-600">-{formatGBP(Math.round(offer.deduction * 100))}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Revenue Projection Result */}
            <div className="bg-gradient-to-r from-[#0d9488]/10 to-[#6366f1]/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#4B5563] font-medium">Projected Revenue</div>
                <div className="text-[10px] text-[#9CA3AF]">After all discounts & offers</div>
              </div>
              <div className="text-2xl font-bold text-[#0d9488]">{formatGBP(Math.round(projectedRevenue * 100))}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Table View for Pipeline ─── */
function PipelineTable({ deals, onMove, onDelete, onNavigate }: {
  deals: any[];
  onMove: (dealId: number, stage: string) => void;
  onDelete: (dealId: number) => void;
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Deal</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Product</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Value</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Stage</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Probability</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Close Date</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal: any) => {
              const stageConfig = STAGES.find(s => s.key === deal.stage);
              const productLabel = PRODUCTS.find(p => p.key === deal.product)?.label || deal.product || "—";
              return (
                <tr key={deal.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#1F2937]">{deal.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    {deal.companyName ? (
                      <button
                        onClick={() => onNavigate(`company:${encodeURIComponent(deal.companyName)}`)}
                        className="text-[#6B7280] hover:text-[#0d9488] transition-colors flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3" /> {deal.companyName}
                      </button>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">{productLabel}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#1F2937]">
                    {deal.value ? formatGBP(deal.value) : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{ borderColor: stageConfig?.color, color: stageConfig?.color }}
                    >
                      {stageConfig?.label || deal.stage}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${deal.probability || 0}%`, backgroundColor: stageConfig?.color || "#6366f1" }}
                        />
                      </div>
                      <span className="text-[10px] text-[#6B7280]">{deal.probability || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {deal.expectedCloseDate
                      ? new Date(deal.expectedCloseDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Quick stage move */}
                      <select
                        value={deal.stage}
                        onChange={e => onMove(deal.id, e.target.value)}
                        className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-[#0d9488]/30"
                        onClick={e => e.stopPropagation()}
                      >
                        {STAGES.map(s => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => onDelete(deal.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Pipeline Page ─── */
export default function Pipeline({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [view, setView] = useState<"kanban" | "table" | "forecast">("kanban");
  const [search, setSearch] = useState("");
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [productFilter, setProductFilter] = useState("");

  const { data: dealsData, isLoading } = trpc.deals.list.useQuery({ limit: 500, search: search || undefined, product: productFilter || undefined });
  const { data: companiesData } = trpc.companies.list.useQuery({ limit: 500 });
  const createDeal = trpc.deals.create.useMutation();
  const updateDeal = trpc.deals.update.useMutation();
  const deleteDeal = trpc.deals.delete.useMutation();
  const utils = trpc.useUtils();

  const deals = useMemo(() => {
    if (!dealsData?.items || !companiesData?.items) return [];
    const companyMap = new Map(companiesData.items.map((c: any) => [c.id, c.name]));
    return dealsData.items.map((d: any) => ({ ...d, companyName: companyMap.get(d.companyId) || "Unknown" }));
  }, [dealsData, companiesData]);

  const handleCreateDeal = async (dealData: any) => {
    try {
      await createDeal.mutateAsync(dealData);
      utils.deals.list.invalidate();
      setShowNewDeal(false);
      toast.success("Deal created");
    } catch {
      toast.error("Failed to create deal");
    }
  };

  const handleMoveDeal = async (dealId: number, stage: string) => {
    const stageConfig = STAGES.find(s => s.key === stage);
    try {
      await updateDeal.mutateAsync({ id: dealId, stage: stage as any, probability: stageConfig?.probability ?? undefined });
      utils.deals.list.invalidate();
      toast.success(`Moved to ${stageConfig?.label}`);
    } catch {
      toast.error("Failed to move deal");
    }
  };

  const handleDeleteDeal = async (dealId: number) => {
    if (!confirm("Delete this deal?")) return;
    try {
      await deleteDeal.mutateAsync({ id: dealId });
      utils.deals.list.invalidate();
      toast.success("Deal deleted");
    } catch {
      toast.error("Failed to delete deal");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Sales Pipeline
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">Track deals, forecast revenue, and manage your sales process</p>
        </div>
        <Button className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white gap-2" onClick={() => setShowNewDeal(true)}>
          <Plus className="w-4 h-4" /> New Deal
        </Button>
      </div>

      {/* View Toggle + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${view === "kanban" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Board
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${view === "table" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
          <button
            onClick={() => setView("forecast")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${view === "forecast" ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280]"}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Forecast
          </button>
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <select
          value={productFilter}
          onChange={e => setProductFilter(e.target.value)}
          className="rounded-md border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30"
        >
          <option value="">All Products</option>
          {PRODUCTS.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
        </div>
      ) : view === "forecast" ? (
        <RevenueForecast deals={deals} />
      ) : view === "table" ? (
        deals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Target className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
            <h3 className="text-[#6B7280] font-medium mb-2">No deals yet</h3>
            <p className="text-[#9CA3AF] text-sm">Create your first deal to start tracking your pipeline</p>
          </div>
        ) : (
          <PipelineTable deals={deals} onMove={handleMoveDeal} onDelete={handleDeleteDeal} onNavigate={onNavigate} />
        )
      ) : (
        /* Kanban Board */
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: "60vh" }}>
          {STAGES.filter(s => s.key !== "lost").map(stage => {
            const stageDeals = deals.filter((d: any) => d.stage === stage.key);
            const stageValue = stageDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
            return (
              <div key={stage.key} className="flex-shrink-0 w-72">
                <div className={`rounded-t-lg px-3 py-2 ${stage.bgColor} border ${stage.borderColor} border-b-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                      <span className="text-xs font-semibold text-[#1F2937]">{stage.label}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{stageDeals.length}</Badge>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: stage.color }}>{formatGBP(stageValue)}</span>
                  </div>
                </div>
                <div className={`rounded-b-lg border ${stage.borderColor} border-t-0 bg-gray-50/50 p-2 space-y-2 min-h-[200px]`}>
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-[10px] text-[#9CA3AF]">No deals</p>
                    </div>
                  ) : (
                    stageDeals.map((deal: any) => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        onEdit={() => toast.info("Edit feature coming soon")}
                        onMove={handleMoveDeal}
                        onDelete={handleDeleteDeal}
                        onNavigate={onNavigate}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
          {/* Lost column - collapsed */}
          {(() => {
            const lostDeals = deals.filter((d: any) => d.stage === "lost");
            return lostDeals.length > 0 ? (
              <div className="flex-shrink-0 w-72">
                <div className="rounded-t-lg px-3 py-2 bg-red-50 border border-red-200 border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-semibold text-[#1F2937]">Lost</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lostDeals.length}</Badge>
                    </div>
                    <span className="text-[10px] font-medium text-red-500">{formatGBP(lostDeals.reduce((s: number, d: any) => s + (d.value || 0), 0))}</span>
                  </div>
                </div>
                <div className="rounded-b-lg border border-red-200 border-t-0 bg-red-50/30 p-2 space-y-2 min-h-[200px]">
                  {lostDeals.map((deal: any) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onEdit={() => toast.info("Edit feature coming soon")}
                      onMove={handleMoveDeal}
                      onDelete={handleDeleteDeal}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* New Deal Modal */}
      {showNewDeal && (
        <NewDealForm
          companies={companiesData?.items || []}
          onSave={handleCreateDeal}
          onCancel={() => setShowNewDeal(false)}
        />
      )}
    </div>
  );
}
