"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateNewRegimeTax, calculateAdvanceTax } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

export default function AdvanceTaxPage() {
  const [income, setIncome] = useState(2000000);

  const taxResult = useMemo(() => calculateNewRegimeTax(income), [income]);
  const schedule = useMemo(() => calculateAdvanceTax(taxResult.netTax), [taxResult.netTax]);

  const today = new Date();
  const quarters = [
    { date: new Date(today.getFullYear(), 5, 15), label: "Q1 — Jun 15" },
    { date: new Date(today.getFullYear(), 8, 15), label: "Q2 — Sep 15" },
    { date: new Date(today.getFullYear(), 11, 15), label: "Q3 — Dec 15" },
    { date: new Date(today.getFullYear() + 1, 2, 15), label: "Q4 — Mar 15" },
  ];

  return (
    <CalculatorLayout
      title="Advance Tax Calculator"
      description="Calculate quarterly advance tax instalments and avoid interest penalties under Section 234B & 234C."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Annual Income</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Total Annual Income" value={income} min={0} max={10000000} step={50000}
                onChange={setIncome} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)} L` : `₹${v}`} />
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Advance tax applies if total tax liability exceeds ₹10,000. Tax is calculated using New Regime FY 2025-26.
                </p>
              </div>
            </CardContent>
          </Card>

          <ResultCard label="Total Tax Liability" value={formatCurrencyFull(taxResult.netTax)} highlight />
        </div>

        <div className="lg:col-span-3 space-y-5">
          {taxResult.netTax < 10000 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold mb-2">No Advance Tax Required</h3>
                <p className="text-sm text-muted-foreground">Your tax liability is below ₹10,000. Advance tax is not applicable.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Quarterly Payment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.map((q, i) => {
                    const isPast = quarters[i].date < today;
                    const isNext = !isPast && (i === 0 || quarters[i - 1].date < today);
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        isNext ? "bg-primary/5 border-primary/40" : isPast ? "bg-muted/30 opacity-60" : "bg-card"
                      }`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isPast ? "bg-muted text-muted-foreground" : isNext ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                        }`}>
                          Q{i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{quarters[i].label}</p>
                          <p className="text-xs text-muted-foreground">
                            {q.percentage}% of annual tax
                            {isNext && <span className="ml-2 text-primary font-medium">← Due next</span>}
                            {isPast && <span className="ml-2 text-muted-foreground">(Past due)</span>}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatCurrencyFull(q.dueAmount)}</p>
                          <p className="text-xs text-muted-foreground">Cumulative: {formatCurrencyFull(q.cumulative)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FAQ items={[
        { question: "Who needs to pay advance tax?", answer: "Any taxpayer (salaried, self-employed, or business) whose total tax liability after TDS exceeds ₹10,000 in a financial year must pay advance tax." },
        { question: "What happens if I miss the advance tax deadline?", answer: "You'll pay interest under Section 234C (1% per month on shortfall for each quarter) and 234B (1% per month if you paid less than 90% of assessed tax)." },
        { question: "What are the advance tax due dates?", answer: "Q1: 15% by June 15, Q2: 45% by September 15, Q3: 75% by December 15, Q4: 100% by March 15." },
        { question: "Is advance tax applicable for salaried employees?", answer: "Generally no — TDS from salary covers tax liability. But if you have significant other income (rent, capital gains, freelancing), you may need to pay advance tax on that portion." },
      ]} />
    </CalculatorLayout>
  );
}
