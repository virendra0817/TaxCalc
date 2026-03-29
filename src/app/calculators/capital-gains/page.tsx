"use client";
import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/layout/calculator-layout";
import { SliderField } from "@/components/calculators/slider-field";
import { ResultCard, ResultGrid } from "@/components/calculators/result-card";
import { FAQ } from "@/components/calculators/faq";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from "@/components/ui/index";
import { calculateCapitalGains } from "@/lib/calculators";
import { formatCurrencyFull } from "@/lib/utils";

type AssetType = "equity" | "property" | "gold" | "debt";

export default function CapitalGainsPage() {
  const [assetType, setAssetType] = useState<AssetType>("equity");
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [salePrice, setSalePrice] = useState(800000);
  const [holdingYears, setHoldingYears] = useState(2);

  const result = useMemo(() =>
    calculateCapitalGains(assetType, purchasePrice, salePrice, holdingYears, false),
    [assetType, purchasePrice, salePrice, holdingYears]
  );

  const ltcgThresholds: Record<AssetType, string> = {
    equity: "1 year",
    property: "2 years",
    gold: "2 years",
    debt: "3 years",
  };

  return (
    <CalculatorLayout
      title="Capital Gains Tax Calculator"
      description="Calculate LTCG / STCG tax on equity, property, gold, and debt fund investments."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4"><CardTitle className="text-base">Investment Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Type</label>
                <Select value={assetType} onValueChange={(v) => setAssetType(v as AssetType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity">Equity / Stocks / Equity MF</SelectItem>
                    <SelectItem value="property">Property / Real Estate</SelectItem>
                    <SelectItem value="gold">Gold / Gold ETF</SelectItem>
                    <SelectItem value="debt">Debt MF / Bonds</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  LTCG threshold: {ltcgThresholds[assetType]}
                </p>
              </div>

              <SliderField label="Purchase Price" value={purchasePrice} min={10000} max={50000000} step={10000}
                onChange={setPurchasePrice} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(0)} L` : `₹${(v / 1000).toFixed(0)}K`} />
              <SliderField label="Sale Price" value={salePrice} min={10000} max={50000000} step={10000}
                onChange={setSalePrice} formatValue={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(0)} L` : `₹${(v / 1000).toFixed(0)}K`} />
              <SliderField label="Holding Period" value={holdingYears} min={0} max={30} step={1}
                onChange={setHoldingYears} formatValue={(v) => `${v} yr${v !== 1 ? "s" : ""}`} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-5">
          <div className="flex items-center gap-3">
            <Badge variant={result.isLongTerm ? "success" : "secondary"} className="text-sm px-3 py-1">
              {result.type} — {result.isLongTerm ? "Long Term" : "Short Term"} Capital Gain
            </Badge>
            <Badge variant="outline">Tax Rate: {result.taxRate}%</Badge>
          </div>

          <ResultGrid cols={2}>
            <ResultCard label="Capital Gain / Loss"
              value={formatCurrencyFull(Math.abs(result.gain))}
              sub={result.gain >= 0 ? "Gain" : "Loss"}
              variant={result.gain >= 0 ? "success" : "danger"} />
            <ResultCard label="Tax on Gains" value={formatCurrencyFull(result.netTax)} highlight={result.netTax > 0} variant={result.netTax > 0 ? "warning" : "default"} />
          </ResultGrid>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Tax Calculation Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                { label: "Sale Price", value: salePrice },
                { label: "Purchase Price", value: -purchasePrice },
                { label: "Capital Gain", value: result.gain },
                ...(result.ltcgExemption > 0 ? [{ label: "LTCG Exemption (₹1.25L)", value: -result.ltcgExemption }] : []),
                { label: "Taxable Gain", value: result.taxableAfterExemption },
                { label: `Tax @ ${result.taxRate}%`, value: result.tax },
                { label: "Health & Edu Cess (4%)", value: result.cess },
                { label: "Net Tax Payable", value: result.netTax, bold: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between py-2 ${i > 0 ? "border-t" : ""} ${row.bold ? "font-semibold" : ""}`}>
                  <span className={row.bold ? "" : "text-muted-foreground"}>{row.label}</span>
                  <span className={row.value < 0 ? "text-red-500" : row.bold ? "text-primary" : ""}>{formatCurrencyFull(Math.abs(row.value))}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <FAQ items={[
        { question: "What is the LTCG tax rate on equity in FY 2025-26?", answer: "LTCG on equity and equity mutual funds held for more than 1 year is taxed at 12.5% (Budget 2024). The first ₹1.25 lakh of LTCG per year is exempt." },
        { question: "What is STCG on equity?", answer: "Short Term Capital Gains (holding < 1 year) on equity and equity MFs is taxed at 20% from FY 2024-25 onwards (raised from 15%)." },
        { question: "How is property capital gains taxed?", answer: "LTCG on property (held 2+ years) is taxed at 12.5% without indexation from FY 2024-25. STCG is added to income and taxed at your slab rate." },
        { question: "What is indexation?", answer: "Indexation adjusts the purchase cost for inflation using Cost Inflation Index (CII). It reduces your taxable gain. However, for property sold after July 2024, indexation has been removed (flat 12.5% LTCG)." },
      ]} />
    </CalculatorLayout>
  );
}
