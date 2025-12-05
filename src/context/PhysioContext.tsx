import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

interface PhysioContextType {
  view: 'doctor' | 'patient';
  setView: (view: 'doctor' | 'patient') => void;
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  patientPlan: Exercise[];
  sendToPatient: (exercises: Exercise[]) => void;
}

const PhysioContext = createContext<PhysioContextType | undefined>(undefined);

export const PhysioProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<'doctor' | 'patient'>('doctor');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [patientPlan, setPatientPlan] = useState<Exercise[]>([]);

  const sendToPatient = (exercises: Exercise[]) => {
    setPatientPlan(exercises);
  };

  return (
    <PhysioContext.Provider value={{ view, setView, exercises, setExercises, patientPlan, sendToPatient }}>
      {children}
    </PhysioContext.Provider>
  );
};

export const usePhysio = () => {
  const context = useContext(PhysioContext);
  if (!context) {
    throw new Error('usePhysio must be used within a PhysioProvider');
  }
  return context;
};