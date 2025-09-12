import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Enums } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';

type UserRole = Enums<'user_roles'> | null;

const fetchUserProfile = async (user: User): Promise<UserRole> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single(); // Use single() as we expect one profile

  if (error) {
    console.error('Error fetching user profile:', error.message);
    // If no profile found, default to viewer or null
    if (error.code === 'PGRST116') { // No rows found from single-row query
      console.warn(`No profile found for user ID: ${user.id}. Defaulting to 'viewer'.`);
      return 'viewer';
    }
    throw new Error(error.message);
  }

  return data?.role || 'viewer'; // Default to viewer if role is null/undefined
};

export const useUserRole = () => {
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const { data: role, isLoading: isLoadingRole } = useQuery<UserRole>({
    queryKey: ['userRole', session?.user?.id],
    queryFn: () => fetchUserProfile(session!.user),
    enabled: !!session?.user, // Only run query if user session exists
    staleTime: Infinity, // Role doesn't change often, so cache indefinitely
    cacheTime: Infinity, // Keep in cache indefinitely
  });

  const loading = isLoadingRole || (session === null && !role); // Consider loading if session is not yet determined or role is loading

  return { role: role || null, loading };
};
