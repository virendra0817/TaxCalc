"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/index";
import { calculateFD } from "@/lib/calculators";
import { formatCurrencyFull, formatPercent } from "@/lib/utils";

export default function FDPage() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(3);
  const [compounding, setCompounding] = useState(4);

  const result = useMemo(() => calculateFD(principal, rate, years, compounding), [principal, rate, years, compounding]);

  return (
    <CalculatorLayout title="FD Calculator" description="Calculate your fixed deposit maturity value and effective annual yield.">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">FD Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Principal Amount" value={principal} min={10000} max={10000000} step={10000}
                onChange={setPrincipal} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(0)} L` : `₹${(v / 1000).toFixed(0)}K`} />
              <SliderField label="Interest Rate (p.a.)" value={rate} min={1} max={15} step={0.1}
                onChange={setRate} formatValue={(v) => `${v.toFixed(1)}%`} />
              <SliderField label="Duration" value={years} min={1} max={10} step={1}
                onChange={setYears} formatValue={(v) => `${v} yr${v > 1 ? "s" : ""}`} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Compounding Frequency</label>
                <Select value={String(compounding)} onValueChange={(v) => setCompounding(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually</SelectItem>
                    <SelectItem value="2">Half-Yearly</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Principal" value={formatCurrencyFull(principal)} />
            <ResultCard label="Interest Earned" value={formatCurrencyFull(result.interest)} variant="success" />
            <ResultCard label="Maturity Amount" value={formatCurrencyFull(result.maturity)} highlight />
          </ResultGrid>
          <ResultCard label="Effective Annual Yield" value={formatPercent(result.effectiveRate)} sub="Due to compounding effect" />
        </div>
      </div>
      <FAQ items={[
        { question: "How is FD interest calculated?", answer: "FD interest is computed using compound interest: A = P × (1 + r/n)^(nt), where n is the compounding frequency per year." },
        { question: "Is FD interest taxable?", answer: "Yes. FD interest is added to your income and taxed at your slab rate. TDS at 10% is deducted by the bank if interest exceeds ₹40,000/year (₹50,000 for seniors)." },
      ]} />
    </CalculatorLayout>
  );
}
