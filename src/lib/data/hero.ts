import { supabase } from '@/integrations/supabase/client';
import { HeroContent } from '@/components/HeroSection'; // Assuming HeroContent interface is exported

export async function getHeroContent(): Promise<HeroContent | null> {
  const { data, error } = await supabase
    .from('hero_content')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching hero content:', error);
    throw new Error(error.message);
  }

  return data || null;
}
