import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Stethoscope, Users, ArrowRight } from 'lucide-react';

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: 'patient' | 'hospital') => void;
  selectedLanguage: string;
}

const translations = {
  en: {
    title: "Who are you?",
    subtitle: "Please select your role to continue",
    patient: "Patient",
    patientDesc: "Book appointments, access health info, emergency services",
    hospital: "Hospital / Doctor",
    hospitalDesc: "Manage patients, doctors, appointments, emergency alerts",
    continue: "Continue",
  },
  hi: {
    title: "आप कौन हैं?",
    subtitle: "जारी रखने के लिए अपनी भूमिका चुनें",
    patient: "मरीज़",
    patientDesc: "अपॉइंटमेंट बुक करें, स्वास्थ्य जानकारी, आपातकालीन सेवाएं",
    hospital: "अस्पताल / डॉक्टर",
    hospitalDesc: "मरीज़ों, डॉक्टरों, अपॉइंटमेंट्स, आपातकालीन अलर्ट का प्रबंधन",
    continue: "जारी रखें",
  },
  ta: {
    title: "நீங்கள் யார்?",
    subtitle: "தொடர உங்கள் பாத்திரத்தை தேர்ந்தெடுக்கவும்",
    patient: "நோயாளி",
    patientDesc: "சந்திப்பு முன்பதிவு, சுகாதார தகவல், அவசர சேவைகள்",
    hospital: "மருத்துவமனை / மருத்துவர்",
    hospitalDesc: "நோயாளிகள், மருத்துவர்கள், சந்திப்புகள், அவசர எச்சரிக்கைகள்",
    continue: "தொடரவும்",
  },
  ml: {
    title: "നിങ്ങൾ ആരാണ്?",
    subtitle: "തുടരാൻ നിങ്ങളുടെ റോൾ തിരഞ്ഞെടുക്കുക",
    patient: "രോഗി",
    patientDesc: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക, ആരോഗ്യ വിവരങ്ങൾ, അടിയന്തര സേവനങ്ങൾ",
    hospital: "ആശുപത്രി / ഡോക്ടർ",
    hospitalDesc: "രോഗികൾ, ഡോക്ടർമാർ, അപ്പോയിന്റ്മെന്റുകൾ, അടിയന്തര അലേർട്ടുകൾ",
    continue: "തുടരുക",
  },
  te: {
    title: "మీరు ఎవరు?",
    subtitle: "కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి",
    patient: "రోగి",
    patientDesc: "అపాయింట్‌మెంట్‌లు బుక్ చేయండి, ఆరోగ్య సమాచారం, అత్యవసర సేవలు",
    hospital: "ఆసుపత్రి / వైద్యుడు",
    hospitalDesc: "రోగులు, వైద్యులు, అపాయింట్‌మెంట్‌లు, అత్యవసర హెచ్చరికలు",
    continue: "కొనసాగించు",
  },
};

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ 
  onUserTypeSelect, 
  selectedLanguage 
}) => {
  const [selectedType, setSelectedType] = useState<'patient' | 'hospital' | null>(null);
  
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelect(selectedType);
    }
  };

  const userTypes = [
    {
      type: 'patient' as const,
      title: t.patient,
      description: t.patientDesc,
      icon: User,
      color: 'primary',
      features: [
        'Book Appointments',
        'Emergency Services',
        'Health Information',
        'Medical History'
      ]
    },
    {
      type: 'hospital' as const,
      title: t.hospital,
      description: t.hospitalDesc,
      icon: Building2,
      color: 'secondary',
      features: [
        'Manage Patients',
        'Doctor Schedules',
        'Emergency Alerts',
        'Medical Records'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light p-4">
      <Card className="w-full max-w-4xl shadow-xl slide-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            {t.title}
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isSelected = selectedType === userType.type;
              
              return (
                <Card 
                  key={userType.type}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected 
                      ? userType.color === 'primary' 
                        ? 'ring-2 ring-primary bg-primary-light' 
                        : 'ring-2 ring-secondary bg-secondary-light'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedType(userType.type)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        userType.color === 'primary' ? 'healthcare-gradient' : 'bg-secondary'
                      }`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{userType.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {userType.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 w-full">
                        {userType.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {selectedType && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="healthcare" 
                size="xl" 
                onClick={handleContinue}
                className="min-w-48"
              >
                {t.continue}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelector;