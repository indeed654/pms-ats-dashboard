import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Candidate Dashboard</h1>
          <p class="subtitle">Track your applications and interviews</p>
        </div>
        <div class="role-badge candidate">Candidate</div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h3>Active Applications</h3>
            <div class="stat-icon active">📄</div>
          </div>
          <div class="stat-value">5</div>
          <div class="stat-trend">Currently tracking</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Interviews Scheduled</h3>
            <div class="stat-icon interviews">📅</div>
          </div>
          <div class="stat-value">2</div>
          <div class="stat-trend positive">Upcoming this week</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Applications This Month</h3>
            <div class="stat-icon monthly">📈</div>
          </div>
          <div class="stat-value">18</div>
          <div class="stat-trend positive">+6 from last month</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Response Rate</h3>
            <div class="stat-icon response">📊</div>
          </div>
          <div class="stat-value">67%</div>
          <div class="stat-trend positive">Above average</div>
        </div>
      </div>

      <!-- Application Status -->
      <div class="applications-section">
        <h3>Your Applications</h3>
        <div class="applications-list">
          <div class="application-item">
            <div class="application-company">
              <h4>TechCorp Solutions</h4>
              <p>Senior Frontend Developer</p>
            </div>
            <div class="application-date">Applied: Jan 15, 2024</div>
            <div class="application-status interview">Interview Scheduled</div>
          </div>
          
          <div class="application-item">
            <div class="application-company">
              <h4>InnovateTech Inc</h4>
              <p>Full Stack Engineer</p>
            </div>
            <div class="application-date">Applied: Jan 10, 2024</div>
            <div class="application-status review">Under Review</div>
          </div>
          
          <div class="application-item">
            <div class="application-company">
              <h4>Digital Solutions Ltd</h4>
              <p>React Developer</p>
            </div>
            <div class="application-date">Applied: Jan 5, 2024</div>
            <div class="application-status accepted">Offer Received</div>
          </div>
        </div>
      </div>

      <!-- Interview Schedule -->
      <div class="interviews-section">
        <h3>Upcoming Interviews</h3>
        <div class="interviews-grid">
          <div class="interview-card">
            <div class="interview-header">
              <h4>TechCorp Solutions</h4>
              <div class="interview-date">Jan 25, 2024</div>
            </div>
            <div class="interview-role">Senior Frontend Developer</div>
            <div class="interview-time">10:00 AM - 11:00 AM</div>
            <div class="interview-details">
              <p>📍 Virtual Interview</p>
              <p>👤 2 Interviewers</p>
            </div>
            <button class="prepare-btn">Prepare Now</button>
          </div>
          
          <div class="interview-card">
            <div class="interview-header">
              <h4>InnovateTech Inc</h4>
              <div class="interview-date">Feb 1, 2024</div>
            </div>
            <div class="interview-role">Full Stack Engineer</div>
            <div class="interview-time">2:30 PM - 3:30 PM</div>
            <div class="interview-details">
              <p>📍 On-site Interview</p>
              <p>👤 3 Interviewers</p>
            </div>
            <button class="prepare-btn">Prepare Now</button>
          </div>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="chart-section">
        <div class="chart-card">
          <h3>Application Progress</h3>
          <canvas 
            baseChart
            [data]="progressData"
            [options]="progressOptions"
            [type]="'line'">
          </canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Candidate Tools</h3>
        <div class="actions-grid">
          <button class="action-card" (click)="searchJobs()">
            <div class="action-icon">🔍</div>
            <h4>Job Search</h4>
            <p>Find new opportunities</p>
          </button>
          
          <button class="action-card" (click)="updateResume()">
            <div class="action-icon">📄</div>
            <h4>Update Resume</h4>
            <p>Keep your profile current</p>
          </button>
          
          <button class="action-card" (click)="interviewPrep()">
            <div class="action-icon">🎯</div>
            <h4>Interview Prep</h4>
            <p>Practice common questions</p>
          </button>
          
          <button class="action-card" (click)="profileSettings()">
            <div class="action-icon">👤</div>
            <h4>Profile Settings</h4>
            <p>Manage your account</p>
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

    .role-badge.candidate {
      background: #dcfce7;
      color: #22c55e;
      border: 1px solid #bbf7d0;
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

    .stat-icon.active { background: #dbeafe; color: #3b82f6; }
    .stat-icon.interviews { background: #fef3c7; color: #f59e0b; }
    .stat-icon.monthly { background: #dcfce7; color: #22c55e; }
    .stat-icon.response { background: #ffe4e6; color: #ef4444; }

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

    .applications-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .applications-section h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .application-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
    }

    .application-company {
      flex: 1;
    }

    .application-company h4 {
      margin: 0 0 0.25rem 0;
      color: #1e293b;
      font-size: 1.1rem;
    }

    .application-company p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .application-date {
      color: #64748b;
      font-size: 0.9rem;
      min-width: 120px;
      text-align: center;
    }

    .application-status {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      min-width: 120px;
      text-align: center;
    }

    .application-status.interview {
      background: #fef3c7;
      color: #f59e0b;
    }

    .application-status.review {
      background: #dbeafe;
      color: #3b82f6;
    }

    .application-status.accepted {
      background: #dcfce7;
      color: #22c55e;
    }

    .interviews-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }

    .interviews-section h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .interviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .interview-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1.25rem;
      background: #f8fafc;
    }

    .interview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .interview-header h4 {
      margin: 0;
      color: #1e293b;
      font-size: 1.1rem;
    }

    .interview-date {
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .interview-role {
      color: #3b82f6;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .interview-time {
      color: #f59e0b;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .interview-details {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .interview-details p {
      margin: 0.25rem 0;
    }

    .prepare-btn {
      width: 100%;
      padding: 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .prepare-btn:hover {
      background: #2563eb;
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
      border-color: #22c55e;
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
export class CandidateDashboardComponent implements OnInit {
  currentUser: any = null;

  // Progress chart data
  progressData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [2, 5, 8, 12, 15, 18],
        label: 'Applications Submitted',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  progressOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
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
    if (!this.currentUser || this.currentUser.role !== UserRole.CANDIDATE) {
      console.warn('Unauthorized access to candidate dashboard');
    }
  }

  searchJobs(): void {
    this.toastService.info('Opening job search...');
    this.router.navigate(['/app/jobs']);
  }

  updateResume(): void {
    this.toastService.info('Opening resume editor...');
    this.router.navigate(['/app/profile']);
  }

  interviewPrep(): void {
    this.toastService.info('Opening interview preparation...');
    this.router.navigate(['/app/interviews']);
  }

  profileSettings(): void {
    this.toastService.info('Opening profile settings...');
    this.router.navigate(['/app/profile']);
  }
}