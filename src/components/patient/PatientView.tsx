import { useState, useEffect } from 'react';
import { Play, Calendar, Trophy } from 'lucide-react';
import { usePhysio, Exercise } from '@/context/PhysioContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExerciseModal } from './ExerciseModal';

export const PatientView = () => {
  const { patientPlan, sendToPatient } = usePhysio();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
  };

  const completedCount = completedExercises.size;

  useEffect(() => {
    // If patientPlan already loaded, skip
    if (patientPlan && patientPlan.length > 0) return;

    try {
      const rawUser = localStorage.getItem('physiovision_current_user');
      if (!rawUser) return;
      const currentUser = JSON.parse(rawUser);
      const userId = currentUser?.id;
      if (!userId) return;

      const rawPlans = localStorage.getItem('physiovision_patient_plan');
      if (!rawPlans) return;
      const plans = JSON.parse(rawPlans);
      if (!Array.isArray(plans)) return;

      const entry = plans.find((p: any) => String(p.userId) === String(userId));
      if (entry && Array.isArray(entry.plan) && entry.plan.length > 0) {
        // Use context function to set patient plan so UI stays in sync
        sendToPatient(entry.plan as Exercise[]);
      }
    } catch (e) {
      // ignore parsing errors
      // eslint-disable-next-line no-console
      console.error('Failed to load patient plan from localStorage', e);
    }
  }, [patientPlan, sendToPatient]);

  return (
    <div className="container max-w-md py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Good morning! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Let's work on your recovery today
        </p>
      </div>

      {/* Progress Card */}
      <Card className="mb-6 rounded-2xl border-border bg-gradient-to-br from-primary to-primary/80 shadow-card">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">Exercise Progress</p>
            <p className="text-3xl font-bold text-primary-foreground">
              {completedCount} / {patientPlan.length}
            </p>
            <p className="text-sm text-primary-foreground/70">Exercises completed</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <Trophy className="h-8 w-8 text-primary-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Plan */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Exercise Plan</h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Today</span>
        </div>
      </div>

      {patientPlan.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border bg-card/50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">No exercises assigned</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your doctor will send your plan soon
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {patientPlan.map((exercise) => (
            <Card
              key={exercise.id}
              className="rounded-2xl border-border bg-card shadow-card transition-all hover:shadow-soft"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <span className="text-lg font-bold text-accent-foreground">
                      {exercise.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveExercise(exercise)}
                  size="icon"
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 fill-current" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Exercise Modal */}
      {activeExercise && (
        <ExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onComplete={handleExerciseComplete}
        />
      )}

    </div>
  );
};