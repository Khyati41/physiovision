import { Header } from '@/components/Header';
import { PatientView } from '@/components/patient/PatientView';

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PatientView />
    </div>
  );
};

export default PatientDashboard;

