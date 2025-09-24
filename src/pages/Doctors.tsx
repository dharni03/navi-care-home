import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Stethoscope, Search } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string | null;
  experience_years: number | null;
  available_days: string[] | null;
  available_hours: string | null;
  consultation_fee: number | null;
  hospital_id: string;
};

const Doctors: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [q, setQ] = useState('');
  const [specialization, setSpecialization] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name');
      if (!error && data) setDoctors(data as Doctor[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = doctors.filter((d) => {
    const matchesQ = q
      ? d.name.toLowerCase().includes(q.toLowerCase()) ||
        (d.specialization || '').toLowerCase().includes(q.toLowerCase())
      : true;
    const matchesSpec = specialization === 'all' ? true : d.specialization === specialization;
    return matchesQ && matchesSpec;
  });

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization))).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Stethoscope className="w-6 h-6" /> Doctors
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name or specialization"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Select value={specialization} onValueChange={(v) => setSpecialization(v)}>
          <SelectTrigger className="w-full md:w-60">
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {specializations.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading doctors...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <Card key={d.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{d.name}</span>
                  <Badge variant="secondary">{d.specialization}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {d.qualification && <div>Qualification: {d.qualification}</div>}
                {d.experience_years != null && <div>Experience: {d.experience_years} yrs</div>}
                {d.available_days && (
                  <div>Available: {d.available_days.join(', ')}</div>
                )}
                {d.available_hours && <div>Hours: {d.available_hours}</div>}
                {d.consultation_fee != null && <div>Fee: ₹{Number(d.consultation_fee).toFixed(0)}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;


