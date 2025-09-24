import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle } from 'lucide-react';

type Alert = {
  id: string;
  patient_id: string;
  location_id: string;
  alert_type: 'ambulance' | 'emergency' | 'critical';
  status: 'active' | 'responded' | 'resolved' | 'cancelled';
  patient_location: string | null;
  contact_number: string | null;
  description: string | null;
  created_at: string;
};

const statusVariant: Record<Alert['status'], 'default' | 'secondary' | 'destructive' | 'success'> = {
  active: 'destructive',
  responded: 'secondary',
  resolved: 'success',
  cancelled: 'default',
};

const EmergencyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setAlerts(data as Alert[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" /> Emergency Alerts
      </h1>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading alerts...
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium capitalize">{a.alert_type}</div>
                  <div className="text-sm text-muted-foreground">{a.description || 'No description'}</div>
                </div>
                <Badge variant={statusVariant[a.status]} className="capitalize">{a.status}</Badge>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-sm text-muted-foreground">No alerts.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyAlerts;


