import { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DictationInputProps {
  onGenerate: (notes: string) => void;
  isGenerating: boolean;
}

export const DictationInput = ({ onGenerate, isGenerating }: DictationInputProps) => {
  const [notes, setNotes] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    setIsListening(true);
    // Simulate listening for 3 seconds
    setTimeout(() => {
      setIsListening(false);
      setNotes(prev => prev + (prev ? ' ' : '') + 'Patient reports knee pain during squats. Recommend lower body strengthening exercises.');
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Clinical Dictation / Notes
        </label>
        <button
          onClick={handleMicClick}
          disabled={isListening}
          className={cn(
            "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
            isListening 
              ? "bg-primary text-primary-foreground animate-pulse-ring" 
              : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
          {isListening && (
            <span className="absolute -bottom-6 text-xs font-medium text-primary">
              Listening...
            </span>
          )}
        </button>
      </div>
      
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter clinical notes, observations, or use the microphone to dictate..."
        className="min-h-[160px] resize-none rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
      />

      <Button
        onClick={() => onGenerate(notes)}
        disabled={!notes.trim() || isGenerating}
        className="w-full gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? 'Generating Plan...' : 'Generate Plan'}
      </Button>
    </div>
  );
};