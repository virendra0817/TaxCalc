// ─── Income Tax ───────────────────────────────────────────────────────────────

export interface TaxResult {
  taxableIncome: number;
  totalTax: number;
  rebate87A: number;
  cess: number;
  netTax: number;
  effectiveRate: number;
  slabs: { range: string; rate: string; tax: number }[];
}

export function calculateNewRegimeTax(grossIncome: number, fy: "2025-26" | "2024-25" = "2025-26"): TaxResult {
  const standardDeduction = fy === "2025-26" ? 75000 : 50000;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  const slabs2526 = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 0.05 },
    { min: 800000, max: 1200000, rate: 0.10 },
    { min: 1200000, max: 1600000, rate: 0.15 },
    { min: 1600000, max: 2000000, rate: 0.20 },
    { min: 2000000, max: 2400000, rate: 0.25 },
    { min: 2400000, max: Infinity, rate: 0.30 },
  ];

  const slabs2425 = [
    { min: 0, max: 300000, rate: 0 },
    { min: 300000, max: 700000, rate: 0.05 },
    { min: 700000, max: 1000000, rate: 0.10 },
    { min: 1000000, max: 1200000, rate: 0.15 },
    { min: 1200000, max: 1500000, rate: 0.20 },
    { min: 1500000, max: Infinity, rate: 0.30 },
  ];

  const slabs = fy === "2025-26" ? slabs2526 : slabs2425;
  let totalTax = 0;
  const slabDetails: { range: string; rate: string; tax: number }[] = [];

  for (const slab of slabs) {
    const taxable = Math.max(0, Math.min(taxableIncome, slab.max === Infinity ? taxableIncome : slab.max) - slab.min);
    const tax = taxable * slab.rate;
    totalTax += tax;
    if (slab.max === Infinity) {
      slabDetails.push({ range: `Above ₹${formatLakh(slab.min)}`, rate: `${slab.rate * 100}%`, tax });
    } else {
      slabDetails.push({ range: `₹${formatLakh(slab.min)} - ₹${formatLakh(slab.max)}`, rate: `${slab.rate * 100}%`, tax });
    }
  }

  const rebateLimit = fy === "2025-26" ? 1200000 : 700000;
  const rebate87A = taxableIncome <= rebateLimit ? Math.min(totalTax, fy === "2025-26" ? 60000 : 25000) : 0;
  const taxAfterRebate = Math.max(0, totalTax - rebate87A);
  const cess = taxAfterRebate * 0.04;
  const netTax = taxAfterRebate + cess;
  const effectiveRate = grossIncome > 0 ? (netTax / grossIncome) * 100 : 0;

  return { taxableIncome, totalTax, rebate87A, cess, netTax, effectiveRate, slabs: slabDetails };
}

export function calculateOldRegimeTax(
  grossIncome: number,
  deductions: { sec80C?: number; sec80D?: number; hra?: number; homeLoanInterest?: number; nps?: number; other?: number }
): TaxResult {
  const standardDeduction = 50000;
  const total80C = Math.min(deductions.sec80C || 0, 150000);
  const total80D = Math.min(deductions.sec80D || 0, 25000);
  const totalNPS = Math.min(deductions.nps || 0, 50000);
  const hraExemption = deductions.hra || 0;
  const homeLoanInt = Math.min(deductions.homeLoanInterest || 0, 200000);
  const otherDeductions = deductions.other || 0;

  const totalDeductions = standardDeduction + total80C + total80D + totalNPS + hraExemption + homeLoanInt + otherDeductions;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const slabs = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: Infinity, rate: 0.30 },
  ];

  let totalTax = 0;
  const slabDetails: { range: string; rate: string; tax: number }[] = [];

  for (const slab of slabs) {
    const taxable = Math.max(0, Math.min(taxableIncome, slab.max === Infinity ? taxableIncome : slab.max) - slab.min);
    const tax = taxable * slab.rate;
    totalTax += tax;
    if (slab.max === Infinity) {
      slabDetails.push({ range: `Above ₹${formatLakh(slab.min)}`, rate: `${slab.rate * 100}%`, tax });
    } else {
      slabDetails.push({ range: `₹${formatLakh(slab.min)} - ₹${formatLakh(slab.max)}`, rate: `${slab.rate * 100}%`, tax });
    }
  }

  const rebate87A = taxableIncome <= 500000 ? Math.min(totalTax, 12500) : 0;
  const taxAfterRebate = Math.max(0, totalTax - rebate87A);
  const cess = taxAfterRebate * 0.04;
  const netTax = taxAfterRebate + cess;
  const effectiveRate = grossIncome > 0 ? (netTax / grossIncome) * 100 : 0;

  return { taxableIncome, totalTax, rebate87A, cess, netTax, effectiveRate, slabs: slabDetails };
}

// ─── HRA ──────────────────────────────────────────────────────────────────────

export function calculateHRAExemption(
  basicSalary: number,
  daForsHRA: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): { exempt: number; taxable: number; calculation: { label: string; value: number }[] } {
  const salaryForHRA = basicSalary + daForsHRA;
  const c1 = hraReceived;
  const c2 = isMetro ? 0.5 * salaryForHRA : 0.4 * salaryForHRA;
  const c3 = Math.max(0, rentPaid - 0.1 * salaryForHRA);
  const exempt = Math.min(c1, c2, c3);
  const taxable = hraReceived - exempt;

  return {
    exempt,
    taxable,
    calculation: [
      { label: "Actual HRA received", value: c1 },
      { label: `${isMetro ? "50%" : "40%"} of Basic + DA`, value: c2 },
      { label: "Rent paid − 10% of Basic+DA", value: c3 },
    ],
  };
}

// ─── SIP ──────────────────────────────────────────────────────────────────────

export function calculateSIP(monthlyAmount: number, years: number, annualReturn: number) {
  const months = years * 12;
  const monthlyRate = annualReturn / 12 / 100;
  const totalInvested = monthlyAmount * months;
  const maturityValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const returns = maturityValue - totalInvested;

  const yearlyData = Array.from({ length: years }, (_, i) => {
    const m = (i + 1) * 12;
    const inv = monthlyAmount * m;
    const val = monthlyAmount * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
    return { year: i + 1, invested: inv, value: val, returns: val - inv };
  });

  return { totalInvested, maturityValue, returns, yearlyData };
}

// ─── FD ───────────────────────────────────────────────────────────────────────

export function calculateFD(principal: number, annualRate: number, years: number, compoundingFreq: number) {
  const rate = annualRate / 100;
  const maturity = principal * Math.pow(1 + rate / compoundingFreq, compoundingFreq * years);
  const interest = maturity - principal;
  const effectiveRate = (Math.pow(1 + rate / compoundingFreq, compoundingFreq) - 1) * 100;
  return { maturity, interest, effectiveRate };
}

// ─── EMI ──────────────────────────────────────────────────────────────────────

export function calculateEMI(principal: number, annualRate: number, tenureMonths: number) {
  const r = annualRate / 12 / 100;
  if (r === 0) return { emi: principal / tenureMonths, totalPayment: principal, totalInterest: 0 };
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Yearly breakdown for amortization chart
  let balance = principal;
  const yearlyData = [];
  for (let year = 1; year <= Math.ceil(tenureMonths / 12); year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const interestPart = balance * r;
      const principalPart = Math.min(emi - interestPart, balance);
      yearlyPrincipal += principalPart;
      yearlyInterest += interestPart;
      balance -= principalPart;
    }
    yearlyData.push({ year, principal: yearlyPrincipal, interest: yearlyInterest, balance: Math.max(0, balance) });
  }

  return { emi, totalPayment, totalInterest, yearlyData };
}

// ─── Capital Gains ────────────────────────────────────────────────────────────

export function calculateCapitalGains(
  assetType: "equity" | "property" | "gold" | "debt",
  purchasePrice: number,
  salePrice: number,
  holdingYears: number,
  indexationAllowed: boolean,
  costInflationIndex?: { purchase: number; sale: number }
) {
  const gain = salePrice - purchasePrice;
  const isLongTerm = holdingYears >= (assetType === "equity" ? 1 : assetType === "property" || assetType === "gold" ? 2 : 3);

  let indexedCost = purchasePrice;
  if (indexationAllowed && isLongTerm && costInflationIndex) {
    indexedCost = (purchasePrice * costInflationIndex.sale) / costInflationIndex.purchase;
  }

  const taxableGain = Math.max(0, salePrice - indexedCost);
  let taxRate = 0;

  if (assetType === "equity") {
    taxRate = isLongTerm ? 0.125 : 0.20; // LTCG 12.5% (>1L exempt), STCG 20%
  } else if (assetType === "property" || assetType === "gold") {
    taxRate = isLongTerm ? 0.125 : 0.30;
  } else {
    taxRate = isLongTerm ? 0.20 : 0.30;
  }

  const ltcgExemption = assetType === "equity" && isLongTerm ? Math.min(taxableGain, 125000) : 0;
  const taxableAfterExemption = Math.max(0, taxableGain - ltcgExemption);
  const tax = taxableAfterExemption * taxRate;
  const cess = tax * 0.04;
  const netTax = tax + cess;

  return {
    gain,
    isLongTerm,
    indexedCost,
    taxableGain,
    ltcgExemption,
    taxableAfterExemption,
    taxRate: taxRate * 100,
    tax,
    cess,
    netTax,
    type: isLongTerm ? "LTCG" : "STCG",
  };
}

// ─── GST ──────────────────────────────────────────────────────────────────────

export function calculateGST(amount: number, gstRate: number, isInclusive: boolean) {
  if (isInclusive) {
    const baseAmount = (amount * 100) / (100 + gstRate);
    const gstAmount = amount - baseAmount;
    return { baseAmount, gstAmount, total: amount, cgst: gstAmount / 2, sgst: gstAmount / 2 };
  } else {
    const gstAmount = (amount * gstRate) / 100;
    return { baseAmount: amount, gstAmount, total: amount + gstAmount, cgst: gstAmount / 2, sgst: gstAmount / 2 };
  }
}

// ─── Gratuity ─────────────────────────────────────────────────────────────────

export function calculateGratuity(
  lastSalary: number,
  yearsOfService: number,
  isCoveredByAct: boolean
): { gratuity: number; taxExempt: number; taxable: number } {
  let gratuity: number;
  if (isCoveredByAct) {
    gratuity = (lastSalary * 15 * yearsOfService) / 26;
  } else {
    gratuity = (lastSalary * 15 * yearsOfService) / 30;
  }

  const maxExempt = 2000000; // ₹20 lakh
  const taxExempt = Math.min(gratuity, maxExempt);
  const taxable = Math.max(0, gratuity - maxExempt);

  return { gratuity, taxExempt, taxable };
}

// ─── Advance Tax ──────────────────────────────────────────────────────────────

export function calculateAdvanceTax(annualTaxLiability: number) {
  const schedulePercentages = [
    { quarter: "Q1 (Jun 15)", cumulative: 15, due: 15 },
    { quarter: "Q2 (Sep 15)", cumulative: 45, due: 30 },
    { quarter: "Q3 (Dec 15)", cumulative: 75, due: 30 },
    { quarter: "Q4 (Mar 15)", cumulative: 100, due: 25 },
  ];

  return schedulePercentages.map((q) => ({
    quarter: q.quarter,
    cumulative: (annualTaxLiability * q.cumulative) / 100,
    dueAmount: (annualTaxLiability * q.due) / 100,
    percentage: q.due,
  }));
}

// ─── Stamp Duty ───────────────────────────────────────────────────────────────

export const stampDutyRates: Record<string, { male: number; female: number; registration: number }> = {
  "Maharashtra": { male: 6, female: 5, registration: 1 },
  "Delhi": { male: 6, female: 4, registration: 1 },
  "Karnataka": { male: 5.6, female: 5.6, registration: 1 },
  "Tamil Nadu": { male: 7, female: 7, registration: 1 },
  "Gujarat": { male: 4.9, female: 4.9, registration: 1 },
  "Rajasthan": { male: 6, female: 5, registration: 1 },
  "Uttar Pradesh": { male: 7, female: 6, registration: 1 },
  "West Bengal": { male: 5, female: 5, registration: 1 },
  "Telangana": { male: 5, female: 5, registration: 0.5 },
  "Haryana": { male: 7, female: 5, registration: 1 },
};

export function calculateStampDuty(propertyValue: number, state: string, ownershipType: "male" | "female" | "joint") {
  const rates = stampDutyRates[state] || { male: 6, female: 5, registration: 1 };
  const dutyRate = ownershipType === "female" ? rates.female : rates.male;
  const stampDuty = (propertyValue * dutyRate) / 100;
  const registrationFee = (propertyValue * rates.registration) / 100;
  const total = stampDuty + registrationFee;
  return { stampDuty, registrationFee, total, dutyRate, registrationRate: rates.registration };
}

// ─── CTC to In-Hand ───────────────────────────────────────────────────────────

export function calculateCTCToInHand(
  ctc: number,
  epfContribution = true,
  professionalTax = 2400,
  regime: "new" | "old" = "new"
) {
  const basicSalary = ctc * 0.4;
  const hra = basicSalary * 0.5;
  const specialAllowance = ctc - basicSalary - hra;
  const epf = epfContribution ? Math.min(basicSalary * 0.12, 21600) : 0;
  const grossSalary = ctc - epf;

  const taxResult = regime === "new"
    ? calculateNewRegimeTax(grossSalary)
    : calculateOldRegimeTax(grossSalary, {});

  const monthlyInHand = (grossSalary - taxResult.netTax - professionalTax) / 12;

  return {
    ctc,
    basicSalary,
    hra,
    specialAllowance,
    grossSalary,
    epf,
    professionalTax,
    incomeTax: taxResult.netTax,
    monthlyInHand: Math.max(0, monthlyInHand),
    annualInHand: Math.max(0, grossSalary - taxResult.netTax - professionalTax),
    effectiveTaxRate: taxResult.effectiveRate,
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatLakh(n: number): string {
  if (n >= 10000000) return `${n / 10000000} Cr`;
  if (n >= 100000) return `${n / 100000} L`;
  return `${n / 1000}K`;
}
