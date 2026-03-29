import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/index";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ({ items }: { items: FAQItem[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold font-space mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full space-y-1">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium text-left hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
