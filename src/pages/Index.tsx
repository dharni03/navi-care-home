import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import LanguageSelector from '@/components/LanguageSelector';
import UserTypeSelector from '@/components/UserTypeSelector';
import PatientDashboard from '@/components/PatientDashboard';
import HospitalDashboard from '@/components/HospitalDashboard';
import { Loader2, Heart } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface UserProfile {
  user_type: 'patient' | 'hospital' | 'admin';
}

type AppState = 'language' | 'userType' | 'dashboard';
type UserType = 'patient' | 'hospital';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentState, setCurrentState] = useState<AppState>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user!.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else if (data) {
        setUserProfile(data as UserProfile);
        setUserType(data.user_type as UserType);
        setCurrentState('language');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentState('userType');
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentState('dashboard');
  };

  // Show loading spinner while checking auth
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-health-light to-health-accent/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-health-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-health-dark">Rural Health Navigator</h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-health-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no user, will redirect to auth (handled in useEffect)
  if (!user || !session) {
    return null;
  }

  if (currentState === 'language') {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  if (currentState === 'userType' && selectedLanguage) {
    return (
      <UserTypeSelector 
        onUserTypeSelect={handleUserTypeSelect}
        selectedLanguage={selectedLanguage.code}
      />
    );
  }

  if (currentState === 'dashboard' && selectedLanguage && userType) {
    return userType === 'patient' ? (
      <PatientDashboard language={selectedLanguage.code} />
    ) : (
      <HospitalDashboard language={selectedLanguage.code} />
    );
  }

  return null;
};

export default Index;