"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/index";
import { calculateGratuity } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";

export default function GratuityPage() {
  const [lastSalary, setLastSalary] = useState(80000);
  const [years, setYears] = useState(10);
  const [coveredByAct, setCoveredByAct] = useState(true);

  const result = useMemo(() => calculateGratuity(lastSalary, years, coveredByAct), [lastSalary, years, coveredByAct]);

  return (
    <CalculatorLayout
      title="Gratuity Calculator"
      description="Calculate your gratuity entitlement on retirement, resignation, or termination."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Employment Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organisation Type</label>
                <Tabs value={coveredByAct ? "covered" : "not-covered"} onValueChange={(v) => setCoveredByAct(v === "covered")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="covered" className="flex-1 text-xs">Covered by Act</TabsTrigger>
                    <TabsTrigger value="not-covered" className="flex-1 text-xs">Not Covered</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground">
                  {coveredByAct
                    ? "10+ employees — uses 15/26 formula"
                    : "Less than 10 employees — uses 15/30 formula"}
                </p>
              </div>
              <SliderField label="Last Drawn Monthly Salary (Basic + DA)" value={lastSalary} min={10000} max={500000} step={1000}
                onChange={setLastSalary} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <SliderField label="Years of Service" value={years} min={5} max={40} step={1}
                onChange={setYears} formatValue={(v) => `${v} yrs`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Gratuity Amount" value={formatCurrencyFull(result.gratuity)} highlight />
            <ResultCard label="Tax Exempt" value={formatCurrencyFull(result.taxExempt)} variant="success"
              sub="Max ₹20L exempt" />
            <ResultCard label="Taxable Gratuity" value={formatCurrencyFull(result.taxable)}
              variant={result.taxable > 0 ? "warning" : "default"} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Calculation Formula</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs">
                {coveredByAct
                  ? `Gratuity = (Last Salary × 15 × Years) ÷ 26`
                  : `Gratuity = (Last Salary × 15 × Years) ÷ 30`}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-muted-foreground">Last Monthly Salary</p>
                  <p className="font-semibold mt-1">{formatCurrencyFull(lastSalary)}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-muted-foreground">Years of Service</p>
                  <p className="font-semibold mt-1">{years} years</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 5 years of continuous service is required to be eligible for gratuity.
                Fractions of 6 months or more are rounded up to the next full year.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "Who is eligible for gratuity?", answer: "Any employee who has completed 5 or more years of continuous service with an employer is eligible for gratuity upon resignation, retirement, or death/disablement." },
        { question: "Is gratuity tax-free?", answer: "Yes, up to ₹20 lakh is exempt from tax for employees covered under the Payment of Gratuity Act. Any amount above ₹20 lakh is taxable." },
        { question: "What is the difference between the two formulas?", answer: "For organisations covered under the Gratuity Act (10+ employees), divider is 26 (working days in a month). For smaller organisations, divider is 30 (calendar days)." },
        { question: "Does the employer have to pay gratuity?", answer: "Yes. Gratuity is a statutory obligation for organisations with 10 or more employees. Employers often secure this through a Group Gratuity scheme with an insurer." },
      ]} />
    </CalculatorLayout>
  );
}
