import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react"; // Import all icons from lucide-react

interface PainPoint {
  id: number;
  icon: string;
  title: string;
  description: string;
  order_index: number;
}

const fetchPainPoints = async (): Promise<PainPoint[]> => {
  const { data, error } = await supabase
    .from("pain_points")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const PainPointsSection = () => {
  const { data: painPoints, isLoading, isError } = useQuery<PainPoint[]> ({
    queryKey: ["painPoints"],
    queryFn: fetchPainPoints,
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-1/3 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load business problems.</p>
        </div>
      </section>
    );
  }

  // Function to get Lucide icon component by name
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-14 w-28 text-primary mb-2" /> : null;
  };

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Common Business Challenges</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
        <style>
          {`
            @keyframes rotate {
              to {
                --angle: 360deg;
              }
            }

            @property --angle {
              syntax: "<angle>";
              initial-value: 0deg;
              inherits: false;
            }

            .animated-border-box {
              --angle: 0deg;
              border: 2px solid transparent;
              background:
                linear-gradient(white, white) padding-box,
                linear-gradient(var(--angle), transparent, #ffb3b3, transparent) border-box;
              animation: 8s rotate linear infinite;
              border-radius: 0.75rem; /* 20px */
            }
          `}
        </style>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPoints.map((pp) => (
            <Card key={pp.id} className="animated-border-box flex flex-col items-center text-center">
              {getIconComponent(pp.icon)}
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2">{pp.title}</CardTitle>
                <CardDescription className="text-gray-600">{pp.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPointsSection;
