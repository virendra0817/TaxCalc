"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateOldRegimeTax } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const INSTRUMENTS = [
  { id: "epf", label: "EPF (Employee Provident Fund)", maxAmount: 150000, recommended: true, returns: "8.25%", risk: "None", lock: "Until retirement", note: "Auto-deducted from salary" },
  { id: "ppf", label: "Public Provident Fund (PPF)", maxAmount: 150000, recommended: true, returns: "7.1%", risk: "None", lock: "15 years", note: "Best for long-term" },
  { id: "elss", label: "ELSS Mutual Funds", maxAmount: 150000, recommended: true, returns: "12-15%*", risk: "Market", lock: "3 years", note: "Shortest lock-in, highest returns" },
  { id: "nsc", label: "NSC (National Savings Certificate)", maxAmount: 150000, recommended: false, returns: "7.7%", risk: "None", lock: "5 years", note: "Post office scheme" },
  { id: "lic", label: "LIC / Life Insurance Premium", maxAmount: 150000, recommended: false, returns: "4-6%", risk: "Low", lock: "Policy term", note: "Insurance + tax saving" },
  { id: "ssy", label: "Sukanya Samriddhi Yojana", maxAmount: 150000, recommended: false, returns: "8.2%", risk: "None", lock: "21 years / girl's marriage", note: "For girl child" },
  { id: "tuition", label: "Children's Tuition Fees", maxAmount: 150000, recommended: false, returns: "N/A", risk: "N/A", lock: "N/A", note: "Up to 2 children" },
];

export default function Planner80CPage() {
  const [income, setIncome] = useState(1000000);
  const [allocations, setAllocations] = useState<Record<string, number>>({
    epf: 60000,
    elss: 90000,
  });

  const totalAllocated = Object.values(allocations).reduce((sum, v) => sum + v, 0);
  const remaining = Math.max(0, 150000 - totalAllocated);
  const isMaxed = totalAllocated >= 150000;

  const oldTax = useMemo(() => calculateOldRegimeTax(income, { sec80C: Math.min(totalAllocated, 150000) }), [income, totalAllocated]);
  const noDeductionTax = useMemo(() => calculateOldRegimeTax(income, { sec80C: 0 }), [income]);
  const taxSaving = noDeductionTax.netTax - oldTax.netTax;

  const toggle = (id: string) => {
    setAllocations((prev) => {
      if (prev[id] !== undefined) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      const currentTotal = Object.values(prev).reduce((s, v) => s + v, 0);
      const canAdd = Math.min(150000 - currentTotal, 150000);
      if (canAdd <= 0) return prev;
      return { ...prev, [id]: Math.min(canAdd, 60000) };
    });
  };

  return (
    <CalculatorLayout
      title="80C Tax Saver Planner"
      description="Plan your Section 80C investments optimally and visualise your tax savings."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Your Income</CardTitle></CardHeader>
            <CardContent>
              <SliderField label="Annual Income" value={income} min={500000} max={10000000} step={50000}
                onChange={setIncome} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>80C Limit Used</span>
                <span className={`text-sm font-semibold ${isMaxed ? "text-emerald-600" : "text-amber-600"}`}>
                  ₹{(totalAllocated / 1000).toFixed(0)}K / ₹1.5L
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all ${isMaxed ? "bg-emerald-500" : "bg-primary"}`}
                  style={{ width: `${Math.min((totalAllocated / 150000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isMaxed ? "80C limit fully utilised ✓" : `₹${(remaining / 1000).toFixed(0)}K remaining`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Tax Saving" value={formatCurrencyFull(taxSaving)} variant="success" highlight />
            <ResultCard label="Tax Without 80C" value={formatCurrencyFull(noDeductionTax.netTax)} />
            <ResultCard label="Tax After 80C" value={formatCurrencyFull(oldTax.netTax)} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Select 80C Instruments</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {INSTRUMENTS.map((inst) => {
                const selected = allocations[inst.id] !== undefined;
                return (
                  <div key={inst.id}
                    onClick={() => toggle(inst.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selected ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground/30"}`}
                  >
                    {selected ? <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{inst.label}</p>
                        {inst.recommended && <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full font-medium">Recommended</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{inst.note} · Returns: {inst.returns} · Lock-in: {inst.lock}</p>
                      {selected && (
                        <div className="mt-2">
                          <input
                            type="range"
                            min={0}
                            max={150000}
                            step={5000}
                            value={allocations[inst.id]}
                            onChange={(e) => {
                              e.stopPropagation();
                              const val = Number(e.target.value);
                              const otherTotal = Object.entries(allocations).filter(([k]) => k !== inst.id).reduce((s, [, v]) => s + v, 0);
                              const maxVal = Math.min(150000 - otherTotal, 150000);
                              setAllocations((prev) => ({ ...prev, [inst.id]: Math.min(val, maxVal) }));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full accent-primary"
                          />
                          <p className="text-xs font-medium text-primary">{formatCurrencyFull(allocations[inst.id])}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "What is Section 80C?", answer: "Section 80C allows a deduction of up to ₹1.5 lakh per year from your taxable income under the old tax regime. This deduction can save up to ₹46,800 in taxes for someone in the 30% slab." },
        { question: "Which 80C investment has the best returns?", answer: "ELSS mutual funds historically offer the highest returns (12-15%) with the shortest lock-in of 3 years. PPF and SSY are best for guaranteed tax-free returns." },
        { question: "Is 80C available in the new tax regime?", answer: "No. Section 80C deductions are only available under the old tax regime. The new regime offers higher standard deduction (₹75,000) and lower tax rates instead." },
      ]} />
    </CalculatorLayout>
  );
}
