import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const speakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'ta' ? 'ta-IN' : 
                       langCode === 'ml' ? 'ml-IN' :
                       langCode === 'te' ? 'te-IN' :
                       langCode === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language.code);
    speakText(`Language selected: ${language.name}`, language.code);
    try {
      localStorage.setItem('language', language.code);
    } catch (_) {}
    setTimeout(() => {
      onLanguageSelect(language);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-secondary-light p-4">
      <Card className="w-full max-w-2xl shadow-xl slide-up">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full healthcare-gradient flex items-center justify-center mb-4">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Rural Health Navigator
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Select your preferred language to continue
          </p>
          <p className="text-sm text-muted-foreground">
            आपकी भाषा चुनें • Choose your language
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "healthcare" : "soft"}
                size="xl"
                onClick={() => handleLanguageSelect(language)}
                className="relative h-20 justify-start text-left group"
                disabled={selectedLanguage !== null}
              >
                <div className="flex items-center w-full">
                  <span className="text-2xl mr-4">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{language.nativeName}</div>
                    <div className="text-sm opacity-75">{language.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(language.nativeName, language.code);
                      }}
                      className="h-8 w-8 opacity-60 hover:opacity-100"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    {selectedLanguage === language.code && (
                      <Check className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" />
              Click the speaker icon to hear the language name
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;