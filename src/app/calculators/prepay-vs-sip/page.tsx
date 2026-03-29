"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSIP } from "@/lib/calculators";
import { formatCurrencyFull, formatCurrency } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PrepayVsSIPPage() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [remainingYears, setRemainingYears] = useState(15);
  const [prepayAmount, setPrepayAmount] = useState(500000);
  const [sipReturn, setSipReturn] = useState(12);

  // Interest saved by prepaying
  const monthlyRate = loanRate / 12 / 100;
  const n = remainingYears * 12;
  const currentEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const newPrincipal = loanAmount - prepayAmount;
  const newEMI = (newPrincipal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const interestSaved = (currentEMI - newEMI) * n;

  // SIP value of same amount
  const sipResult = useMemo(() => calculateSIP(prepayAmount / remainingYears / 12, remainingYears, sipReturn), [prepayAmount, remainingYears, sipReturn]);
  // Lump sum investment value
  const lumpSumValue = prepayAmount * Math.pow(1 + sipReturn / 100, remainingYears);
  const lumpSumGain = lumpSumValue - prepayAmount;

  const prepayBetter = interestSaved > lumpSumGain;

  const chartData = Array.from({ length: remainingYears }, (_, i) => {
    const yr = i + 1;
    const iSaved = (currentEMI - newEMI) * yr * 12;
    const sipVal = prepayAmount * Math.pow(1 + sipReturn / 100, yr) - prepayAmount;
    return { year: yr, "Interest Saved": iSaved, "Investment Gains": sipVal };
  });

  return (
    <CalculatorLayout
      title="Prepay Loan vs Invest in SIP"
      description="Should you use your surplus to prepay your home loan or invest in mutual funds?"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Loan Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Outstanding Loan" value={loanAmount} min={500000} max={20000000} step={100000}
                onChange={setLoanAmount} formatValue={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)} Cr` : `₹${(v / 100000).toFixed(0)} L`} />
              <SliderField label="Loan Interest Rate" value={loanRate} min={6} max={16} step={0.1}
                onChange={setLoanRate} formatValue={(v) => `${v.toFixed(1)}%`} />
              <SliderField label="Remaining Tenure" value={remainingYears} min={1} max={25} step={1}
                onChange={setRemainingYears} formatValue={(v) => `${v} yrs`} />
              <SliderField label="Surplus Amount" value={prepayAmount} min={50000} max={5000000} step={50000}
                onChange={setPrepayAmount} formatValue={(v) => `₹${(v / 100000).toFixed(0)} L`} />
              <SliderField label="Expected SIP Return" value={sipReturn} min={6} max={20} step={0.5}
                onChange={setSipReturn} formatValue={(v) => `${v}%`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <Card className={prepayBetter ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-blue-400 bg-blue-50 dark:bg-blue-900/20"}>
            <CardContent className="pt-5">
              <p className="text-sm font-medium text-muted-foreground">Verdict</p>
              <p className="text-xl font-bold font-space mt-1">
                {prepayBetter
                  ? `Prepay the loan — saves ${formatCurrencyFull(interestSaved - lumpSumGain)} more`
                  : `Invest in SIP/MF — earns ${formatCurrencyFull(lumpSumGain - interestSaved)} more`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on lump sum investment at {sipReturn}% CAGR vs prepaying at {loanRate}% loan rate
              </p>
            </CardContent>
          </Card>

          <ResultGrid cols={2}>
            <ResultCard label="Interest Saved by Prepaying" value={formatCurrencyFull(interestSaved)} variant={prepayBetter ? "success" : "default"} />
            <ResultCard label="Investment Gain (Lump Sum)" value={formatCurrencyFull(lumpSumGain)} variant={!prepayBetter ? "success" : "default"} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Interest Saved vs Investment Gains Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPrepay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorSIP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={70} />
                  <Tooltip formatter={(v: number) => formatCurrencyFull(v)} labelFormatter={(l) => `Year ${l}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Area type="monotone" dataKey="Interest Saved" stroke="#f59e0b" fill="url(#colorPrepay)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Investment Gains" stroke="#10b981" fill="url(#colorSIP)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "When should I prepay my home loan?", answer: "Prepaying makes more sense when loan interest rate > expected investment returns, early in the loan tenure (when interest component is high), or when you want guaranteed, risk-free savings." },
        { question: "When is investing better than prepaying?", answer: "If your equity investment returns (12-15%) significantly exceed your loan rate (8-9%), investing the surplus in ELSS or index funds typically generates more wealth over the long term." },
        { question: "What about tax benefits on home loan?", answer: "Home loan gives tax benefits under 80C (principal, ₹1.5L) and Section 24 (interest, ₹2L) under the old regime. Factoring these in, the effective loan cost is lower, making investment more attractive." },
      ]} />
    </CalculatorLayout>
  );
}
