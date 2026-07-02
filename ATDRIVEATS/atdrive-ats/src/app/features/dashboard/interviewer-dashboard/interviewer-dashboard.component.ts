import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-interviewer-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Interviewer Dashboard</h1>
          <p class="subtitle">Manage your interviews and feedback</p>
        </div>
        <div class="role-badge interviewer">Interviewer</div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h3>Upcoming Interviews</h3>
            <div class="stat-icon upcoming">📅</div>
          </div>
          <div class="stat-value">8</div>
          <div class="stat-trend">Today</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Pending Feedback</h3>
            <div class="stat-icon feedback">📝</div>
          </div>
          <div class="stat-value">3</div>
          <div class="stat-trend warning">Due soon</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Completed This Week</h3>
            <div class="stat-icon completed">✅</div>
          </div>
          <div class="stat-value">12</div>
          <div class="stat-trend positive">+4 from last week</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Avg. Rating</h3>
            <div class="stat-icon rating">⭐</div>
          </div>
          <div class="stat-value">4.2</div>
          <div class="stat-trend positive">Out of 5</div>
        </div>
      </div>

      <!-- Interview Schedule -->
      <div class="schedule-section">
        <h3>Today's Interviews</h3>
        <div class="interviews-list">
          <div class="interview-item">
            <div class="interview-time">10:00 AM</div>
            <div class="interview-details">
              <h4>Senior Frontend Developer</h4>
              <p>Candidate: Sarah Johnson</p>
            </div>
            <div class="interview-status pending">Pending</div>
          </div>
          
          <div class="interview-item">
            <div class="interview-time">2:00 PM</div>
            <div class="interview-details">
              <h4>Product Manager</h4>
              <p>Candidate: Michael Chen</p>
            </div>
            <div class="interview-status confirmed">Confirmed</div>
          </div>
          
          <div class="interview-item">
            <div class="interview-time">4:30 PM</div>
            <div class="interview-details">
              <h4>UX Designer</h4>
              <p>Candidate: Emma Rodriguez</p>
            </div>
            <div class="interview-status completed">Completed</div>
          </div>
        </div>
      </div>

      <!-- Performance Chart -->
      <div class="chart-section">
        <div class="chart-card">
          <h3>Interview Performance</h3>
          <canvas 
            baseChart
            [data]="performanceData"
            [options]="performanceOptions"
            [type]="'bar'">
          </canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Interview Tools</h3>
        <div class="actions-grid">
          <button class="action-card" (click)="openInterviewGuide()">
            <div class="action-icon">📋</div>
            <h4>Interview Guide</h4>
            <p>Access question templates</p>
          </button>
          
          <button class="action-card" (click)="openFeedbackForms()">
            <div class="action-icon">📊</div>
            <h4>Feedback Forms</h4>
            <p>Submit candidate evaluations</p>
          </button>
          
          <button class="action-card" (click)="openScheduleManager()">
            <div class="action-icon">📅</div>
            <h4>Schedule Manager</h4>
            <p>View all appointments</p>
          </button>
          
          <button class="action-card" (click)="viewCandidateProfiles()">
            <div class="action-icon">👥</div>
            <h4>Candidate Profiles</h4>
            <p>Review applicant details</p>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      background: #f8fafc;
      min-height: calc(100vh - 120px);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .subtitle {
      margin: 0;
      color: #64748b;
      font-size: 1.1rem;
    }

    .role-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .role-badge.interviewer {
      background: #fef3c7;
      color: #f59e0b;
      border: 1px solid #fde68a;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-header h3 {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .stat-icon.upcoming { background: #dbeafe; color: #3b82f6; }
    .stat-icon.feedback { background: #ffe4e6; color: #ef4444; }
    .stat-icon.completed { background: #dcfce7; color: #22c55e; }
    .stat-icon.rating { background: #fef3c7; color: #f59e0b; }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-trend {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .stat-trend.positive { color: #22c55e; }
    .stat-trend.warning { color: #f59e0b; }

    .schedule-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .schedule-section h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .interviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .interview-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
    }

    .interview-time {
      font-weight: 600;
      color: #3b82f6;
      min-width: 80px;
    }

    .interview-details {
      flex: 1;
      margin: 0 1rem;
    }

    .interview-details h4 {
      margin: 0 0 0.25rem 0;
      color: #1e293b;
      font-size: 1rem;
    }

    .interview-details p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .interview-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .interview-status.pending {
      background: #dbeafe;
      color: #3b82f6;
    }

    .interview-status.confirmed {
      background: #dcfce7;
      color: #22c55e;
    }

    .interview-status.completed {
      background: #e5e7eb;
      color: #6b7280;
    }

    .chart-section {
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      height: 350px;
    }

    .chart-card h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .quick-actions h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
      border-color: #f59e0b;
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .action-card h4 {
      margin: 0 0 0.5rem 0;
      color: #1e293b;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .action-card p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  `]
})
export class InterviewerDashboardComponent implements OnInit {
  currentUser: any = null;

  // Performance chart data
  performanceData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [85, 92, 78, 88, 95, 87],
        label: 'Interview Quality Score',
        backgroundColor: '#f59e0b'
      }
    ]
  };

  performanceOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== UserRole.INTERVIEWER) {
      console.warn('Unauthorized access to interviewer dashboard');
    }
  }

  openInterviewGuide(): void {
    this.toastService.info('Opening interview guide...');
    this.router.navigate(['/app/interviews']);
  }

  openFeedbackForms(): void {
    this.toastService.info('Opening feedback forms...');
    this.router.navigate(['/app/feedback']);
  }

  openScheduleManager(): void {
    this.toastService.info('Opening schedule manager...');
    this.router.navigate(['/app/interviews']);
  }

  viewCandidateProfiles(): void {
    this.toastService.info('Opening candidate profiles...');
    this.router.navigate(['/app/candidates']);
  }
}