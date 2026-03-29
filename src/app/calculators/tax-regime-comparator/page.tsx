"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/index";
import { calculateNewRegimeTax, calculateOldRegimeTax } from "@/lib/calculators";
import { formatCurrencyFull, formatPercent } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function TaxRegimeComparatorPage() {
  const [income, setIncome] = useState(1200000);
  const [sec80C, setSec80C] = useState(150000);
  const [sec80D, setSec80D] = useState(25000);
  const [nps, setNps] = useState(50000);
  const [hraExemption, setHraExemption] = useState(100000);
  const [homeLoan, setHomeLoan] = useState(0);

  const newResult = useMemo(() => calculateNewRegimeTax(income), [income]);
  const oldResult = useMemo(() =>
    calculateOldRegimeTax(income, { sec80C, sec80D, nps, hra: hraExemption, homeLoanInterest: homeLoan }),
    [income, sec80C, sec80D, nps, hraExemption, homeLoan]
  );

  const savings = oldResult.netTax - newResult.netTax;
  const betterRegime = savings > 0 ? "new" : savings < 0 ? "old" : "equal";
  const fmt = formatCurrencyFull;

  return (
    <CalculatorLayout
      title="Old vs New Tax Regime"
      description="Compare your tax liability under both regimes to choose the most beneficial one."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Your Income & Deductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Annual Income" value={income} min={0} max={10000000} step={50000}
                onChange={setIncome} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)} L` : `₹${v}`} />
              <div className="border-t pt-4 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Old Regime Deductions</p>
                <SliderField label="80C Investments" value={sec80C} min={0} max={150000} step={5000}
                  onChange={setSec80C} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <SliderField label="80D Health Insurance" value={sec80D} min={0} max={100000} step={5000}
                  onChange={setSec80D} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <SliderField label="NPS (80CCD(1B))" value={nps} min={0} max={50000} step={5000}
                  onChange={setNps} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <SliderField label="HRA Exemption" value={hraExemption} min={0} max={500000} step={10000}
                  onChange={setHraExemption} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <SliderField label="Home Loan Interest" value={homeLoan} min={0} max={200000} step={10000}
                  onChange={setHomeLoan} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {/* Verdict */}
          <Card className={betterRegime === "new"
            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
            : betterRegime === "old"
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "border-border"
          }>
            <CardContent className="pt-5 flex items-center gap-4">
              {betterRegime !== "equal" ? (
                betterRegime === "new" ? <TrendingDown className="h-8 w-8 text-emerald-600" /> : <TrendingUp className="h-8 w-8 text-blue-600" />
              ) : null}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommended</p>
                <p className="text-xl font-bold font-space">
                  {betterRegime === "equal" ? "Both regimes are equal" :
                    betterRegime === "new" ? `New Regime saves ${fmt(Math.abs(savings))}` : `Old Regime saves ${fmt(Math.abs(savings))}`}
                </p>
              </div>
              {betterRegime !== "equal" && (
                <Badge variant="success" className="ml-auto">Better choice</Badge>
              )}
            </CardContent>
          </Card>

          {/* Side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            {/* New Regime */}
            <Card className={betterRegime === "new" ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">New Regime</CardTitle>
                  {betterRegime === "new" && <Badge variant="success">Recommended</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Taxable Income</span><span className="font-medium">{fmt(newResult.taxableIncome)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax Before Cess</span><span className="font-medium">{fmt(newResult.totalTax)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">87A Rebate</span><span className="font-medium text-emerald-600">-{fmt(newResult.rebate87A)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cess (4%)</span><span className="font-medium">{fmt(newResult.cess)}</span></div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Net Tax</span>
                    <span className="text-primary">{fmt(newResult.netTax)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Effective Rate</span>
                    <span>{formatPercent(newResult.effectiveRate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Old Regime */}
            <Card className={betterRegime === "old" ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Old Regime</CardTitle>
                  {betterRegime === "old" && <Badge variant="success">Recommended</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Taxable Income</span><span className="font-medium">{fmt(oldResult.taxableIncome)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax Before Cess</span><span className="font-medium">{fmt(oldResult.totalTax)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">87A Rebate</span><span className="font-medium text-emerald-600">-{fmt(oldResult.rebate87A)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cess (4%)</span><span className="font-medium">{fmt(oldResult.cess)}</span></div>
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Net Tax</span>
                    <span className="text-primary">{fmt(oldResult.netTax)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Effective Rate</span>
                    <span>{formatPercent(oldResult.effectiveRate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FAQ items={[
        { question: "When is the new regime better?", answer: "If your total deductions (80C + HRA + home loan etc.) are less than ₹3.75 lakh, the new regime typically saves more tax." },
        { question: "Can I switch between regimes each year?", answer: "Salaried employees can switch every year. Business owners/professionals can switch only once from old to new (can switch back once)." },
        { question: "What deductions are available in the new regime?", answer: "Standard deduction (₹75,000), employer NPS contribution (80CCD(2)), and a few specific exemptions. Most popular deductions like 80C, HRA, and home loan interest are not available." },
      ]} />
    </CalculatorLayout>
  );
}
