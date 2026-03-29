"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { calculateEMI } from "@/lib/calculators";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";

export default function HomeLoanEMIPage() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => calculateEMI(principal, rate, tenure * 12), [principal, rate, tenure]);

  return (
    <CalculatorLayout
      title="Home Loan EMI Calculator"
      description="Calculate your monthly EMI, total interest payable, and full amortization schedule."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Loan Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Loan Amount" value={principal} min={100000} max={50000000} step={100000}
                onChange={setPrincipal} formatValue={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)} Cr` : `₹${(v / 100000).toFixed(0)} L`} />
              <SliderField label="Interest Rate (p.a.)" value={rate} min={5} max={20} step={0.1}
                onChange={setRate} formatValue={(v) => `${v.toFixed(1)}%`} />
              <SliderField label="Loan Tenure" value={tenure} min={1} max={30} step={1}
                onChange={setTenure} formatValue={(v) => `${v} yr${v > 1 ? "s" : ""}`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Monthly EMI" value={formatCurrencyFull(result.emi)} highlight />
            <ResultCard label="Total Interest" value={formatCurrencyFull(result.totalInterest)} variant="warning" />
            <ResultCard label="Total Payment" value={formatCurrencyFull(result.totalPayment)} />
          </ResultGrid>

          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Principal" value={formatCurrencyFull(principal)} />
            <ResultCard label="Interest to Principal Ratio" value={`${((result.totalInterest / principal) * 100).toFixed(0)}%`} />
          </div>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Yearly Amortization</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={result.yearlyData?.slice(0, 20)} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={70} />
                  <Tooltip formatter={(v: number) => formatCurrencyFull(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="principal" name="Principal" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interest" name="Interest" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "How is EMI calculated?", answer: "EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P = principal, r = monthly rate, n = tenure in months. A lower rate or shorter tenure reduces EMI." },
        { question: "What is the impact of interest rate on EMI?", answer: "Even a 0.5% rate difference significantly impacts total interest. On a ₹50L loan for 20 years, 8.5% vs 9% means ₹1.7L extra interest over the tenure." },
        { question: "Should I choose a shorter or longer tenure?", answer: "Shorter tenure means higher EMI but much lower total interest. If you can afford the higher EMI, shorter tenures save significantly in the long run." },
      ]} />
    </CalculatorLayout>
  );
}
