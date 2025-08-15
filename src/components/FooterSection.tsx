import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

interface FooterContent {
  company_name: string;
  company_address: string;
  links: Array<{ text: string; url: string }>;
  social_media: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

const FooterSection = () => {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_content')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching footer content:', error);
        } else if (data) {
          setFooterContent({
            company_name: data.company_name,
            company_address: data.company_address,
            links: Array.isArray(data.links) ? data.links : [],
            social_media: typeof data.social_media === 'object' ? data.social_media as any : {}
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, []);

  const defaultContent: FooterContent = {
    company_name: 'Digital Suite Pro',
    company_address: '123 Innovation Drive, Tech City, TC 12345',
    links: [
      { text: 'Privacy Policy', url: '#privacy' },
      { text: 'Terms of Service', url: '#terms' },
      { text: 'Support', url: '#support' }
    ],
    social_media: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      whatsapp: 'https://wa.me/1234567890'
    }
  };

  const content = footerContent || defaultContent;

  if (loading) {
    return (
      <footer id="contact" className="py-20 bg-gradient-to-t from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contact" className="py-20 bg-gradient-to-t from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="glass-card p-6 bg-white/5">
            <h3 className="text-2xl font-bold mb-4">{content.company_name}</h3>
            <p className="text-gray-300 leading-relaxed">
              {content.company_address}
            </p>
          </div>

          {/* Links */}
          <div className="glass-card p-6 bg-white/5">
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {content.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="glass-card p-6 bg-white/5">
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {content.social_media.instagram && (
                <a
                  href={content.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram size={20} />
                </a>
              )}
              {content.social_media.facebook && (
                <a
                  href={content.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook size={20} />
                </a>
              )}
              {content.social_media.whatsapp && (
                <a
                  href={content.social_media.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <MessageCircle size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-gray-400">
            © 2024 {content.company_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;