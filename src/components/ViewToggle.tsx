import { Stethoscope, User } from 'lucide-react';
import { usePhysio } from '@/context/PhysioContext';
import { cn } from '@/lib/utils';

export const ViewToggle = () => {
  const { view, setView } = usePhysio();

  return (
    <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
      <button
        onClick={() => setView('doctor')}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
          view === 'doctor'
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Stethoscope className="h-4 w-4" />
        <span className="hidden sm:inline">Doctor</span>
      </button>
      <button
        onClick={() => setView('patient')}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
          view === 'patient'
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Patient</span>
      </button>
    </div>
  );
};