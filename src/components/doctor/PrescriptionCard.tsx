import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Exercise } from '@/context/PhysioContext';
import { useState } from 'react';

interface PrescriptionCardProps {
  exercises: Exercise[];
  onSendToPatient: () => void;
}

export const PrescriptionCard = ({ exercises, onSendToPatient }: PrescriptionCardProps) => {
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    onSendToPatient();
    setSent(true);
  };

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