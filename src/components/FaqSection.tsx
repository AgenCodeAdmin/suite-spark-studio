import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
  id: number;
  question: string;
  answer: string;
  order_index: number;
}

const fetchFaqs = async (): Promise<Faq[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const FaqSection = () => {
  const { data: faqs, isLoading, isError } = useQuery<Faq[]> ({
    queryKey: ["faqs"],
    queryFn: fetchFaqs,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-1/3 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load FAQs.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
        <div className="md:columns-2 md:gap-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem value={`item-${faq.id}`} key={faq.id} className="faq-item-avoid-break">
                <AccordionTrigger className="bg-gray-50 hover:bg-gray-100 rounded-lg px-6 py-4 text-lg font-semibold text-gray-800 transition-colors duration-200 flex justify-between items-center">
                  <span className="flex items-center">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 rounded-b-lg px-6 py-4 text-gray-600 leading-relaxed border-t border-gray-200">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;