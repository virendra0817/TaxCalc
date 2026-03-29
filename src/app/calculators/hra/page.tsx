"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Tabs, TabsList, TabsTrigger } from "@/components/ui/index";
import { calculateHRAExemption } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";
import { Info } from "lucide-react";

export default function HRAPage() {
  const [basic, setBasic] = useState(600000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(300000);
  const [rentPaid, setRentPaid] = useState(240000);
  const [isMetro, setIsMetro] = useState(true);

  const result = useMemo(() =>
    calculateHRAExemption(basic / 12, da / 12, hraReceived / 12, rentPaid / 12, isMetro),
    [basic, da, hraReceived, rentPaid, isMetro]
  );

  const annualExempt = result.exempt * 12;
  const annualTaxable = result.taxable * 12;

  return (
    <CalculatorLayout
      title="HRA Calculator"
      description="Calculate your HRA exemption and the taxable portion of your House Rent Allowance."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Salary & Rent Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>City Type</Label>
                <Tabs value={isMetro ? "metro" : "non-metro"} onValueChange={(v) => setIsMetro(v === "metro")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="metro" className="flex-1">Metro (50%)</TabsTrigger>
                    <TabsTrigger value="non-metro" className="flex-1">Non-Metro (40%)</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground">Metro: Mumbai, Delhi, Chennai, Kolkata</p>
              </div>

              <SliderField label="Annual Basic Salary" value={basic} min={100000} max={5000000} step={10000}
                onChange={setBasic} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />
              <SliderField label="Annual DA (for HRA)" value={da} min={0} max={1000000} step={10000}
                onChange={setDa} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />
              <SliderField label="Annual HRA Received" value={hraReceived} min={0} max={2000000} step={10000}
                onChange={setHraReceived} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />
              <SliderField label="Annual Rent Paid" value={rentPaid} min={0} max={3000000} step={10000}
                onChange={setRentPaid} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={2}>
            <ResultCard label="HRA Exempt (Annual)" value={formatCurrencyFull(annualExempt)} variant="success" highlight />
            <ResultCard label="HRA Taxable (Annual)" value={formatCurrencyFull(annualTaxable)} variant={annualTaxable > 0 ? "warning" : "default"} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                HRA Exemption Calculation (Monthly)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Exemption = Minimum of the three amounts below:</p>
              <div className="space-y-3">
                {result.calculation.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${result.exempt * 12 === item.value * 12 ? "bg-primary/10 border border-primary/30" : "bg-muted/40"}`}>
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrencyFull(item.value)}/mo</span>
                      {result.exempt === item.value && (
                        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Minimum ✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "How is HRA exemption calculated?", answer: "HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of Basic+DA for metro / 40% for non-metro, and (3) Rent paid minus 10% of Basic+DA." },
        { question: "Is HRA available in the new tax regime?", answer: "No. HRA exemption is only available under the old tax regime. Under the new regime, HRA received is fully taxable." },
        { question: "What cities are considered metro for HRA?", answer: "Mumbai, Delhi, Chennai, and Kolkata are classified as metro cities, allowing 50% of Basic+DA as HRA exemption. All other cities are non-metro (40% limit)." },
        { question: "What if my rent is below 10% of basic salary?", answer: "If rent paid is less than 10% of Basic+DA, the third condition becomes zero, which means no HRA exemption is available regardless of HRA received." },
      ]} />
    </CalculatorLayout>
  );
}
