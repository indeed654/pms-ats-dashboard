import { Injectable, signal, computed } from '@angular/core';
import { ToastService } from './toast.service';

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  status: 'active' | 'paused' | 'closed' | 'draft';
  applicants: number;
  postedDate: Date;
  salaryRange?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobsStore {
  private jobs = signal<Job[]>([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      description: 'We are looking for an experienced frontend developer...',
      requirements: ['5+ years Angular', 'TypeScript', 'CSS/SCSS', 'REST APIs'],
      status: 'active',
      applicants: 42,
      postedDate: new Date('2024-01-10'),
      salaryRange: '$120k - $160k'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      description: 'Lead product development and strategy...',
      requirements: ['3+ years product management', 'Agile', 'Analytics', 'Stakeholder management'],
      status: 'active',
      applicants: 28,
      postedDate: new Date('2024-01-08'),
      salaryRange: '$130k - $170k'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      description: 'Create beautiful user experiences...',
      requirements: ['3+ years UX design', 'Figma', 'User research', 'Prototyping'],
      status: 'paused',
      applicants: 15,
      postedDate: new Date('2024-01-05'),
      salaryRange: '$90k - $130k'
    }
  ]);

  jobsList = this.jobs.asReadonly();
  activeJobs = computed(() => this.jobs().filter(j => j.status === 'active').length);
  totalApplicants = computed(() => this.jobs().reduce((sum, job) => sum + job.applicants, 0));
  pausedJobs = computed(() => this.jobs().filter(j => j.status === 'paused').length);
  closedJobs = computed(() => this.jobs().filter(j => j.status === 'closed').length);

  constructor(private toast: ToastService) {}

  addJob(job: Omit<Job, 'id' | 'applicants'>) {
    const newJob: Job = {
      ...job,
      id: Math.max(...this.jobs().map(j => j.id), 0) + 1,
      applicants: 0
    };
    this.jobs.update(jobs => [...jobs, newJob]);
    this.toast.success('Job posting created successfully!');
  }

  updateJob(id: number, updates: Partial<Job>) {
    this.jobs.update(jobs => 
      jobs.map(job => 
        job.id === id ? { ...job, ...updates } : job
      )
    );
    this.toast.success('Job updated successfully!');
  }

  deleteJob(id: number) {
    this.jobs.update(jobs => jobs.filter(j => j.id !== id));
    this.toast.success('Job removed successfully!');
  }

  toggleJobStatus(id: number) {
    const job = this.jobs().find(j => j.id === id);
    if (!job) return;

    const newStatus = job.status === 'active' ? 'paused' : 'active';
    this.updateJob(id, { status: newStatus });
    this.toast.success(`Job ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
  }

  closeJob(id: number) {
    this.updateJob(id, { status: 'closed' });
    this.toast.success('Job closed successfully!');
  }

  getJobById(id: number) {
    return this.jobs().find(j => j.id === id);
  }

  incrementApplicants(jobId: number) {
    const job = this.jobs().find(j => j.id === jobId);
    if (job) {
      this.updateJob(jobId, { applicants: job.applicants + 1 });
    }
  }
}