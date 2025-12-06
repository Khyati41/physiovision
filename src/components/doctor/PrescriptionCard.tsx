import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exercise } from '@/context/PhysioContext';
import { useState, useEffect } from 'react';

interface PrescriptionCardProps {
  exercises: Exercise[];
  onSendToPatient: () => void;
}

export const PrescriptionCard = ({ exercises, onSendToPatient }: PrescriptionCardProps) => {
  const [sent, setSent] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const handleSend = () => {
    // Determine patient id and name
    const patientId = selectedPatient?.trim() || `patient-${Date.now()}`;
    const patientName = selectedPatientName || selectedPatient || 'Patient';

    // Persist chosen patient as the current user in localStorage
    const currentUser = { id: patientId, user_type: 'patient', full_name: patientName };
    try {
      localStorage.setItem('physiovision_current_user', JSON.stringify(currentUser));
    } catch (e) {
      // ignore storage errors
      // eslint-disable-next-line no-console
      console.error('Failed to write current user to localStorage', e);
    }

    // Save the exercises for this patient under `physiovision_patient_plan` as array of { userId, plan }
    try {
      const raw = localStorage.getItem('physiovision_patient_plan');
      let arr: Array<any> = [];
      if (raw) {
        try {
          arr = JSON.parse(raw);
          if (!Array.isArray(arr)) arr = [];
        } catch (e) {
          arr = [];
        }
      }

      // Remove any existing plan for this userId
      arr = arr.filter(entry => entry.userId !== patientId);
      arr.push({ userId: patientId, plan: exercises, updatedAt: Date.now() });
      localStorage.setItem('physiovision_patient_plan', JSON.stringify(arr));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to save patient plan to localStorage', e);
    }

    onSendToPatient();
    setSent(true);
  };

  useEffect(() => {
    // Load users from localStorage key `physiovision_users`.
    try {
      const raw = localStorage.getItem('physiovision_users');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      let list: any[] = [];
      if (Array.isArray(parsed)) list = parsed;
      else if (typeof parsed === 'object' && parsed !== null) {
        // might be an object mapping or single user
        if (parsed.users && Array.isArray(parsed.users)) list = parsed.users;
        else list = Object.values(parsed);
      }
      setUsers(list);
    } catch (e) {
      // ignore parse errors
      // eslint-disable-next-line no-console
      console.error('Failed to load physiovision_users', e);
    }
  }, []);

  return (
    <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-card">
      <CardHeader className="border-b bg-accent/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            Rx
          </span>
          Exercise Prescription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="mb-2">
          <label className="block text-sm text-muted-foreground mb-1">Send to patient (email or id)</label>
          <div className="relative">
            <input
              value={query || selectedPatient}
              onChange={(e) => { setQuery(e.target.value); setSelectedPatient(e.target.value); setSuggestionsVisible(true); }}
              onFocus={() => setSuggestionsVisible(true)}
              placeholder="Search patient by name, email or id"
              className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground"
            />

            {suggestionsVisible && query && (
              <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-border bg-card shadow-lg">
                {users.filter(u => {
                  const q = query.toLowerCase();
                  const name = String(u.full_name ?? u.name ?? '').toLowerCase();
                  const email = String(u.email ?? '').toLowerCase();
                  const id = String(u.id ?? '').toLowerCase();
                  return name.includes(q) || email.includes(q) || id.includes(q);
                }).slice(0, 8).map((u) => (
                  <div
                    key={u.id || u.email || u.full_name}
                    onMouseDown={() => {
                      // onMouseDown so input doesn't lose focus before click
                      setSelectedPatient(String(u.id ?? u.email ?? u.full_name ?? ''));
                      setSelectedPatientName(String(u.full_name ?? u.name ?? ''));
                      setQuery('');
                      setSuggestionsVisible(false);
                    }}
                    className="cursor-pointer px-3 py-2 hover:bg-accent/30"
                  >
                    <div className="text-sm font-medium text-foreground">{u.full_name ?? u.name ?? u.email}</div>
                    <div className="text-xs text-muted-foreground">{u.email ?? u.id}</div>
                  </div>
                ))}
                {users.filter(u => {
                  const q = query.toLowerCase();
                  const name = String(u.full_name ?? u.name ?? '').toLowerCase();
                  const email = String(u.email ?? '').toLowerCase();
                  const id = String(u.id ?? '').toLowerCase();
                  return name.includes(q) || email.includes(q) || id.includes(q);
                }).length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
                )}
              </div>
            )}
          </div>
        </div>
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{exercise.name}</p>
              <p className="text-sm text-muted-foreground">
                {exercise.sets} sets of {exercise.reps} reps
              </p>
            </div>
          </div>
        ))}

        <Button
          onClick={handleSend}
          disabled={sent}
          className="mt-4 w-full gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {sent ? (
            <>
              <Check className="h-4 w-4" />
              Sent to Patient
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send to Patient
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};