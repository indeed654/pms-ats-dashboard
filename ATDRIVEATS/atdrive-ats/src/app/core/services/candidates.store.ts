import { Injectable, signal, computed } from '@angular/core';
import { ToastService } from './toast.service';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'applied' | 'shortlisted' | 'interview' | 'hired' | 'rejected';
  experience: number;
  skills: string[];
  appliedDate: Date;
  source: 'linkedin' | 'referral' | 'career_page' | 'job_board';
}

@Injectable({
  providedIn: 'root'
})
export class CandidatesStore {
  private candidates = signal<Candidate[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      status: 'applied',
      experience: 5,
      skills: ['Angular', 'TypeScript', 'React', 'Node.js'],
      appliedDate: new Date('2024-01-15'),
      source: 'linkedin'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      position: 'Product Manager',
      status: 'shortlisted',
      experience: 7,
      skills: ['Product Strategy', 'Agile', 'Analytics', 'UX Research'],
      appliedDate: new Date('2024-01-14'),
      source: 'referral'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      status: 'interview',
      experience: 4,
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      appliedDate: new Date('2024-01-13'),
      source: 'career_page'
    }
  ]);

  candidatesList = this.candidates.asReadonly();
  totalCandidates = computed(() => this.candidates().length);
  shortlistedCount = computed(() => this.candidates().filter(c => c.status === 'shortlisted').length);
  interviewCount = computed(() => this.candidates().filter(c => c.status === 'interview').length);
  hiredCount = computed(() => this.candidates().filter(c => c.status === 'hired').length);

  constructor(private toast: ToastService) {}

  get toastService() {
    return this.toast;
  }

  addCandidate(candidate: Omit<Candidate, 'id'>) {
    const newCandidate: Candidate = {
      ...candidate,
      id: Math.max(...this.candidates().map(c => c.id), 0) + 1
    };
    this.candidates.update(candidates => [...candidates, newCandidate]);
    this.toast.success('Candidate added successfully!');
  }

  updateCandidate(id: number, updates: Partial<Candidate>) {
    this.candidates.update(candidates => 
      candidates.map(candidate => 
        candidate.id === id ? { ...candidate, ...updates } : candidate
      )
    );
    this.toast.success('Candidate updated successfully!');
  }

  deleteCandidate(id: number) {
    this.candidates.update(candidates => candidates.filter(c => c.id !== id));
    this.toast.success('Candidate removed successfully!');
  }

  moveCandidateStage(id: number, newStatus: Candidate['status']) {
    this.updateCandidate(id, { status: newStatus });
    this.toast.success(`Candidate moved to ${newStatus} stage!`);
  }

  getCandidateById(id: number) {
    return this.candidates().find(c => c.id === id);
  }
}