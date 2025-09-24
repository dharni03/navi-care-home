import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Calendar, 
  AlertTriangle, 
  Stethoscope,
  Bell,
  Volume2,
  Settings,
  Plus,
  Activity
} from 'lucide-react';

interface HospitalDashboardProps {
  language: string;
  hospitalName?: string;
}

const translations = {
  en: {
    welcome: "Welcome",
    dashboard: "Hospital Dashboard",
    quickActions: "Quick Actions",
    managePatients: "Manage Patients",
    managePatientsDesc: "View and update patient records",
    manageDoctors: "Manage Doctors",
    manageDoctorsDesc: "Doctor schedules and availability",
    viewAppointments: "View Appointments",
    viewAppointmentsDesc: "Today's scheduled appointments",
    emergencyAlerts: "Emergency Alerts",
    emergencyAlertsDesc: "Active emergency cases",
    addDoctor: "Add Doctor",
    addPatient: "Add Patient",
    stats: "Today's Statistics",
    patients: "Patients",
    doctors: "Doctors",
    appointments: "Appointments",
    emergencies: "Emergencies",
    newEmergency: "NEW EMERGENCY",
    emergencyLocation: "Emergency from nearby location",
    respond: "Respond",
  },
  hi: {
    welcome: "स्वागत है",
    dashboard: "अस्पताल डैशबोर्ड",
    quickActions: "त्वरित कार्य",
    managePatients: "मरीज़ों का प्रबंधन",
    managePatientsDesc: "मरीज़ों के रिकॉर्ड देखें और अपडेट करें",
    manageDoctors: "डॉक्टरों का प्रबंधन",
    manageDoctorsDesc: "डॉक्टर की शेड्यूल और उपलब्धता",
    viewAppointments: "अपॉइंटमेंट्स देखें",
    viewAppointmentsDesc: "आज की निर्धारित अपॉइंटमेंट्स",
    emergencyAlerts: "आपातकालीन अलर्ट",
    emergencyAlertsDesc: "सक्रिय आपातकालीन मामले",
    addDoctor: "डॉक्टर जोड़ें",
    addPatient: "मरीज़ जोड़ें",
    stats: "आज की सांख्यिकी",
    patients: "मरीज़",
    doctors: "डॉक्टर",
    appointments: "अपॉइंटमेंट्स",
    emergencies: "आपातकाल",
    newEmergency: "नई आपातकाल",
    emergencyLocation: "पास के स्थान से आपातकाल",
    respond: "जवाब दें",
  },
};

const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ 
  language, 
  hospitalName = "City Hospital" 
}) => {
  const t = translations[language as keyof typeof translations] || translations.en;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const quickActions = [
    {
      title: t.managePatients,
      description: t.managePatientsDesc,
      icon: Users,
      variant: 'healthcare' as const,
      action: () => console.log('Manage patients'),
    },
    {
      title: t.manageDoctors,
      description: t.manageDoctorsDesc,
      icon: Stethoscope,
      variant: 'secondary' as const,
      action: () => console.log('Manage doctors'),
    },
    {
      title: t.viewAppointments,
      description: t.viewAppointmentsDesc,
      icon: Calendar,
      variant: 'soft' as const,
      action: () => console.log('View appointments'),
    },
    {
      title: t.emergencyAlerts,
      description: t.emergencyAlertsDesc,
      icon: AlertTriangle,
      variant: 'warning' as const,
      action: () => console.log('Emergency alerts'),
    },
  ];

  const stats = [
    { label: t.patients, value: 248, icon: Users, color: 'primary' },
    { label: t.doctors, value: 24, icon: Stethoscope, color: 'secondary' },
    { label: t.appointments, value: 35, icon: Calendar, color: 'success' },
    { label: t.emergencies, value: 3, icon: AlertTriangle, color: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full healthcare-gradient flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{t.welcome}, {hospitalName}</h1>
                <p className="text-muted-foreground text-sm">{t.dashboard}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-emergency">
                  3
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speakText(`${t.welcome}, ${hospitalName}`)}
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Emergency Alert */}
        <Card className="border-emergency bg-emergency-light">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emergency flex items-center justify-center pulse-gentle">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emergency">{t.newEmergency}</h2>
                  <p className="text-muted-foreground">{t.emergencyLocation}</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <Button variant="emergency" size="xl">
                <Activity className="mr-2 w-5 h-5" />
                {t.respond}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">{t.stats}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => speakText(t.stats)}
              className="w-8 h-8"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-full bg-${stat.color}-light flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
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
            
            <div className="flex gap-2">
              <Button variant="soft">
                <Plus className="mr-2 w-4 h-4" />
                {t.addDoctor}
              </Button>
              <Button variant="soft">
                <Plus className="mr-2 w-4 h-4" />
                {t.addPatient}
              </Button>
            </div>
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
      </main>
    </div>
  );
};

export default HospitalDashboard;