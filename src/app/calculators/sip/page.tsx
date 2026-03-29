"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { calculateSIP } from "@/lib/calculators";
import { formatCurrency, formatCurrencyFull } from "@/lib/utils";

export default function SIPPage() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => calculateSIP(monthly, years, rate), [monthly, years, rate]);

  return (
    <CalculatorLayout
      title="SIP Calculator"
      description="Plan your mutual fund SIP and visualize the power of compounding over time."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">SIP Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Monthly SIP Amount" value={monthly} min={500} max={100000} step={500}
                onChange={setMonthly} formatValue={(v) => `₹${(v / 1000).toFixed(1)}K`} />
              <SliderField label="Duration" value={years} min={1} max={30} step={1}
                onChange={setYears} formatValue={(v) => `${v} yr${v > 1 ? "s" : ""}`} />
              <SliderField label="Expected Annual Return" value={rate} min={1} max={30} step={0.5}
                onChange={setRate} formatValue={(v) => `${v}%`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <ResultGrid cols={3}>
            <ResultCard label="Total Invested" value={formatCurrencyFull(result.totalInvested)}
              sub={`₹${monthly.toLocaleString("en-IN")}/mo for ${years} years`} />
            <ResultCard label="Estimated Returns" value={formatCurrencyFull(result.returns)}
              sub={`Wealth gained: ${formatCurrency(result.returns)}`} variant="success" />
            <ResultCard label="Total Value" value={formatCurrencyFull(result.maturityValue)} highlight />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Investment Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={result.yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={70} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrencyFull(value), name === "invested" ? "Invested" : "Total Value"]}
                    labelFormatter={(l) => `Year ${l}`}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  />
                  <Legend formatter={(v) => v === "invested" ? "Invested" : "Total Value"} />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fill="url(#colorInvested)" strokeWidth={2} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "What is SIP and how does it work?", answer: "SIP (Systematic Investment Plan) lets you invest a fixed amount monthly into mutual funds. Each investment buys units at the current NAV, and you benefit from rupee cost averaging over time." },
        { question: "What is the power of compounding in SIP?", answer: "Compounding means your returns earn further returns. With a 12% annual return, ₹10,000/month over 20 years grows to over ₹99 lakh from just ₹24 lakh invested — that's ₹75 lakh in pure gains." },
        { question: "Is SIP better than lump sum?", answer: "SIP is better for most investors as it removes timing risk via rupee cost averaging. Lump sum can outperform in a consistently rising market, but SIP is more suitable for regular income earners." },
      ]} />
    </CalculatorLayout>
  );
}
