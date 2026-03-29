import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getUser, migrateLocalData } from '../services/auth';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then(u => { setUser(u); setLoading(false); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user || null;
      setUser(u);

      if (event === 'SIGNED_IN' && u) {
        await migrateLocalData(u.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
