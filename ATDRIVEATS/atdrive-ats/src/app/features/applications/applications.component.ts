import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="applications-container">
      <div class="header">
        <h1>My Applications</h1>
        <p>Track your job applications and status updates</p>
      </div>
      
      <div class="applications-grid">
        <div class="application-card" *ngFor="let app of applications">
          <div class="application-header">
            <div class="company-info">
              <div class="company-logo">{{ app.company.charAt(0) }}</div>
              <div>
                <div class="position">{{ app.position }}</div>
                <div class="company-name">{{ app.company }}</div>
              </div>
            </div>
            <div class="application-status" [class]="'status-' + app.status">
              {{ app.status.replace('_', ' ') | titlecase }}
            </div>
          </div>
          
          <div class="application-details">
            <div class="detail-row">
              <span class="detail-label">Applied:</span>
              <span class="detail-value">{{ app.appliedDate }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ app.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Salary:</span>
              <span class="detail-value">{{ app.salary }}</span>
            </div>
          </div>
          
          <div class="application-actions">
            <button 
              class="btn btn-primary" 
              (click)="viewDetails(app.id)"
              [disabled]="app.status === 'rejected'">
              View Details
            </button>
            <button 
              class="btn btn-outline" 
              (click)="withdrawApplication(app.id)"
              [disabled]="app.status === 'rejected' || app.status === 'hired'">
              Withdraw
            </button>
          </div>
        </div>
      </div>
      
      <div class="stats-section">
        <h2>Application Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ applications.length }}</div>
            <div class="stat-label">Total Applications</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getPendingCount() }}</div>
            <div class="stat-label">Pending Review</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getInterviewCount() }}</div>
            <div class="stat-label">Interviews Scheduled</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getHiredCount() }}</div>
            <div class="stat-label">Offers Received</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applications-container {
      padding: 1.5rem;
      background: #f8fafc;
      min-height: calc(100vh - 120px);
    }
    
    .header {
      margin-bottom: 2rem;
    }
    
    .header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .header p {
      margin: 0;
      color: #64748b;
      font-size: 1.1rem;
    }
    
    .applications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .application-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    
    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .company-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .company-logo {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: #22c55e;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .position {
      font-weight: 600;
      color: #1e293b;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }
    
    .company-name {
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .application-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending { background: #fef3c7; color: #f59e0b; }
    .status-interview { background: #dbeafe; color: #3b82f6; }
    .status-rejected { background: #fee2e2; color: #dc2626; }
    .status-hired { background: #dcfce7; color: #22c55e; }
    .status-under_review { background: #f3e8ff; color: #8b5cf6; }
    
    .application-details {
      margin-bottom: 1.5rem;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .detail-label {
      font-weight: 500;
      color: #64748b;
    }
    
    .detail-value {
      font-weight: 500;
      color: #1e293b;
    }
    
    .application-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      flex: 1;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: #22c55e;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #16a34a;
      transform: translateY(-2px);
    }
    
    .btn-outline {
      background: white;
      color: #22c55e;
      border: 2px solid #22c55e;
    }
    
    .btn-outline:hover:not(:disabled) {
      background: #22c55e;
      color: white;
    }
    
    .stats-section h2 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
    }
  `]
})
export class ApplicationsComponent {
  currentUser: any = null;
  applications = [
    {
      id: 1,
      company: 'TechCorp Solutions',
      position: 'Senior Frontend Developer',
      appliedDate: 'Jan 15, 2024',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      status: 'interview'
    },
    {
      id: 2,
      company: 'InnovateTech Inc',
      position: 'Full Stack Engineer',
      appliedDate: 'Jan 10, 2024',
      location: 'New York, NY',
      salary: '$110k - $140k',
      status: 'under_review'
    },
    {
      id: 3,
      company: 'Digital Solutions Ltd',
      position: 'React Developer',
      appliedDate: 'Jan 5, 2024',
      location: 'Remote',
      salary: '$90k - $120k',
      status: 'hired'
    },
    {
      id: 4,
      company: 'StartupXYZ',
      position: 'Frontend Engineer',
      appliedDate: 'Dec 28, 2023',
      location: 'Austin, TX',
      salary: '$95k - $125k',
      status: 'pending'
    },
    {
      id: 5,
      company: 'Enterprise Corp',
      position: 'UI Developer',
      appliedDate: 'Dec 20, 2023',
      location: 'Chicago, IL',
      salary: '$85k - $110k',
      status: 'rejected'
    }
  ];

  constructor(private authService: AuthService, public toastService: ToastService) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== UserRole.CANDIDATE) {
      console.warn('Unauthorized access to applications');
    }
  }

  viewDetails(applicationId: number) {
    const app = this.applications.find(a => a.id === applicationId);
    if (app) {
      this.toastService.info(`Viewing details for ${app.position} at ${app.company}`);
    }
  }

  withdrawApplication(applicationId: number) {
    const app = this.applications.find(a => a.id === applicationId);
    if (app && confirm(`Are you sure you want to withdraw your application for ${app.position} at ${app.company}?`)) {
      this.toastService.warning(`Application withdrawn successfully`);
      // In real app, this would update the backend
    }
  }

  getPendingCount(): number {
    return this.applications.filter(a => a.status === 'pending').length;
  }

  getInterviewCount(): number {
    return this.applications.filter(a => a.status === 'interview').length;
  }

  getHiredCount(): number {
    return this.applications.filter(a => a.status === 'hired').length;
  }
}