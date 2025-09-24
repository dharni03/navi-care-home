import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  AlertTriangle, 
  BookOpen, 
  MapPin, 
  Phone, 
  User,
  Volume2,
  Settings,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PatientDashboardProps {
  language: string;
  userName?: string;
}

const translations = {
  en: {
    welcome: "Welcome",
    dashboard: "Patient Dashboard",
    quickActions: "Quick Actions",
    bookAppointment: "Book Appointment",
    bookAppointmentDesc: "Schedule with nearby hospitals",
    firstAid: "First Aid Guide",
    firstAidDesc: "Emergency medical information",
    patientHistory: "Medical History",
    patientHistoryDesc: "View past appointments & reports",
    findHospitals: "Find Hospitals",
    findHospitalsDesc: "Locate nearby healthcare facilities",
    emergency: "EMERGENCY",
    emergencyDesc: "Call ambulance & alert hospitals",
    profile: "My Profile",
    settings: "Settings",
    language: "Language",
  },
  hi: {
    welcome: "स्वागत है",
    dashboard: "मरीज़ डैशबोर्ड",
    quickActions: "त्वरित कार्य",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    bookAppointmentDesc: "पास के अस्पतालों के साथ शेड्यूल करें",
    firstAid: "प्राथमिक चिकित्सा गाइड",
    firstAidDesc: "आपातकालीन चिकित्सा जानकारी",
    patientHistory: "चिकित्सा इतिहास",
    patientHistoryDesc: "पिछली अपॉइंटमेंट्स और रिपोर्ट देखें",
    findHospitals: "अस्पताल खोजें",
    findHospitalsDesc: "पास की स्वास्थ्य सुविधाएं खोजें",
    emergency: "आपातकाल",
    emergencyDesc: "एम्बुलेंस कॉल करें और अस्पतालों को अलर्ट करें",
    profile: "मेरी प्रोफाइल",
    settings: "सेटिंग्स",
    language: "भाषा",
  },
  // Add other languages similar to UserTypeSelector
};

const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  language, 
  userName = "User" 
}) => {
  const t = translations[language as keyof typeof translations] || translations.en;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Array<{
    id: string;
    appointment_date: string;
    appointment_time: string;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
    reason: string | null;
  }>>([]);
  const [loadingAppointments, setLoadingAppointments] = useState<boolean>(true);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const quickActions = [
    {
      title: t.bookAppointment,
      description: t.bookAppointmentDesc,
      icon: Calendar,
      variant: 'healthcare' as const,
      action: () => navigate('/book'),
    },
    {
      title: t.firstAid,
      description: t.firstAidDesc,
      icon: BookOpen,
      variant: 'secondary' as const,
      action: () => console.log('First aid guide'),
    },
    {
      title: t.patientHistory,
      description: t.patientHistoryDesc,
      icon: History,
      variant: 'soft' as const,
      action: () => navigate('/appointments'),
    },
    {
      title: t.findHospitals,
      description: t.findHospitalsDesc,
      icon: MapPin,
      variant: 'soft' as const,
      action: () => navigate('/doctors'),
    },
  ];

  useEffect(() => {
    const loadAppointments = async () => {
      setLoadingAppointments(true);
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) {
        setLoadingAppointments(false);
        return;
      }
      const { data: prof } = await supabase.from('profiles').select('id').eq('user_id', uid).single();
      const { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', prof?.id || '')
        .maybeSingle();
      if (patient?.id) {
        const { data } = await supabase
          .from('appointments')
          .select('id, appointment_date, appointment_time, status, reason')
          .eq('patient_id', patient.id)
          .order('appointment_date', { ascending: false })
          .order('appointment_time', { ascending: false });
        if (data) setAppointments(data as any);
      }
      setLoadingAppointments(false);
    };
    loadAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{t.welcome}, {userName}</h1>
                <p className="text-muted-foreground text-sm">{t.dashboard}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakText(`${t.welcome}, ${userName}`)}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Emergency Button */}
        <Card className="border-emergency bg-emergency-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emergency flex items-center justify-center pulse-gentle">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-emergency">{t.emergency}</h2>
                  <p className="text-muted-foreground">{t.emergencyDesc}</p>
                </div>
              </div>
              <Button
                variant="emergency"
                size="xl"
                className="min-w-48"
                onClick={() => {
                  window.location.href = 'tel:8940834565';
                }}
              >
                <Phone className="mr-2 w-6 h-6" />
                {t.emergency}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">{t.quickActions}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakText(t.quickActions)}
              className="w-8 h-8"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary-light flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {action.description}
                      </p>
                    </div>
                    <Button 
                      variant={action.variant} 
                      className="w-full"
                      onClick={action.action}
                    >
                      {action.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activity
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakText("Recent Activity")}
                className="w-6 h-6"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingAppointments ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Loading your appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent appointments or activities</p>
                <p className="text-sm">Book your first appointment to get started</p>
              </div>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{a.reason || 'General Consultation'}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(a.appointment_date).toDateString()} • {a.appointment_time}
                    </div>
                  </div>
                  <Badge className="capitalize">{a.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;