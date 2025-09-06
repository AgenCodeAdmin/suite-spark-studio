import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
}

export const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-0 overflow-hidden"
    )}>
        <div className="glass-card h-full">
            <TabsList className="flex flex-col h-auto justify-start p-2 space-y-1">
                {/* Standalone Tab */}
                <TabsTrigger value="contact-submissions" className="w-full justify-start">
                    <span className={cn(isOpen ? "opacity-100" : "opacity-0")}>Contact Submissions</span>
                </TabsTrigger>

                {/* Divider and Group */}
                <div className="pt-4 mt-4 w-full">
                    <h3 className={cn(
                        "text-xs font-bold text-gray-500 uppercase px-4 mb-2 transition-opacity duration-300",
                        isOpen ? "opacity-100" : "opacity-0"
                    )}>
                        Content Management
                    </h3>
                    <div className="flex flex-col space-y-1">
                        <TabsTrigger value="hero" className="w-full justify-start">Hero Section</TabsTrigger>
                        <TabsTrigger value="about" className="w-full justify-start">About</TabsTrigger>
                        <TabsTrigger value="services" className="w-full justify-start">Services</TabsTrigger>
                        <TabsTrigger value="clients" className="w-full justify-start">Clients</TabsTrigger>
                        <TabsTrigger value="pricing" className="w-full justify-start">Pricing</TabsTrigger>
                        <TabsTrigger value="reviews" className="w-full justify-start">Reviews</TabsTrigger>
                        <TabsTrigger value="footer" className="w-full justify-start">Footer</TabsTrigger>
                        <TabsTrigger value="accordion" className="w-full justify-start">Accordion Content</TabsTrigger>
                        <TabsTrigger value="logo-carousel" className="w-full justify-start">Logo Carousel</TabsTrigger>
                        <TabsTrigger value="pain-points" className="w-full justify-start">Business Problems</TabsTrigger>
                        <TabsTrigger value="progress-stages" className="w-full justify-start">Progress Stages</TabsTrigger>
                        <TabsTrigger value="faqs" className="w-full justify-start">FAQs</TabsTrigger>
                        <TabsTrigger value="global-settings" className="w-full justify-start">Global Settings</TabsTrigger>
                    </div>
                </div>
            </TabsList>
        </div>
    </div>
  );
};
