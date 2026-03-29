"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsList, TabsTrigger } from "@/components/ui/index";
import { calculateStampDuty, stampDutyRates } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";

export default function StampDutyPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [state, setState] = useState("Maharashtra");
  const [ownershipType, setOwnershipType] = useState<"male" | "female" | "joint">("male");

  const result = useMemo(() =>
    calculateStampDuty(propertyValue, state, ownershipType),
    [propertyValue, state, ownershipType]
  );

  return (
    <CalculatorLayout
      title="Stamp Duty Calculator"
      description="State-wise stamp duty and registration charges for property purchase in India."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Property Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Property Value" value={propertyValue} min={500000} max={50000000} step={100000}
                onChange={setPropertyValue} formatValue={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)} Cr` : `₹${(v / 100000).toFixed(0)} L`} />

              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(stampDutyRates).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Owner Type</label>
                <Tabs value={ownershipType} onValueChange={(v) => setOwnershipType(v as "male" | "female" | "joint")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="male" className="flex-1">Male</TabsTrigger>
                    <TabsTrigger value="female" className="flex-1">Female</TabsTrigger>
                    <TabsTrigger value="joint" className="flex-1">Joint</TabsTrigger>
                  </TabsList>
                </Tabs>
                <p className="text-xs text-muted-foreground">
                  Female owners often get 1-2% concession on stamp duty in many states.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Stamp Duty" value={formatCurrencyFull(result.stampDuty)}
              sub={`@ ${result.dutyRate}%`} variant="warning" />
            <ResultCard label="Registration Fee" value={formatCurrencyFull(result.registrationFee)}
              sub={`@ ${result.registrationRate}%`} />
            <ResultCard label="Total Cost" value={formatCurrencyFull(result.total)} highlight />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Rates Across All States</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 font-medium">State</th>
                      <th className="text-center py-2 font-medium">Male</th>
                      <th className="text-center py-2 font-medium">Female</th>
                      <th className="text-center py-2 font-medium">Reg.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stampDutyRates).map(([s, rates]) => (
                      <tr key={s} className={`border-b last:border-0 transition-colors ${s === state ? "bg-primary/5 font-medium" : "hover:bg-muted/30"}`}>
                        <td className="py-2.5 text-xs">{s}</td>
                        <td className="py-2.5 text-center text-xs">{rates.male}%</td>
                        <td className="py-2.5 text-center text-xs text-emerald-600">{rates.female}%</td>
                        <td className="py-2.5 text-center text-xs">{rates.registration}%</td>
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
        { question: "What is stamp duty?", answer: "Stamp duty is a state government tax levied on property transactions. It makes the transaction legally valid. Rates vary by state (typically 4-8% of property value)." },
        { question: "Do women get a concession on stamp duty?", answer: "Yes, most states offer a 1-2% concession to female property buyers. This is a government initiative to encourage women's property ownership." },
        { question: "Is stamp duty a one-time cost?", answer: "Yes, stamp duty is a one-time cost paid at the time of property registration. Along with registration fees and GST on under-construction property, it's part of your total property acquisition cost." },
      ]} />
    </CalculatorLayout>
  );
}
