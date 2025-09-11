import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchLogos = async () => {
  const { data, error } = await supabase
    .from("logo_carousel")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const LogoCarouselSection = () => {
  const { data: logos, isLoading, isError } = useQuery({
    queryKey: ["logos"],
    queryFn: fetchLogos,
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
          <div className="flex overflow-hidden space-x-16">
            <div className="flex space-x-16">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-40" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Failed to load logos.</p>
        </div>
      </section>
    );
  }

  const duplicatedLogos = logos ? Array(5).fill([...logos]).flat() : [];

  return (
    <>
      <style>
        {`
          .logo-scrolling-wrapper {
            display: flex;
            overflow: hidden;
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            mask-image: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
          }

          .logo-scrolling-content-rtl {
            display: flex;
            flex-shrink: 0;
            animation: logo-scroll-rtl 20s linear infinite;
          }

          .logo-scrolling-content-ltr {
            display: flex;
            flex-shrink: 0;
            animation: logo-scroll-ltr 20s linear infinite;
          }

          @keyframes logo-scroll-rtl {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-20%);
            }
          }

          @keyframes logo-scroll-ltr {
            from {
              transform: translateX(-20%);
            }
            to {
              transform: translateX(0);
            }
          }

          .logo-item {
            flex: 0 0 auto;
            margin: 0 2rem;
            transition: transform 0.3s ease;
          }

          .logo-item img {
            height: 50px;
            width: auto;
            object-fit: contain;
            transition: filter 0.3s ease;
          }

          .logo-item:hover img {
            transform: scale(1.1);
          }
        `}
      </style>
      <section className="bg-white py-50">
        <div className="container mx-auto">
          {/* <h2 className="text-3xl font-bold text-center mb-12">Our Technology Partners</h2> */}
          <div className="flex flex-col gap-8">
            <div className="logo-scrolling-wrapper">
              <div className="logo-scrolling-content-rtl">
                {duplicatedLogos.map((logo, index) => (
                  <div key={`${logo.id}-${index}`} className="logo-item">
                    <img src={logo.image_url} alt={logo.alt_text || ""} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
            <div className="logo-scrolling-wrapper">
              <div className="logo-scrolling-content-ltr">
                {duplicatedLogos.map((logo, index) => (
                  <div key={`${logo.id}-${index}`} className="logo-item">
                    <img src={logo.image_url} alt={logo.alt_text || ""} loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogoCarouselSection;