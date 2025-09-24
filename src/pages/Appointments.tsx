import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar } from 'lucide-react';

type Appointment = {
  id: string;
  patient_id: string;
  hospital_id: string;
  doctor_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  reason: string | null;
};

const statusColor: Record<Appointment['status'], 'default' | 'secondary' | 'destructive' | 'success'> = {
  scheduled: 'secondary',
  confirmed: 'default',
  cancelled: 'destructive',
  completed: 'success',
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'patient' | 'hospital'>('patient');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // detect role from profile
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData.user?.id;
      let currentRole: 'patient' | 'hospital' = 'patient';
      if (userId) {
        const { data: prof } = await supabase.from('profiles').select('user_type').eq('user_id', userId).single();
        if (prof?.user_type === 'hospital') currentRole = 'hospital';
      }
      setRole(currentRole);

      let query = supabase.from('appointments').select('*').order('appointment_date', { ascending: false });
      if (currentRole === 'patient' && userId) {
        const { data: profileForPatient } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('profile_id', profileForPatient?.id || '')
          .maybeSingle();
        if (patient) query = query.eq('patient_id', patient.id);
      }
      if (currentRole === 'hospital' && userId) {
        const { data: profileForHospital } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
        const { data: hospital } = await supabase
          .from('hospitals')
          .select('id')
          .eq('profile_id', profileForHospital?.id || '')
          .maybeSingle();
        if (hospital) query = query.eq('hospital_id', hospital.id);
      }
      const { data, error } = await query;
      if (!error && data) setAppointments(data as Appointment[]);
      setLoading(false);
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const m = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = a.appointment_date;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(a);
    }
    return Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [appointments]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="w-6 h-6" /> Appointments
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Viewing as</span>
          <Select value={role} onValueChange={(v: 'patient' | 'hospital') => setRole(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading appointments...
        </div>
      ) : (
        grouped.map(([date, items]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle>{new Date(date).toDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((a) => (
                <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{a.reason || 'General Consultation'}</div>
                    <div className="text-sm text-muted-foreground">Time: {a.appointment_time}</div>
                  </div>
                  <Badge variant={statusColor[a.status]} className="capitalize">{a.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Appointments;


