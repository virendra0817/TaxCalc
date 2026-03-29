"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/index";
import { calculateNewRegimeTax, calculateOldRegimeTax } from "@/lib/calculators";
import { formatCurrencyFull, formatPercent } from "@/lib/utils";

export default function IncomeTaxPage() {
  const [income, setIncome] = useState(1000000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [fy, setFy] = useState<"2025-26" | "2024-25">("2025-26");
  const [deductions, setDeductions] = useState({ sec80C: 150000, sec80D: 25000, nps: 50000, homeLoanInterest: 0, other: 0 });

  const result = useMemo(() => {
    if (regime === "new") return calculateNewRegimeTax(income, fy);
    return calculateOldRegimeTax(income, deductions);
  }, [income, regime, fy, deductions]);

  const fmt = (v: number) => formatCurrencyFull(v);

  return (
    <CalculatorLayout
      title="Income Tax Calculator"
      description="Calculate your income tax liability for FY 2025-26 under new or old regime."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Financial Year</label>
                  <Select value={fy} onValueChange={(v) => setFy(v as "2025-26" | "2024-25")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-26">FY 2025-26</SelectItem>
                      <SelectItem value="2024-25">FY 2024-25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Tax Regime</label>
                  <Select value={regime} onValueChange={(v) => setRegime(v as "new" | "old")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Regime</SelectItem>
                      <SelectItem value="old">Old Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SliderField label="Annual Income" value={income} min={0} max={10000000} step={50000}
                onChange={setIncome} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)} L` : `₹${v.toLocaleString("en-IN")}`} />

              {regime === "old" && (
                <div className="space-y-4 pt-2 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Deductions</p>
                  <SliderField label="Section 80C" value={deductions.sec80C} min={0} max={150000} step={5000}
                    onChange={(v) => setDeductions((d) => ({ ...d, sec80C: v }))} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <SliderField label="Section 80D (Health)" value={deductions.sec80D} min={0} max={100000} step={5000}
                    onChange={(v) => setDeductions((d) => ({ ...d, sec80D: v }))} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <SliderField label="NPS (80CCD(1B))" value={deductions.nps} min={0} max={50000} step={5000}
                    onChange={(v) => setDeductions((d) => ({ ...d, nps: v }))} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <SliderField label="Home Loan Interest" value={deductions.homeLoanInterest} min={0} max={200000} step={10000}
                    onChange={(v) => setDeductions((d) => ({ ...d, homeLoanInterest: v }))} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Taxable Income" value={fmt(result.taxableIncome)} />
            <ResultCard label="Total Tax Payable" value={fmt(result.netTax)} highlight variant="success" />
            <ResultCard label="Effective Rate" value={formatPercent(result.effectiveRate)} />
          </ResultGrid>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Section 87A Rebate" value={fmt(result.rebate87A)} variant={result.rebate87A > 0 ? "success" : "default"} />
            <ResultCard label="Health & Education Cess (4%)" value={fmt(result.cess)} />
          </div>

          {/* Tax slab table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tax Slab Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 font-medium">Income Slab</th>
                      <th className="text-center py-2 font-medium">Rate</th>
                      <th className="text-right py-2 font-medium">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.slabs.map((slab, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 text-xs">{slab.range}</td>
                        <td className="py-2.5 text-center font-medium text-muted-foreground">{slab.rate}</td>
                        <td className="py-2.5 text-right font-medium">{slab.tax > 0 ? fmt(slab.tax) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "How is income tax calculated in India?", answer: "Income tax is calculated on your taxable income (gross income minus deductions) using progressive tax slabs. You then add 4% Health & Education cess on the tax amount." },
        { question: "What is the Section 87A rebate?", answer: "Under FY 2025-26 new regime, if your taxable income is up to ₹12 lakh, you get a rebate equal to your full tax liability (up to ₹60,000), effectively making your tax zero." },
        { question: "Which regime is better?", answer: "The new regime is better for most salaried employees with few deductions. The old regime benefits those with high 80C investments, HRA exemption, and home loan interest." },
        { question: "What is standard deduction?", answer: "Standard deduction is ₹75,000 under new regime (FY 2025-26) and ₹50,000 under old regime. It's automatically deducted from your salary before computing tax." },
        { question: "What is health & education cess?", answer: "Cess is 4% charged on your income tax. It funds health and education initiatives. It's applied after all deductions and rebates." },
      ]} />
    </CalculatorLayout>
  );
}
