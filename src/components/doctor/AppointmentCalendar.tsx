import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Trash2 } from 'lucide-react';
import { usePhysio } from '@/context/PhysioContext';
import { Badge } from '@/components/ui/badge';

export const AppointmentCalendar = ({ onNewAppointment }: { onNewAppointment: () => void }) => {
  const { appointments, deleteAppointment, getAppointmentsByDate } = usePhysio();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const getAppointmentCountForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getAppointmentsByDate(dateStr).length;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  const selectedAppointments = getAppointmentsByDate(selectedDate);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-2 rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const count = getAppointmentCountForDay(day);
              const today = isToday(day);
              const selected = isSelected(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-lg p-2 text-sm transition-colors relative
                    ${selected ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}
                    ${today && !selected ? 'border-2 border-primary' : ''}
                  `}
                >
                  <div className="font-medium">{day}</div>
                  {count > 0 && (
                    <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5`}>
                      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 w-1 rounded-full ${selected ? 'bg-primary-foreground' : 'bg-primary'}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Appointments for selected date */}
      <Card className="rounded-2xl border-border bg-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </CardTitle>
            <Button
              size="sm"
              onClick={onNewAppointment}
              className="bg-[#0d967b] hover:bg-[#0a7a63]"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No appointments scheduled</p>
              </div>
            ) : (
              selectedAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-3 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{apt.time}</span>
                      <Badge variant="secondary" className="text-xs">
                        {apt.duration}min
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => deleteAppointment(apt.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{apt.patient_name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs mb-2">
                    {apt.type}
                  </Badge>
                  {apt.notes && (
                    <p className="text-xs text-muted-foreground mt-2">{apt.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

