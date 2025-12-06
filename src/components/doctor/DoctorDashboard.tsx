import { useState, useEffect } from 'react';
import { DictationInput } from './DictationInput';
import { PrescriptionCard } from './PrescriptionCard';
import { AppointmentCalendar } from './AppointmentCalendar';
import { NewAppointmentModal } from './NewAppointmentModal';
import { PatientManagement } from './PatientManagement';
import { usePhysio, Exercise } from '@/context/PhysioContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, TrendingUp, Calendar, UserPlus, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DoctorDashboard = () => {
  const { exercises, setExercises, sendToPatient, appointments, getStats, user } = usePhysio();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [, setRefreshKey] = useState(0); // Force re-render when stats should update
  
  // Calculate stats dynamically - will recalculate on every render
  const stats = getStats();
  
  // Update when appointments change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [appointments.length]);
  const [patientMessages, setPatientMessages] = useState<any[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [messagesViewed, setMessagesViewed] = useState(false);

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
    // Send exercises to patient's plan
    sendToPatient(exercises);
    
    // Trigger stats update
    setRefreshKey(prev => prev + 1);
    
    toast({
      title: 'Success!',
      description: 'Prescription sent to patient successfully.',
    });
    setExercises([]);
  };

  useEffect(() => {
    // Clear exercises on mount to ensure they don't persist across page refreshes
  }, [setExercises]);

  useEffect(() => {
    // Load patient messages from localStorage
    try {
      const raw = localStorage.getItem('physiovision_patient_messages');
      const messagesViewed = localStorage.getItem('physiovision_messages_viewed') === 'true';
      
      if (!raw) {
        setPatientMessages([]);
        setUnreadMessageCount(0);
        return;
      }
      const messages = JSON.parse(raw);
      if (Array.isArray(messages)) {
        // Sort by timestamp descending (newest first)
        setPatientMessages(messages.sort((a: any, b: any) => b.timestamp - a.timestamp));
        // Set unread count only if messages not yet viewed
        if (!messagesViewed) {
          setUnreadMessageCount(messages.length);
        } else {
          setUnreadMessageCount(0);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load patient messages', e);
    }
  }, []);

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
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
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
        <Card className="rounded-2xl border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Appointments Today
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {appointments.filter(apt => 
                apt.date === new Date().toISOString().split('T')[0] && 
                apt.doctor_id === user?.id
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="prescriptions" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-6">
          <TabsTrigger value="prescriptions">
            <FileText className="h-4 w-4 mr-2" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="patients">
            <UserPlus className="h-4 w-4 mr-2" />
            Patients
          </TabsTrigger>
          <TabsTrigger 
            value="messages"
            onClick={() => {
              setMessagesViewed(true);
              localStorage.setItem('physiovision_messages_viewed', 'true');
            }}
            className="relative"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {unreadMessageCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full">
                {unreadMessageCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="mt-0">
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

        <div className="space-y-4">
              {exercises.length > 0 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <PrescriptionCard exercises={exercises} onSendToPatient={handleSendToPatient} />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <AppointmentCalendar onNewAppointment={() => setShowNewAppointment(true)} />
        </TabsContent>

        <TabsContent value="patients" className="mt-0">
          <PatientManagement />
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <Card className="rounded-2xl border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageSquare className="h-5 w-5" />
                Patient Messages
              </CardTitle>
              <CardDescription>
                Messages from your patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patientMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet</p>
              ) : (
                <div className="space-y-3">
                  {patientMessages.map((msg: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-border p-4 bg-accent/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{msg.patientName}</div>
                          <div className="text-xs text-muted-foreground">ID: {msg.patientId}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-foreground">{msg.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <NewAppointmentModal onClose={() => setShowNewAppointment(false)} />
      )}
    </div>
  );
};