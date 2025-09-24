import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import LanguageSelector from '@/components/LanguageSelector';
import UserTypeSelector from '@/components/UserTypeSelector';
import PatientDashboard from '@/components/PatientDashboard';
import HospitalDashboard from '@/components/HospitalDashboard';

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
  const { user, loading } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data && (data.user_type === 'patient' || data.user_type === 'hospital' || data.user_type === 'admin')) {
        setUserProfile(data as UserProfile);
        if (data.user_type === 'patient' || data.user_type === 'hospital') {
          setUserType(data.user_type);
          setCurrentState('dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    if (user && userProfile) {
      setCurrentState('dashboard');
    } else {
      setCurrentState('userType');
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentState('dashboard');
  };

  // Show loading spinner while checking auth
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
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
