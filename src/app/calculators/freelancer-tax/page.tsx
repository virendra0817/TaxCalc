"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateNewRegimeTax } from "@/lib/calculators";
import { formatCurrencyFull, formatPercent } from "@/lib/utils";
import { Laptop, Info } from "lucide-react";

export default function FreelancerTaxPage() {
  const [grossReceipts, setGrossReceipts] = useState(2000000);
  const [actualExpenses, setActualExpenses] = useState(400000);

  // Under 44ADA: 50% of gross receipts is deemed profit
  const presumptiveProfit = grossReceipts * 0.5;
  const actualProfit = Math.max(0, grossReceipts - actualExpenses);
  const taxableIncome44ADA = presumptiveProfit;
  const taxableIncomeActual = actualProfit;

  const tax44ADA = useMemo(() => calculateNewRegimeTax(taxableIncome44ADA), [taxableIncome44ADA]);
  const taxActual = useMemo(() => calculateNewRegimeTax(taxableIncomeActual), [taxableIncomeActual]);

  const saving = taxActual.netTax - tax44ADA.netTax;
  const is44ADABetter = saving > 0;

  return (
    <CalculatorLayout
      title="Freelancer Tax Calculator (44ADA)"
      description="Tax calculator for IT freelancers, consultants & professionals using the presumptive taxation scheme."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Professional Income</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <SliderField label="Gross Professional Receipts" value={grossReceipts} min={100000} max={7500000} step={50000}
                onChange={setGrossReceipts} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)} L` : `₹${v}`} />
              <SliderField label="Actual Business Expenses" value={actualExpenses} min={0} max={grossReceipts} step={10000}
                onChange={setActualExpenses} formatValue={(v) => `₹${(v / 100000).toFixed(1)} L`} />

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <p className="font-medium">Section 44ADA — Presumptive Scheme</p>
                  <p>50% of gross receipts is deemed as profit. No books of accounts needed. Available if receipts ≤ ₹75L.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {/* Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={is44ADABetter ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Under 44ADA
                  {is44ADABetter && <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Recommended</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Deemed Profit (50%)</span><span className="font-medium">{formatCurrencyFull(presumptiveProfit)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Taxable Income</span><span className="font-medium">{formatCurrencyFull(tax44ADA.taxableIncome)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">87A Rebate</span><span className="font-medium text-emerald-600">-{formatCurrencyFull(tax44ADA.rebate87A)}</span></div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Tax Payable</span>
                  <span className="text-primary">{formatCurrencyFull(tax44ADA.netTax)}</span>
                </div>
                <div className="text-xs text-muted-foreground">Effective rate: {formatPercent(tax44ADA.effectiveRate)}</div>
              </CardContent>
            </Card>

            <Card className={!is44ADABetter ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Actual Expenses
                  {!is44ADABetter && <span className="text-xs text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Better</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross Receipts</span><span className="font-medium">{formatCurrencyFull(grossReceipts)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Less: Expenses</span><span className="font-medium text-red-500">-{formatCurrencyFull(actualExpenses)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Net Profit</span><span className="font-medium">{formatCurrencyFull(actualProfit)}</span></div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Tax Payable</span>
                  <span className="text-primary">{formatCurrencyFull(taxActual.netTax)}</span>
                </div>
                <div className="text-xs text-muted-foreground">Effective rate: {formatPercent(taxActual.effectiveRate)}</div>
              </CardContent>
            </Card>
          </div>

          <ResultGrid cols={3}>
            <ResultCard label="Gross Receipts" value={formatCurrencyFull(grossReceipts)} />
            <ResultCard label={is44ADABetter ? "Tax Saved with 44ADA" : "Extra Tax under 44ADA"}
              value={formatCurrencyFull(Math.abs(saving))}
              variant={is44ADABetter ? "success" : "warning"} />
            <ResultCard label="Expense % of Revenue"
              value={formatPercent((actualExpenses / grossReceipts) * 100)}
              sub={actualExpenses / grossReceipts < 0.5 ? "44ADA saves tax" : "Actual expenses better"} />
          </ResultGrid>
        </div>
      </div>

      <FAQ items={[
        { question: "Who can use Section 44ADA?", answer: "Resident professionals including doctors, lawyers, engineers, accountants, architects, technical consultants, and film artists with gross receipts up to ₹75 lakh can opt for 44ADA." },
        { question: "What is the benefit of 44ADA?", answer: "Under 44ADA, 50% of gross receipts is treated as your profit. This is beneficial if your actual expenses are less than 50% of revenue. No books of accounts are required." },
        { question: "When is the regular method better than 44ADA?", answer: "If your actual business expenses exceed 50% of gross receipts, the regular method (showing actual profit) will result in lower taxable income and hence lower tax." },
        { question: "Do I need to pay advance tax under 44ADA?", answer: "Yes, but simplified. You pay the entire advance tax in one instalment by March 15th of the financial year (instead of 4 quarterly instalments)." },
      ]} />
    </CalculatorLayout>
  );
}
