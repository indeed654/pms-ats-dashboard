import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Recruiter Dashboard</h1>
          <p class="subtitle">Manage jobs and candidates</p>
        </div>
        <div class="role-badge recruiter">Recruiter</div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h3>Open Positions</h3>
            <div class="stat-icon jobs">💼</div>
          </div>
          <div class="stat-value">24</div>
          <div class="stat-trend positive">+3 this week</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>New Candidates</h3>
            <div class="stat-icon candidates">👥</div>
          </div>
          <div class="stat-value">156</div>
          <div class="stat-trend positive">+28% this month</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Interviews Scheduled</h3>
            <div class="stat-icon interviews">📅</div>
          </div>
          <div class="stat-value">42</div>
          <div class="stat-trend positive">This week</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Hiring Rate</h3>
            <div class="stat-icon rate">📈</div>
          </div>
          <div class="stat-value">78%</div>
          <div class="stat-trend positive">Above target</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>Candidate Pipeline</h3>
          <canvas 
            baseChart
            [data]="pipelineData"
            [options]="pipelineOptions"
            [type]="'doughnut'">
          </canvas>
        </div>
        
        <div class="chart-card">
          <h3>Job Applications Trend</h3>
          <canvas 
            baseChart
            [data]="applicationsData"
            [options]="applicationsOptions"
            [type]="'line'">
          </canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-card" (click)="createJob()">
            <div class="action-icon">➕</div>
            <h4>Create Job</h4>
            <p>Post a new position</p>
          </button>
          
          <button class="action-card" (click)="reviewCandidates()">
            <div class="action-icon">🔍</div>
            <h4>Review Candidates</h4>
            <p>Browse applicant pool</p>
          </button>
          
          <button class="action-card" (click)="scheduleInterview()">
            <div class="action-icon">📅</div>
            <h4>Schedule Interview</h4>
            <p>Set up candidate interviews</p>
          </button>
          
          <button class="action-card" (click)="generateJD()">
            <div class="action-icon">🤖</div>
            <h4>AI JD Generator</h4>
            <p>Create job descriptions</p>
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

    .role-badge.recruiter {
      background: #dbeafe;
      color: #3b82f6;
      border: 1px solid #bfdbfe;
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

    .stat-icon.jobs { background: #dbeafe; color: #3b82f6; }
    .stat-icon.candidates { background: #dcfce7; color: #22c55e; }
    .stat-icon.interviews { background: #fef3c7; color: #f59e0b; }
    .stat-icon.rate { background: #ffe4e6; color: #ef4444; }

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

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 1.5rem;
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
      border-color: #3b82f6;
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
export class RecruiterDashboardComponent implements OnInit {
  currentUser: any = null;

  // Pipeline chart data
  pipelineData: ChartData<'doughnut'> = {
    labels: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
    datasets: [
      {
        data: [156, 89, 42, 18, 15],
        backgroundColor: [
          '#94a3b8',
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#10b981'
        ]
      }
    ]
  };

  pipelineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Applications trend data
  applicationsData: ChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [24, 32, 28, 45, 38, 22, 19],
        label: 'Applications',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  applicationsOptions: ChartConfiguration['options'] = {
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
    if (!this.currentUser || this.currentUser.role !== UserRole.RECRUITER) {
      console.warn('Unauthorized access to recruiter dashboard');
    }
  }

  createJob(): void {
    this.toastService.info('Opening job creation form...');
    this.router.navigate(['/app/jobs']);
  }

  reviewCandidates(): void {
    this.toastService.info('Opening candidate review...');
    this.router.navigate(['/app/candidates']);
  }

  scheduleInterview(): void {
    this.toastService.info('Opening interview scheduler...');
    this.router.navigate(['/app/interviews']);
  }

  generateJD(): void {
    this.toastService.info('Opening AI JD Generator...');
    this.router.navigate(['/app/ai/jd-generator']);
  }
}