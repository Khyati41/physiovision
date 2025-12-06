import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePhysio } from '@/context/PhysioContext';

const DoctorSignIn = () => {
  const navigate = useNavigate();
  const { signIn } = usePhysio();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn('doctor', email, password);
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in as doctor.',
      });
      navigate('/doctor/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d967b]">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Physio Vision</h1>
            </div>
            <div>
              <CardTitle className="text-2xl">Doctor Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0d967b] hover:bg-[#0a7a63]"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/doctor/signup" className="text-[#0d967b] hover:underline font-medium">
                Sign up as Doctor
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSignIn;
