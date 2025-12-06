import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  prescription_id?: string;
  description?: string;
  video_url?: string;
  order_index?: number;
}

export interface Profile {
  id: string;
  user_type: 'doctor' | 'patient';
  full_name: string;
  email: string;
  license_number?: string;
  date_of_birth?: string;
}

interface PhysioContextType {
  // Authentication
  isAuthenticated: boolean;
  userType: 'doctor' | 'patient' | null;
  user: Profile | null;
  loading: boolean;
  signIn: (type: 'doctor' | 'patient', email: string, password: string) => Promise<void>;
  signOut: () => void;
  
  // Legacy view toggle (keeping for compatibility)
  view: 'doctor' | 'patient';
  setView: (view: 'doctor' | 'patient') => void;
  
  // Exercises
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  patientPlan: Exercise[];
  sendToPatient: (exercises: Exercise[]) => void;
  loadPatientPlan: () => Promise<void>;
}

const PhysioContext = createContext<PhysioContextType | undefined>(undefined);

// Mock user storage (in real app, this would be in a database)
const mockUsers: { [key: string]: Profile & { password: string } } = {};

export const PhysioProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'doctor' | 'patient'>('doctor');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [patientPlan, setPatientPlan] = useState<Exercise[]>([]);

  const signIn = async (type: 'doctor' | 'patient', email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userKey = `${type}-${email}`;
    const mockUser = mockUsers[userKey];
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    if (mockUser.user_type !== type) {
      throw new Error(`This account is not registered as a ${type}`);
    }
    
    setUser(mockUser);
    setView(type);
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    setExercises([]);
    setPatientPlan([]);
  };

  const sendToPatient = (exercises: Exercise[]) => {
    setPatientPlan(exercises);
  };

  const loadPatientPlan = async () => {
    // Mock loading patient plan
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  // Helper to add mock users (for sign-up)
  const addMockUser = (email: string, password: string, profile: Profile) => {
    const userKey = `${profile.user_type}-${email}`;
    mockUsers[userKey] = { ...profile, password };
  };

  // Expose addMockUser for sign-up pages
  (window as any).__addMockUser = addMockUser;

  const isAuthenticated = !!user;
  const userType = user?.user_type ?? null;

  return (
    <PhysioContext.Provider value={{ 
      isAuthenticated, 
      userType, 
      user,
      loading,
      signIn,
      signOut,
      view, 
      setView, 
      exercises, 
      setExercises, 
      patientPlan,
      sendToPatient,
      loadPatientPlan
    }}>
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
