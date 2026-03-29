export interface CalculatorMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  href: string;
  badge?: string;
}

export const categories = [
  { id: "income-tax", label: "Income Tax" },
  { id: "tax-planning", label: "Tax Planning" },
  { id: "investments", label: "Investments" },
  { id: "loans", label: "Loans & Decisions" },
  { id: "property", label: "Property" },
  { id: "employment", label: "Employment" },
  { id: "gst", label: "GST" },
];

export const calculators: CalculatorMeta[] = [
  {
    slug: "tax-regime-comparator",
    title: "Old vs New Regime",
    description: "Compare tax liability under old & new tax regime side by side",
    icon: "Scale",
    category: "income-tax",
    href: "/calculators/tax-regime-comparator",
    badge: "Popular",
  },
  {
    slug: "income-tax",
    title: "Income Tax Calculator",
    description: "Calculate your exact income tax for FY 2025-26",
    icon: "Receipt",
    category: "income-tax",
    href: "/calculators/income-tax",
  },
  {
    slug: "hra",
    title: "HRA Calculator",
    description: "Calculate your HRA exemption for metro & non-metro cities",
    icon: "Home",
    category: "income-tax",
    href: "/calculators/hra",
  },
  {
    slug: "ctc-to-inhand",
    title: "CTC to In-Hand",
    description: "Convert your CTC package to monthly take-home salary",
    icon: "Wallet",
    category: "income-tax",
    href: "/calculators/ctc-to-inhand",
    badge: "Popular",
  },
  {
    slug: "capital-gains",
    title: "Capital Gains Tax",
    description: "LTCG / STCG on equity, property, gold & debt funds",
    icon: "TrendingUp",
    category: "income-tax",
    href: "/calculators/capital-gains",
  },
  {
    slug: "advance-tax",
    title: "Advance Tax",
    description: "Quarterly advance tax schedule & penalty calculator",
    icon: "Calendar",
    category: "income-tax",
    href: "/calculators/advance-tax",
  },
  {
    slug: "planner-80c",
    title: "80C Tax Saver Planner",
    description: "Optimal 80C investment allocation for your profile",
    icon: "Target",
    category: "tax-planning",
    href: "/calculators/planner-80c",
  },
  {
    slug: "freelancer-tax",
    title: "Freelancer Tax (44ADA)",
    description: "Tax calculator for IT freelancers & professionals",
    icon: "Laptop",
    category: "tax-planning",
    href: "/calculators/freelancer-tax",
  },
  {
    slug: "sip",
    title: "SIP Calculator",
    description: "Plan your mutual fund SIP and visualize compounding returns",
    icon: "LineChart",
    category: "investments",
    href: "/calculators/sip",
    badge: "Popular",
  },
  {
    slug: "fd",
    title: "FD Calculator",
    description: "Calculate fixed deposit maturity & effective interest rate",
    icon: "PiggyBank",
    category: "investments",
    href: "/calculators/fd",
  },
  {
    slug: "home-loan-emi",
    title: "Home Loan EMI",
    description: "Calculate EMI, total interest & amortization schedule",
    icon: "Building2",
    category: "loans",
    href: "/calculators/home-loan-emi",
  },
  {
    slug: "prepay-vs-sip",
    title: "Prepay vs SIP",
    description: "Should you prepay your loan or invest in SIP?",
    icon: "GitCompare",
    category: "loans",
    href: "/calculators/prepay-vs-sip",
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs Buy",
    description: "Should you rent or buy a house? Financial analysis",
    icon: "House",
    category: "loans",
    href: "/calculators/rent-vs-buy",
  },
  {
    slug: "stamp-duty",
    title: "Stamp Duty Calculator",
    description: "State-wise stamp duty & registration charges",
    icon: "Stamp",
    category: "property",
    href: "/calculators/stamp-duty",
  },
  {
    slug: "gratuity",
    title: "Gratuity Calculator",
    description: "Calculate gratuity on retirement or resignation",
    icon: "Award",
    category: "employment",
    href: "/calculators/gratuity",
  },
  {
    slug: "gst",
    title: "GST Calculator",
    description: "Add or remove GST from any amount across all slabs",
    icon: "Calculator",
    category: "gst",
    href: "/calculators/gst",
  },
];
