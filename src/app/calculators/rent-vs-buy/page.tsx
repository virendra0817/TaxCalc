"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFull, formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RentVsBuyPage() {
  const [propertyPrice, setPropertyPrice] = useState(8000000);
  const [downPayment, setDownPayment] = useState(1600000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [rentGrowth, setRentGrowth] = useState(5);
  const [propertyAppreciation, setPropertyAppreciation] = useState(6);
  const [investmentReturn, setInvestmentReturn] = useState(12);
  const [years, setYears] = useState(15);

  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = loanRate / 12 / 100;
  const n = loanTenure * 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  const chartData = useMemo(() => {
    return Array.from({ length: years }, (_, i) => {
      const yr = i + 1;
      // Buy scenario: property value
      const propValue = propertyPrice * Math.pow(1 + propertyAppreciation / 100, yr);
      // Total paid: EMI * 12 * yr + down payment
      const totalPaid = downPayment + emi * Math.min(yr * 12, n);
      const netWorthBuy = propValue - Math.max(0, loanAmount - (emi * Math.min(yr * 12, n) * (loanRate / (loanRate + propertyAppreciation))));

      // Rent scenario: invest down payment + difference between EMI and rent
      const currentRent = monthlyRent * Math.pow(1 + rentGrowth / 100, yr);
      const monthlySurplus = Math.max(0, emi - monthlyRent);
      const downPaymentGrowth = downPayment * Math.pow(1 + investmentReturn / 100, yr);
      const sipGrowth = monthlySurplus > 0
        ? monthlySurplus * ((Math.pow(1 + investmentReturn / 12 / 100, yr * 12) - 1) / (investmentReturn / 12 / 100)) * (1 + investmentReturn / 12 / 100)
        : 0;
      const netWorthRent = downPaymentGrowth + sipGrowth;

      return {
        year: yr,
        "Buy (Net Worth)": Math.round(netWorthBuy),
        "Rent (Net Worth)": Math.round(netWorthRent),
      };
    });
  }, [propertyPrice, downPayment, loanAmount, emi, n, propertyAppreciation, monthlyRent, rentGrowth, investmentReturn, loanRate, years]);

  const finalYear = chartData[chartData.length - 1];
  const buyFinal = finalYear?.["Buy (Net Worth)"] || 0;
  const rentFinal = finalYear?.["Rent (Net Worth)"] || 0;
  const buyBetter = buyFinal > rentFinal;

  return (
    <CalculatorLayout
      title="Rent vs Buy Calculator"
      description="Should you rent or buy a house? A comprehensive financial analysis over your chosen horizon."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Buy Scenario</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SliderField label="Property Price" value={propertyPrice} min={2000000} max={50000000} step={500000}
                onChange={setPropertyPrice} formatValue={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)} Cr` : `₹${(v / 100000).toFixed(0)} L`} />
              <SliderField label="Down Payment" value={downPayment} min={500000} max={propertyPrice * 0.5} step={100000}
                onChange={setDownPayment} formatValue={(v) => `₹${(v / 100000).toFixed(0)} L`} />
              <SliderField label="Loan Rate" value={loanRate} min={6} max={15} step={0.1}
                onChange={setLoanRate} formatValue={(v) => `${v.toFixed(1)}%`} />
              <SliderField label="Loan Tenure" value={loanTenure} min={5} max={30} step={1}
                onChange={setLoanTenure} formatValue={(v) => `${v} yrs`} />
              <SliderField label="Property Appreciation" value={propertyAppreciation} min={2} max={15} step={0.5}
                onChange={setPropertyAppreciation} formatValue={(v) => `${v}%`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Rent Scenario</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SliderField label="Monthly Rent" value={monthlyRent} min={5000} max={200000} step={1000}
                onChange={setMonthlyRent} formatValue={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <SliderField label="Annual Rent Growth" value={rentGrowth} min={2} max={15} step={0.5}
                onChange={setRentGrowth} formatValue={(v) => `${v}%`} />
              <SliderField label="Investment Return (SIP/MF)" value={investmentReturn} min={6} max={20} step={0.5}
                onChange={setInvestmentReturn} formatValue={(v) => `${v}%`} />
            </CardContent>
          </Card>

          <SliderField label="Analysis Period" value={years} min={5} max={30} step={1}
            onChange={setYears} formatValue={(v) => `${v} years`} />
        </div>

        <div className="lg:col-span-3 space-y-5">
          <Card className={buyBetter ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-blue-400 bg-blue-50 dark:bg-blue-900/20"}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">After {years} years, {buyBetter ? "Buying" : "Renting"} builds more wealth</p>
              <p className="text-xl font-bold font-space mt-1">
                {buyBetter
                  ? `Buy — ₹${formatCurrency(buyFinal - rentFinal)} more net worth`
                  : `Rent — ₹${formatCurrency(rentFinal - buyFinal)} more net worth`}
              </p>
            </CardContent>
          </Card>

          <ResultGrid cols={3}>
            <ResultCard label="Monthly EMI" value={formatCurrencyFull(emi)} />
            <ResultCard label="Net Worth if Buy" value={formatCurrencyFull(buyFinal)} variant={buyBetter ? "success" : "default"} />
            <ResultCard label="Net Worth if Rent" value={formatCurrencyFull(rentFinal)} variant={!buyBetter ? "success" : "default"} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Net Worth Comparison Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} width={75} />
                  <Tooltip formatter={(v: number) => formatCurrencyFull(v)} labelFormatter={(l) => `Year ${l}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="Buy (Net Worth)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Rent (Net Worth)" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "Is it always better to buy a home?", answer: "Not necessarily. Buying builds equity and benefits from appreciation, but requires a large down payment and locks up capital. Renting offers flexibility and allows investing the surplus. The better choice depends on property appreciation vs investment returns in your city." },
        { question: "What is the price-to-rent ratio?", answer: "Divide property price by annual rent. If ratio > 20, renting is generally more economical; if < 15, buying makes more financial sense. In Indian metros, the ratio is often 25-35, favouring renting." },
        { question: "What costs are not factored in this calculator?", answer: "Maintenance costs (1-2% of property value/year), property tax, home insurance, stamp duty & registration, and brokerage are not included in buy scenario. These would further reduce the financial benefit of buying." },
      ]} />
    </CalculatorLayout>
  );
}
