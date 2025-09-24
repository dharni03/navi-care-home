import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PatientDashboard from '@/components/PatientDashboard';
import HospitalDashboard from '@/components/HospitalDashboard';

type UserType = 'patient' | 'hospital';

const Home: React.FC = () => {
  const [language, setLanguage] = useState<string>('en');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const savedLang = localStorage.getItem('language');
        if (savedLang) setLanguage(savedLang);

        const { data: userRes } = await supabase.auth.getUser();
        const userId = userRes.user?.id;
        if (!userId) {
          window.location.href = '/auth';
          return;
        }
        const { data: prof } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', userId)
          .single();
        setUserType(prof?.user_type === 'hospital' ? 'hospital' : 'patient');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (!userType) return null;

  return userType === 'patient' ? (
    <PatientDashboard language={language} />
  ) : (
    <HospitalDashboard language={language} />
  );
};

export default Home;


