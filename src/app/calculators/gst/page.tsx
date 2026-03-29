"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/index";
import { calculateGST } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";

const GST_RATES = [3, 5, 12, 18, 28];

export default function GSTPage() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  const result = useMemo(() => calculateGST(amount, gstRate, mode === "inclusive"), [amount, gstRate, mode]);

  return (
    <CalculatorLayout
      title="GST Calculator"
      description="Add or remove GST from any amount. Supports all GST slabs — 3%, 5%, 12%, 18%, 28%."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">GST Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" value={amount} min={0} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Enter amount" />
              </div>

              <div className="space-y-2">
                <Label>GST Rate</Label>
                <Select value={String(gstRate)} onValueChange={(v) => setGstRate(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GST_RATES.map((r) => (
                      <SelectItem key={r} value={String(r)}>{r}% GST</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={mode} onValueChange={(v) => setMode(v as "exclusive" | "inclusive")}>
                <TabsList className="w-full">
                  <TabsTrigger value="exclusive" className="flex-1">Add GST</TabsTrigger>
                  <TabsTrigger value="inclusive" className="flex-1">Remove GST</TabsTrigger>
                </TabsList>
              </Tabs>

              <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                {mode === "exclusive"
                  ? "Add GST: Enter the base price before tax. GST will be added on top."
                  : "Remove GST: Enter the price inclusive of GST. Base price will be extracted."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Base Amount" value={formatCurrencyFull(result.baseAmount)} />
            <ResultCard label={`GST (${gstRate}%)`} value={formatCurrencyFull(result.gstAmount)} variant="warning" />
            <ResultCard label="Total Amount" value={formatCurrencyFull(result.total)} highlight />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">GST Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Base / Taxable Amount", value: result.baseAmount },
                  { label: `CGST (${gstRate / 2}%)`, value: result.cgst },
                  { label: `SGST / UTGST (${gstRate / 2}%)`, value: result.sgst },
                  { label: "Total GST", value: result.gstAmount },
                  { label: "Total Amount (incl. GST)", value: result.total },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b last:border-0 last:font-semibold">
                    <span className="text-sm text-muted-foreground last:text-foreground">{row.label}</span>
                    <span className="font-medium">{formatCurrencyFull(row.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All rates quick ref */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Reference — All Rates</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {GST_RATES.map((r) => {
                  const q = calculateGST(amount, r, mode === "inclusive");
                  return (
                    <button key={r} onClick={() => setGstRate(r)}
                      className={`rounded-lg p-3 text-center transition-colors cursor-pointer ${gstRate === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
                      <p className="text-xs font-semibold">{r}%</p>
                      <p className="text-xs mt-0.5 opacity-80">{formatCurrencyFull(q.gstAmount)}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "What are the different GST slabs in India?", answer: "India has five GST rate slabs: 0% (essential items), 5% (basic necessities), 12% (standard goods), 18% (most services & goods), and 28% (luxury/sin goods)." },
        { question: "What is CGST and SGST?", answer: "GST is split equally between Central GST (CGST) and State GST (SGST). For an 18% GST transaction, 9% goes to the Centre and 9% to the State. For interstate transactions, IGST (full rate) applies." },
        { question: "How to remove GST from an amount?", answer: "To remove GST from an inclusive price: Base Price = Total / (1 + GST Rate/100). For example, ₹11,800 at 18% GST → Base = 11800 / 1.18 = ₹10,000." },
      ]} />
    </CalculatorLayout>
  );
}
