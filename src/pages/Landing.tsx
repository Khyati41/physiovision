import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d967b]">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Physio Vision</h1>
          </div>
          <p className="text-lg text-gray-600">
            AI-powered physiotherapy prescription and exercise tracking platform
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Doctor Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#0d967b]">
            <CardHeader>
              <CardTitle className="text-2xl">I'm a Doctor</CardTitle>
              <CardDescription className="text-base">
                Create prescriptions and manage patient treatment plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-[#0d967b] hover:bg-[#0a7a63]" 
                size="lg"
                onClick={() => navigate('/doctor/signin')}
              >
                Sign In as Doctor
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-[#0d967b] text-[#0d967b] hover:bg-[#0d967b] hover:text-white" 
                size="lg"
                onClick={() => navigate('/doctor/signup')}
              >
                Sign Up as Doctor
              </Button>
            </CardContent>
          </Card>

          {/* Patient Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl">I'm a Patient</CardTitle>
              <CardDescription className="text-base">
                View your exercise plans and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={() => navigate('/patient/signin')}
              >
                Sign In as Patient
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" 
                size="lg"
                onClick={() => navigate('/patient/signup')}
              >
                Sign Up as Patient
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;

