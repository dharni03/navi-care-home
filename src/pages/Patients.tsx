import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Users } from 'lucide-react';

type PatientRow = {
  id: string;
  profile_id: string;
  profiles: { id: string; username: string | null; full_name: string | null; phone: string | null } | null;
};

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Fetch patients with their related profile info
      const { data, error } = await supabase
        .from('patients')
        .select('id, profile_id, profiles!inner(id, username, full_name, phone)')
        .order('created_at', { ascending: false });
      if (!error && data) setPatients(data as unknown as PatientRow[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = patients.filter((p) => {
    const name = p.profiles?.full_name || '';
    const username = p.profiles?.username || '';
    const phone = p.profiles?.phone || '';
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || username.toLowerCase().includes(q) || phone.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" /> Patients
        </h1>
        <div className="w-64">
          <Input placeholder="Search by name, username, or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading patients...
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6">No patients found.</div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{p.profiles?.full_name || 'Unnamed'}</div>
                    <div className="text-sm text-muted-foreground">
                      @{p.profiles?.username || 'unknown'} {p.profiles?.phone ? `• ${p.profiles.phone}` : ''}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">ID: {p.id}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Patients;


