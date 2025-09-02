import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect, useMemo } from "react";

interface ProgressStage {
  id: number;
  title: string;
  description: string;
  order_index: number;
}

const fetchProgressStages = async (): Promise<ProgressStage[]> => {
  const { data, error } = await supabase
    .from("progress_stages")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const ProgressSection = () => {
  const { data: progressStages, isLoading, isError } = useQuery<ProgressStage[]> ({
    queryKey: ["progressStages"],
    queryFn: fetchProgressStages,
  });

  const [isMobile, setIsMobile] = useState(false);

  const gradientColors = useMemo(() => [
    "from-green-400 to-green-600", // 1
    "from-red-400 to-red-600",    // 2
    "from-blue-400 to-blue-600",   // 3
    "from-pink-400 to-pink-600",   // 4
    "from-purple-400 to-purple-600", // 5
    "from-teal-400 to-teal-600",   // 6
  ], []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-1/3 mx-auto mb-12" />
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center w-full md:w-1/6 mb-8 md:mb-0">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
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
          <p className="text-red-500">Failed to load progress stages.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Process</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-y-16 md:gap-y-24 lg:gap-y-32 pt-16 pb-16">
          {progressStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`flex flex-col items-center text-center px-4
                ${!isMobile && index % 2 === 1 ? 'md:mt-[120px]' : ''} // Alternating top/bottom on desktop
              `}
            >
              {/* Dot with Number */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4
                  bg-gradient-to-br ${gradientColors[index % gradientColors.length]}
                  shadow-lg transform transition-transform duration-300 hover:scale-105
                `}
                style={{ boxShadow: `0 0 15px 5px rgba(0,0,0,0.1), 0 0 25px 10px ${gradientColors[index % gradientColors.length].split(' ').pop().replace('to-','rgba(').replace('-', ', ')},0.4)` }}
              >
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{stage.title}</h3>
              <p className="text-sm text-gray-600">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgressSection;