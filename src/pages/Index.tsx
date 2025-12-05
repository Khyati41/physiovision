import { Header } from '@/components/Header';
import { DoctorDashboard } from '@/components/doctor/DoctorDashboard';
import { PatientView } from '@/components/patient/PatientView';
import { usePhysio } from '@/context/PhysioContext';

const Index = () => {
  const { view } = usePhysio();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {view === 'doctor' ? <DoctorDashboard /> : <PatientView />}
    </div>
  );
};

export default Index;
