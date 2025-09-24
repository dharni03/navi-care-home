import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState<string | null>(null);

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
      action: () => navigate('/patients'),
    },
    {
      title: t.manageDoctors,
      description: t.manageDoctorsDesc,
      icon: Stethoscope,
      variant: 'secondary' as const,
      action: () => navigate('/doctors'),
    },
    {
      title: t.viewAppointments,
      description: t.viewAppointmentsDesc,
      icon: Calendar,
      variant: 'soft' as const,
      action: () => navigate('/appointments'),
    },
    {
      title: t.emergencyAlerts,
      description: t.emergencyAlertsDesc,
      icon: AlertTriangle,
      variant: 'warning' as const,
      action: () => navigate('/emergency'),
    },
  ];

  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [todayAppointmentCount, setTodayAppointmentCount] = useState<number | null>(null);
  const [activeEmergencyCount, setActiveEmergencyCount] = useState<number | null>(null);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '', qualification: '', experience_years: '', available_hours: '', consultation_fee: '' });
  const [patientLookup, setPatientLookup] = useState({ phone: '', username: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCounts = async () => {
      // Resolve current hospital id for inserts
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (uid) {
        const { data: prof } = await supabase.from('profiles').select('id').eq('user_id', uid).single();
        if (prof?.id) {
          const { data: hosp } = await supabase.from('hospitals').select('id').eq('profile_id', prof.id).maybeSingle();
          if (hosp?.id) setHospitalId(hosp.id);
        }
      }

      // Patients count
      const { count: patientsCnt } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      setPatientCount(patientsCnt ?? 0);

      // Doctors count
      const { count: doctorsCnt } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });
      setDoctorCount(doctorsCnt ?? 0);

      // Today's appointments count
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;
      const { count: apptCnt } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', todayStr);
      setTodayAppointmentCount(apptCnt ?? 0);

      // Active emergencies count
      const { count: emergCnt } = await supabase
        .from('emergency_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setActiveEmergencyCount(emergCnt ?? 0);
    };
    loadCounts();
  }, []);

  const handleCreateDoctor = async () => {
    if (!hospitalId) return;
    if (!newDoctor.name || !newDoctor.specialization) return;
    setSubmitting(true);
    const payload: any = {
      hospital_id: hospitalId,
      name: newDoctor.name,
      specialization: newDoctor.specialization,
    };
    if (newDoctor.qualification) payload.qualification = newDoctor.qualification;
    if (newDoctor.experience_years) payload.experience_years = Number(newDoctor.experience_years) || null;
    if (newDoctor.available_hours) payload.available_hours = newDoctor.available_hours;
    if (newDoctor.consultation_fee) payload.consultation_fee = Number(newDoctor.consultation_fee) || null;
    const { error } = await supabase.from('doctors').insert(payload);
    setSubmitting(false);
    if (!error) {
      setAddDoctorOpen(false);
      setNewDoctor({ name: '', specialization: '', qualification: '', experience_years: '', available_hours: '', consultation_fee: '' });
      const { count } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
      setDoctorCount(count ?? doctorCount);
    }
  };

  const handleCreatePatient = async () => {
    // Requires an existing profile to attach patient record to
    if (!patientLookup.phone && !patientLookup.username) return;
    setSubmitting(true);
    let profileId: string | null = null;
    if (patientLookup.phone) {
      const { data: profByPhone } = await supabase.from('profiles').select('id').eq('phone', patientLookup.phone).maybeSingle();
      profileId = profByPhone?.id || null;
    }
    if (!profileId && patientLookup.username) {
      const { data: profByUsername } = await supabase.from('profiles').select('id').eq('username', patientLookup.username).maybeSingle();
      profileId = profByUsername?.id || null;
    }
    if (profileId) {
      const { data: existing } = await supabase.from('patients').select('id').eq('profile_id', profileId).maybeSingle();
      if (!existing) {
        await supabase.from('patients').insert({ profile_id: profileId });
      }
      const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true });
      setPatientCount(count ?? patientCount);
    }
    setSubmitting(false);
    setAddPatientOpen(false);
    setPatientLookup({ phone: '', username: '' });
  };

  const stats = [
    { label: t.patients, value: patientCount ?? '—', icon: Users, color: 'primary' },
    { label: t.doctors, value: doctorCount ?? '—', icon: Stethoscope, color: 'secondary' },
    { label: t.appointments, value: todayAppointmentCount ?? '—', icon: Calendar, color: 'success' },
    { label: t.emergencies, value: activeEmergencyCount ?? '—', icon: AlertTriangle, color: 'warning' },
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
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
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
              <Button variant="soft" onClick={() => setAddDoctorOpen(true)} disabled={!hospitalId}>
                <Plus className="mr-2 w-4 h-4" />
                {t.addDoctor}
              </Button>
              <Button variant="soft" onClick={() => setAddPatientOpen(true)}>
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

      {/* Add Doctor Dialog */}
      <Dialog open={addDoctorOpen} onOpenChange={setAddDoctorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Doctor</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Full name" value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
            <Input placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
            <Input placeholder="Qualification (optional)" value={newDoctor.qualification} onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })} />
            <Input placeholder="Experience years (optional)" type="number" value={newDoctor.experience_years} onChange={(e) => setNewDoctor({ ...newDoctor, experience_years: e.target.value })} />
            <Input placeholder="Available hours (e.g., 09:00-17:00)" value={newDoctor.available_hours} onChange={(e) => setNewDoctor({ ...newDoctor, available_hours: e.target.value })} />
            <Input placeholder="Consultation fee (optional)" type="number" value={newDoctor.consultation_fee} onChange={(e) => setNewDoctor({ ...newDoctor, consultation_fee: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddDoctorOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDoctor} disabled={submitting || !hospitalId || !newDoctor.name || !newDoctor.specialization}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Lookup by phone" value={patientLookup.phone} onChange={(e) => setPatientLookup({ ...patientLookup, phone: e.target.value })} />
            <Input placeholder="or lookup by username" value={patientLookup.username} onChange={(e) => setPatientLookup({ ...patientLookup, username: e.target.value })} />
            <p className="text-xs text-muted-foreground">Patient must already have a profile. We will create the patient record if missing.</p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAddPatientOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePatient} disabled={submitting || (!patientLookup.phone && !patientLookup.username)}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalDashboard;