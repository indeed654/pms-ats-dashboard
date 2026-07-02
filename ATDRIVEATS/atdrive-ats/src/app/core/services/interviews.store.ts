import { Injectable, signal, computed } from '@angular/core';
import { ToastService } from './toast.service';

export interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  position: string;
  interviewer: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  rating?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewsStore {
  private interviews = signal<Interview[]>([
    {
      id: 1,
      candidateId: 1,
      candidateName: 'John Smith',
      position: 'Senior Frontend Developer',
      interviewer: 'Sarah Wilson',
      date: new Date('2024-01-20'),
      time: '10:00 AM',
      duration: 60,
      status: 'scheduled',
      notes: 'Technical interview focusing on Angular and TypeScript'
    },
    {
      id: 2,
      candidateId: 2,
      candidateName: 'Sarah Johnson',
      position: 'Product Manager',
      interviewer: 'David Chen',
      date: new Date('2024-01-19'),
      time: '2:00 PM',
      duration: 45,
      status: 'completed',
      feedback: 'Strong product sense, good communication skills',
      rating: 4,
      notes: 'Behavioral interview - excellent cultural fit'
    },
    {
      id: 3,
      candidateId: 3,
      candidateName: 'Mike Chen',
      position: 'UX Designer',
      interviewer: 'Lisa Thompson',
      date: new Date('2024-01-22'),
      time: '11:00 AM',
      duration: 90,
      status: 'scheduled',
      notes: 'Design portfolio review and case study discussion'
    }
  ]);

  interviewsList = this.interviews.asReadonly();
  scheduledCount = computed(() => this.interviews().filter(i => i.status === 'scheduled').length);
  completedCount = computed(() => this.interviews().filter(i => i.status === 'completed').length);
  upcomingInterviews = computed(() => 
    this.interviews().filter(i => i.status === 'scheduled' && i.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  );

  constructor(private toast: ToastService) {}

  addInterview(interview: Omit<Interview, 'id'>) {
    const newInterview: Interview = {
      ...interview,
      id: Math.max(...this.interviews().map(i => i.id), 0) + 1
    };
    this.interviews.update(interviews => [...interviews, newInterview]);
    this.toast.success('Interview scheduled successfully!');
  }

  updateInterview(id: number, updates: Partial<Interview>) {
    this.interviews.update(interviews => 
      interviews.map(interview => 
        interview.id === id ? { ...interview, ...updates } : interview
      )
    );
    this.toast.success('Interview updated successfully!');
  }

  deleteInterview(id: number) {
    this.interviews.update(interviews => interviews.filter(i => i.id !== id));
    this.toast.success('Interview removed successfully!');
  }

  completeInterview(id: number, feedback: string, rating: number) {
    this.updateInterview(id, { 
      status: 'completed', 
      feedback, 
      rating 
    });
    this.toast.success('Interview completed and feedback recorded!');
  }

  cancelInterview(id: number) {
    this.updateInterview(id, { status: 'cancelled' });
    this.toast.success('Interview cancelled successfully!');
  }

  rescheduleInterview(id: number, newDate: Date, newTime: string) {
    this.updateInterview(id, { 
      date: newDate, 
      time: newTime,
      status: 'scheduled'
    });
    this.toast.success('Interview rescheduled successfully!');
  }

  getInterviewById(id: number) {
    return this.interviews().find(i => i.id === id);
  }

  getInterviewsByCandidateId(candidateId: number) {
    return this.interviews().filter(i => i.candidateId === candidateId);
  }
}