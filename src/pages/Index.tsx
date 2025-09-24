import React, { useState } from 'react';
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

type AppState = 'language' | 'userType' | 'dashboard';
type UserType = 'patient' | 'hospital';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentState('userType');
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentState('dashboard');
  };

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
