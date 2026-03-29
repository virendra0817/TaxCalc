import Link from "next/link";
import { Calculator } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Calculator className="h-3.5 w-3.5" />
              </div>
              <span className="font-space font-semibold text-base">TaxPilot</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Free, accurate Indian finance calculators for salaried employees, freelancers & investors. All calculations are for informational purposes only.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Income Tax</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ["Old vs New Regime", "/calculators/tax-regime-comparator"],
                ["Income Tax", "/calculators/income-tax"],
                ["HRA Calculator", "/calculators/hra"],
                ["CTC to In-Hand", "/calculators/ctc-to-inhand"],
                ["Capital Gains", "/calculators/capital-gains"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Other Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ["SIP Calculator", "/calculators/sip"],
                ["FD Calculator", "/calculators/fd"],
                ["Home Loan EMI", "/calculators/home-loan-emi"],
                ["GST Calculator", "/calculators/gst"],
                ["Gratuity", "/calculators/gratuity"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TaxPilot. All calculations are estimates for informational purposes only. Consult a CA for professional advice.</p>
        </div>
      </div>
    </footer>
  );
}
