"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/index";
import { calculateCTCToInHand } from "@/lib/calculators";
import { formatCurrencyFull, formatPercent } from "@/lib/utils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function CTCToInHandPage() {
  const [ctc, setCtc] = useState(1500000);
  const [regime, setRegime] = useState<"new" | "old">("new");

  const result = useMemo(() => calculateCTCToInHand(ctc, true, 2400, regime), [ctc, regime]);

  const pieData = [
    { name: "Monthly In-Hand", value: result.monthlyInHand * 12, color: "#10b981" },
    { name: "Income Tax", value: result.incomeTax, color: "#f59e0b" },
    { name: "EPF (Employee)", value: result.epf, color: "#6366f1" },
    { name: "Professional Tax", value: result.professionalTax, color: "#ec4899" },
  ].filter((d) => d.value > 0);

  return (
    <CalculatorLayout
      title="CTC to In-Hand Calculator"
      description="Convert your Cost to Company (CTC) package into actual monthly take-home salary."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Package Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Annual CTC" value={ctc} min={300000} max={20000000} step={100000}
                onChange={setCtc} formatValue={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)} Cr` : `₹${(v / 100000).toFixed(1)} L`} />

              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Regime</label>
                <Tabs value={regime} onValueChange={(v) => setRegime(v as "new" | "old")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="new" className="flex-1">New Regime</TabsTrigger>
                    <TabsTrigger value="old" className="flex-1">Old Regime</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={2}>
            <ResultCard label="Monthly In-Hand" value={formatCurrencyFull(result.monthlyInHand)} highlight variant="success" />
            <ResultCard label="Annual In-Hand" value={formatCurrencyFull(result.annualInHand)} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Salary Breakup</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: "Gross CTC", value: result.ctc, note: "100%" },
                  { label: "Basic Salary (40% of CTC)", value: result.basicSalary },
                  { label: "HRA (50% of Basic)", value: result.hra },
                  { label: "Special Allowance", value: result.specialAllowance },
                  { label: "EPF Employer Contribution", value: result.epf, sub: true },
                  { label: "Gross Salary", value: result.grossSalary, bold: true },
                  { label: "Income Tax", value: -result.incomeTax, sub: true },
                  { label: "EPF Employee Contribution", value: -result.epf, sub: true },
                  { label: "Professional Tax", value: -result.professionalTax, sub: true },
                  { label: "Annual Take-Home", value: result.annualInHand, bold: true },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center justify-between py-2 ${i > 0 ? "border-t" : ""} ${row.bold ? "font-semibold" : ""}`}>
                    <span className={`text-sm ${row.sub ? "pl-4 text-muted-foreground" : ""}`}>{row.label}</span>
                    <span className={`text-sm font-medium ${row.value < 0 ? "text-red-500" : ""} ${row.bold ? "text-primary" : ""}`}>
                      {formatCurrencyFull(Math.abs(row.value))}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">CTC Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrencyFull(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "What is CTC?", answer: "Cost to Company (CTC) is the total amount a company spends on an employee annually, including salary, benefits, EPF, gratuity, and other components." },
        { question: "Why is in-hand salary much less than CTC?", answer: "CTC includes EPF contributions, gratuity provisions, income tax, professional tax, and insurance premiums — none of which you receive directly in hand." },
        { question: "How is basic salary typically structured?", answer: "Basic salary is usually 40-50% of CTC. A higher basic means higher EPF contribution and gratuity accrual, but also higher income tax if you have fewer deductions." },
      ]} />
    </CalculatorLayout>
  );
}
