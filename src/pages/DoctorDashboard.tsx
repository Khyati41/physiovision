import { Header } from '@/components/Header';
import { DoctorDashboard as DoctorDashboardComponent } from '@/components/doctor/DoctorDashboard';

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DoctorDashboardComponent />
    </div>
  );
};

export default DoctorDashboard;

