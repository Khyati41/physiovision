import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import '../lib/storage'; // Import to initialize debug utilities

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
  // Patient-specific medical information
  patient_id?: string; // Auto-generated like PT-2025-042
  concerns?: string;
  medical_history?: string;
  medications?: string;
  allergies?: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_name: string;
  patient_email: string;
  date: string; // ISO date string
  time: string;
  duration: number; // in minutes
  type: string;
  notes?: string;
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
  
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  
  // Patient Management (Doctor only)
  createPatient: (patientData: {
    email: string;
    name: string;
    password: string;
    dateOfBirth?: string;
    concerns?: string;
    medicalHistory?: string;
    medications?: string;
    allergies?: string;
  }) => void;
  getPatients: () => Profile[];
  updatePatient: (patientId: string, updates: Partial<Profile>) => void;
}

const PhysioContext = createContext<PhysioContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'physiovision_users',
  CURRENT_USER: 'physiovision_current_user',
  APPOINTMENTS: 'physiovision_appointments',
  EXERCISES: 'physiovision_exercises',
  PATIENT_PLAN: 'physiovision_patient_plan',
};

// Helper functions for localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

// Initialize mock appointments for first-time users
const getInitialAppointments = (): Appointment[] => {
  const stored = getFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  if (stored.length === 0) {
    // Return demo appointments only on first load
    return [
      {
        id: '1',
        doctor_id: 'demo',
        patient_name: 'John Smith',
        patient_email: 'john@example.com',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        type: 'Initial Consultation',
        notes: 'New patient - knee injury'
      },
      {
        id: '2',
        doctor_id: 'demo',
        patient_name: 'Sarah Johnson',
        patient_email: 'sarah@example.com',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        duration: 30,
        type: 'Follow-up',
        notes: 'Check progress on shoulder exercises'
      },
    ];
  }
  return stored;
};

export const PhysioProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(() => 
    getFromStorage<Profile | null>(STORAGE_KEYS.CURRENT_USER, null)
  );
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'doctor' | 'patient'>(() => 
    user?.user_type || 'doctor'
  );
  const [exercises, setExercises] = useState<Exercise[]>(() =>
    getFromStorage<Exercise[]>(STORAGE_KEYS.EXERCISES, [])
  );
  const [patientPlan, setPatientPlan] = useState<Exercise[]>(() =>
    getFromStorage<Exercise[]>(STORAGE_KEYS.PATIENT_PLAN, [])
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getInitialAppointments()
  );

  const signIn = async (type: 'doctor' | 'patient', email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockUsers = getFromStorage<{ [key: string]: Profile & { password: string } }>(
        STORAGE_KEYS.USERS,
        {}
      );
      
      const userKey = `${type}-${email}`;
      const mockUser = mockUsers[userKey];
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      if (mockUser.user_type !== type) {
        throw new Error(`This account is not registered as a ${type}`);
      }
      
      // Save user to localStorage
      saveToStorage(STORAGE_KEYS.CURRENT_USER, mockUser);
      setUser(mockUser);
      setView(type);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    setExercises([]);
    setPatientPlan([]);
  };

  const sendToPatient = (exercises: Exercise[]) => {
    setPatientPlan(exercises);
    saveToStorage(STORAGE_KEYS.PATIENT_PLAN, exercises);
  };

  const loadPatientPlan = async () => {
    // Mock loading patient plan
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
    };
    setAppointments(prev => {
      const updated = [...prev, newAppointment];
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const updated = prev.filter(apt => apt.id !== id);
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
      return updated;
    });
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  // Generate patient ID (format: PT-YYYY-XXX)
  const generatePatientId = (): string => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PT-${year}-${randomNum}`;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Patient Management (Doctor only)
  const createPatient = (patientData: {
    email: string;
    name: string;
    password: string;
    dateOfBirth?: string;
    concerns?: string;
    medicalHistory?: string;
    medications?: string;
    allergies?: string;
  }) => {
    const mockUsers = getFromStorage<{ [key: string]: Profile & { password: string } }>(
      STORAGE_KEYS.USERS,
      {}
    );
    
    const userKey = `patient-${patientData.email}`;
    
    // Check if patient already exists
    if (mockUsers[userKey]) {
      throw new Error('A patient with this email already exists');
    }
    
    const profile: Profile = {
      id: Math.random().toString(36).substr(2, 9),
      user_type: 'patient',
      full_name: patientData.name,
      email: patientData.email,
      date_of_birth: patientData.dateOfBirth,
      patient_id: generatePatientId(),
      concerns: patientData.concerns,
      medical_history: patientData.medicalHistory,
      medications: patientData.medications,
      allergies: patientData.allergies,
    };
    
    mockUsers[userKey] = { ...profile, password };
    saveToStorage(STORAGE_KEYS.USERS, mockUsers);
  };

  const updatePatient = (patientId: string, updates: Partial<Profile>) => {
    const mockUsers = getFromStorage<{ [key: string]: Profile & { password: string } }>(
      STORAGE_KEYS.USERS,
      {}
    );
    
    // Find patient by ID
    const userKey = Object.keys(mockUsers).find(key => {
      const user = mockUsers[key];
      return user.id === patientId && user.user_type === 'patient';
    });
    
    if (userKey) {
      mockUsers[userKey] = { ...mockUsers[userKey], ...updates };
      saveToStorage(STORAGE_KEYS.USERS, mockUsers);
    }
  };

  const getPatients = (): Profile[] => {
    const mockUsers = getFromStorage<{ [key: string]: Profile & { password: string } }>(
      STORAGE_KEYS.USERS,
      {}
    );
    
    return Object.values(mockUsers)
      .filter(user => user.user_type === 'patient')
      .map(({ password, ...profile }) => profile);
  };

  // Helper to add mock users (for sign-up) - now uses localStorage
  const addMockUser = (email: string, password: string, profile: Profile) => {
    const mockUsers = getFromStorage<{ [key: string]: Profile & { password: string } }>(
      STORAGE_KEYS.USERS,
      {}
    );
    const userKey = `${profile.user_type}-${email}`;
    mockUsers[userKey] = { ...profile, password };
    saveToStorage(STORAGE_KEYS.USERS, mockUsers);
  };

  // Expose addMockUser for sign-up pages
  (window as any).__addMockUser = addMockUser;

  // Save exercises to localStorage when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXERCISES, exercises);
  }, [exercises]);

  // Save appointments to localStorage when they change (already handled in add/delete functions)
  // Save patient plan to localStorage when it changes (already handled in sendToPatient)

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
      loadPatientPlan,
      appointments,
      addAppointment,
      deleteAppointment,
      getAppointmentsByDate,
      createPatient,
      getPatients,
      updatePatient
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
