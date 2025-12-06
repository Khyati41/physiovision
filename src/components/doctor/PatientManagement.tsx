import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePhysio } from '@/context/PhysioContext';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users, Mail, Trash2, Edit, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/context/PhysioContext';

export const PatientManagement = () => {
  const { createPatient, getPatients, updatePatient } = usePhysio();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Profile | null>(null);
  const [patients, setPatients] = useState(getPatients());
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Refresh patients list when refreshKey changes
  useEffect(() => {
    setPatients(getPatients());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    concerns: '',
    medicalHistory: '',
    medications: '',
    allergies: '',
  });

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      createPatient({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || undefined,
        concerns: formData.concerns || undefined,
        medicalHistory: formData.medicalHistory || undefined,
        medications: formData.medications || undefined,
        allergies: formData.allergies || undefined,
      });

      toast({
        title: 'Patient created!',
        description: `Account created for ${formData.name}. They can now sign in.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        concerns: '',
        medicalHistory: '',
        medications: '',
        allergies: '',
      });
      setIsDialogOpen(false);
      // Refresh immediately and after a small delay to ensure localStorage is updated
      setPatients(getPatients());
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 100);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create patient account.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPatient = (patient: Profile) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.full_name,
      email: patient.email,
      password: '',
      confirmPassword: '',
      dateOfBirth: patient.date_of_birth || '',
      concerns: patient.concerns || '',
      medicalHistory: patient.medical_history || '',
      medications: patient.medications || '',
      allergies: patient.allergies || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      updatePatient(selectedPatient.id, {
        full_name: formData.name,
        email: formData.email,
        date_of_birth: formData.dateOfBirth || undefined,
        concerns: formData.concerns || undefined,
        medical_history: formData.medicalHistory || undefined,
        medications: formData.medications || undefined,
        allergies: formData.allergies || undefined,
      });

      toast({
        title: 'Patient updated!',
        description: 'Patient information has been updated.',
      });

      setIsEditDialogOpen(false);
      setSelectedPatient(null);
      // Trigger refresh
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 100);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update patient.',
        variant: 'destructive',
      });
    }
  };

  const handleViewPatient = (patient: Profile) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletePatientId) return;

    try {
      const mockUsers = JSON.parse(localStorage.getItem('physiovision_users') || '{}');
      const patient = patients.find(p => p.id === deletePatientId);
      
      if (patient) {
        const userKey = `patient-${patient.email}`;
        delete mockUsers[userKey];
        localStorage.setItem('physiovision_users', JSON.stringify(mockUsers));
        
        toast({
          title: 'Patient deleted',
          description: 'Patient account has been removed.',
        });
        
        // Trigger refresh
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 100);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete patient.',
        variant: 'destructive',
      });
    } finally {
      setDeletePatientId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Patient Management</h2>
          <p className="text-muted-foreground">
            Create and manage patient accounts with medical information
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0d967b] hover:bg-[#0a7a63]">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Patient Account</DialogTitle>
              <DialogDescription>
                Create an account for a new patient with their medical information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="concerns">Concerns</Label>
                <Input
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                  placeholder="e.g., Right Knee Pain"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History (Flags)</Label>
                <Input
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  placeholder="e.g., Previous R Ankle Sprain; Diabetes T2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Medications</Label>
                <Input
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  placeholder="e.g., Ibuprofen; Metformin"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g., Latex; None"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#0d967b] hover:bg-[#0a7a63]"
                >
                  Create Patient
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Patients Table */}
      <Card className="rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Patients ({patients.length})
          </CardTitle>
          <CardDescription>
            View and manage all patient accounts and medical information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patients yet. Create your first patient account above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Concerns</TableHead>
                    <TableHead>Medical History</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Allergies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const age = calculateAge(patient.date_of_birth);
                    return (
                      <TableRow key={patient.id}>
                        <TableCell className="font-mono text-sm">
                          {patient.patient_id || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">{patient.full_name}</TableCell>
                        <TableCell>
                          {patient.date_of_birth
                            ? new Date(patient.date_of_birth).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{age !== null ? age : 'N/A'}</TableCell>
                        <TableCell>
                          {patient.concerns ? (
                            <Badge variant="outline">{patient.concerns}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.medical_history ? (
                            <span className="text-sm">{patient.medical_history}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.medications ? (
                            <span className="text-sm">{patient.medications}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.allergies ? (
                            <Badge variant={patient.allergies.toLowerCase() === 'none' ? 'secondary' : 'destructive'}>
                              {patient.allergies}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPatient(patient)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPatient(patient)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeletePatientId(patient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Complete medical information for {selectedPatient?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Patient ID</Label>
                  <p className="font-mono text-sm font-medium">{selectedPatient.patient_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{selectedPatient.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedPatient.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="text-sm">
                    {selectedPatient.date_of_birth
                      ? new Date(selectedPatient.date_of_birth).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="text-sm">{calculateAge(selectedPatient.date_of_birth) || 'N/A'}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Concerns</Label>
                <p className="text-sm">{selectedPatient.concerns || 'None specified'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Medical History (Flags)</Label>
                <p className="text-sm">{selectedPatient.medical_history || 'None specified'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Medications</Label>
                <p className="text-sm">{selectedPatient.medications || 'None specified'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Allergies</Label>
                <p className="text-sm">{selectedPatient.allergies || 'None'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
            <DialogDescription>
              Update patient medical information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePatient} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dateOfBirth">Date of Birth *</Label>
              <Input
                id="edit-dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-concerns">Concerns</Label>
              <Input
                id="edit-concerns"
                value={formData.concerns}
                onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                placeholder="e.g., Right Knee Pain"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-medicalHistory">Medical History (Flags)</Label>
              <Input
                id="edit-medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                placeholder="e.g., Previous R Ankle Sprain; Diabetes T2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-medications">Medications</Label>
              <Input
                id="edit-medications"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                placeholder="e.g., Ibuprofen; Metformin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-allergies">Allergies</Label>
              <Input
                id="edit-allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g., Latex; None"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedPatient(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0d967b] hover:bg-[#0a7a63]"
              >
                Update Patient
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the patient account. They will no longer be able to sign in.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
