import { useState } from 'react';
import { DictationInput } from './DictationInput';
import { PrescriptionCard } from './PrescriptionCard';
import { usePhysio, Exercise } from '@/context/PhysioContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DoctorDashboard = () => {
  const { exercises, setExercises } = usePhysio();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats] = useState({
    activePatients: 12,
    plansCreated: 45,
    completionRate: 87,
  });

  const handleGenerate = (notes: string) => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const generatedExercises: Exercise[] = [
        { id: '1', name: 'Squats', sets: 3, reps: 10 },
        { id: '2', name: 'Overhead Press', sets: 3, reps: 12 },
        { id: '3', name: 'Lunges', sets: 2, reps: 10 },
      ];
      setExercises(generatedExercises);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSendToPatient = () => {
    toast({
      title: 'Success!',
      description: 'Prescription sent to patient successfully.',
    });
    setExercises([]);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Doctor Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage exercise prescriptions for your patients
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activePatients}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plans Created
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.plansCreated}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Clinical Notes</CardTitle>
            <CardDescription>
              Dictate or type your observations to generate an AI-powered exercise plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DictationInput onGenerate={handleGenerate} isGenerating={isGenerating} />
          </CardContent>
        </Card>

        {exercises.length > 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <PrescriptionCard exercises={exercises} onSendToPatient={handleSendToPatient} />
          </div>
        )}
      </div>
    </div>
  );
};