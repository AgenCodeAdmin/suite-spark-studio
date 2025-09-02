import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // New import
import { CheckCircle } from 'lucide-react';

const phoneRegex = new RegExp(
  /^\+91[0-9]{10}$/
);

const formSchema = z.object({
  full_name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone_number: z.string().regex(phoneRegex, { message: "Phone number must start with +91 and be 10 digits long." }),
  business_name: z.string().min(2, { message: "Business Name must be at least 2 characters." }),
  message: z.string().optional(), // New message field
});

const ContactUsSection: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '+91', // Default to +91
      business_name: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { error } = await supabase.from('contact_submissions').insert(values);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your request. Please try again.',
        variant: 'destructive',
      });
      console.error('Submission error:', error);
    } else {
      setIsSubmitted(true);
      form.reset({ // Reset with default +91
        full_name: '',
        email: '',
        phone_number: '+91',
        business_name: '',
        message: '',
      });
      toast({
        title: 'Success',
        description: 'Your request has been submitted!',
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <section className="py-16 bg-white" id="contact-us">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Process</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Get in touch to find out how we can collaborate.</h2>

          {isSubmitted ? (
            <div
              className="flex flex-col items-center justify-center text-center py-20 transition-opacity duration-500 ease-in-out"
            >
              <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">Thank You!</h3>
              <p className="text-lg text-gray-600 max-w-md">Your request has been submitted successfully. We will reach you back in 24 business hours.</p>
              <Button onClick={() => setIsSubmitted(false)} className="mt-8 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Submit Another Request
              </Button>
            </div>
          ) : (
            <div
              className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-200 transition-opacity duration-500 ease-in-out contact-form-glow"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-base">Your Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-base">Your Company *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corp" {...field} className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-base">Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="hello@example.com" {...field} className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-base">Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+919876543210"
                              {...field}
                              className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                              maxLength={13} // +91 and 10 digits
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (!e.target.value.startsWith('+91')) {
                                  e.target.value = '+91' + e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
                                } else {
                                  e.target.value = '+91' + e.target.value.substring(3).replace(/[^0-9]/g, '').substring(0, 10);
                                }
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* New Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-base">Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about your project..." {...field} className="min-h-[100px] rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-6 px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ContactUsSection;