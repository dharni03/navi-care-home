import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ProfileRow = { id: string; user_id: string; username: string; full_name: string; user_type: 'patient' | 'hospital' | 'admin'; phone: string | null };

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) return;
      const { data } = await supabase.from('profiles').select('*').eq('user_id', uid).single();
      if (data) setProfile(data as ProfileRow);
    };
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    await supabase.from('profiles').update({ username: profile.username, full_name: profile.full_name, phone: profile.phone }).eq('id', profile.id);
    setSaving(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Full name</label>
                <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input value={profile.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="secondary" onClick={signOut}>Sign out</Button>
              </div>
            </form>
          ) : (
            <div>Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;


