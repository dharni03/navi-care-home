import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarPlus } from 'lucide-react';

type Hospital = { id: string; hospital_name: string };
type Doctor = { id: string; name: string; hospital_id: string };

const BookAppointment: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitalId, setHospitalId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { data: hs } = await supabase.from('hospitals').select('id,hospital_name').order('hospital_name');
      if (hs) setHospitals(hs as Hospital[]);
      const { data: ds } = await supabase.from('doctors').select('id,name,hospital_id').order('name');
      if (ds) setDoctors(ds as Doctor[]);
    };
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalId || !date || !time) {
      toast({ title: 'Missing fields', description: 'Hospital, date and time are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) throw new Error('No user');
      const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', userId).single();
      // Try to find an existing patient; do not error if none
      let { data: patient } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', profile?.id || '')
        .maybeSingle();
      // Auto-create a minimal patient record if missing
      if (!patient && profile?.id) {
        const { data: createdPatient, error: createPatientError } = await supabase
          .from('patients')
          .insert({ profile_id: profile.id })
          .select('id')
          .single();
        if (createPatientError) throw createPatientError;
        patient = createdPatient as any;
      }
      if (!patient) throw new Error('Patient record missing');
      const { error } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        hospital_id: hospitalId,
        doctor_id: doctorId || null,
        appointment_date: date,
        appointment_time: time,
        reason: reason || null,
      });
      if (error) throw error;
      toast({ title: 'Appointment booked', description: 'We have scheduled your appointment.' });
      setHospitalId(''); setDoctorId(''); setDate(''); setTime(''); setReason('');
    } catch (e: any) {
      toast({ title: 'Booking failed', description: e.message || 'Try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const doctorOptions = doctors.filter((d) => (hospitalId ? d.hospital_id === hospitalId : true));

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CalendarPlus className="w-5 h-5" /> Book Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hospital</label>
              <Select value={hospitalId} onValueChange={(v) => { setHospitalId(v); if (doctorId) setDoctorId(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.hospital_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Doctor (optional)</label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctorOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reason (optional)</label>
              <Input placeholder="e.g., Fever and cough" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>) : 'Book Appointment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;


