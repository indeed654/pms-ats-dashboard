import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="reports-container">
      <div class="header">
        <h1>Reports & Analytics</h1>
        <p>Comprehensive hiring metrics and insights</p>
      </div>
      
      <div class="reports-grid">
        <div class="report-card">
          <h3>Hiring Pipeline Overview</h3>
          <canvas 
            baseChart
            [data]="pipelineData"
            [options]="pipelineOptions"
            [type]="'doughnut'">
          </canvas>
        </div>
        
        <div class="report-card">
          <h3>Time to Hire</h3>
          <canvas 
            baseChart
            [data]="timeToHireData"
            [options]="timeToHireOptions"
            [type]="'bar'">
          </canvas>
        </div>
        
        <div class="report-card">
          <h3>Source Effectiveness</h3>
          <canvas 
            baseChart
            [data]="sourceData"
            [options]="sourceOptions"
            [type]="'pie'">
          </canvas>
        </div>
        
        <div class="report-card">
          <h3>Candidate Experience</h3>
          <div class="metrics-grid">
            <div class="metric">
              <div class="metric-value">4.2</div>
              <div class="metric-label">Avg. Rating</div>
            </div>
            <div class="metric">
              <div class="metric-value">87%</div>
              <div class="metric-label">Completion Rate</div>
            </div>
            <div class="metric">
              <div class="metric-value">2.3d</div>
              <div class="metric-label">Avg. Response Time</div>
            </div>
            <div class="metric">
              <div class="metric-value">94%</div>
              <div class="metric-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions-section">
        <button class="btn btn-primary" (click)="generateReport()">
          <span>📊</span> Generate Report
        </button>
        <button class="btn btn-outline" (click)="exportData()">
          <span>💾</span> Export Data
        </button>
        <button class="btn btn-outline" (click)="scheduleReport()">
          <span>⏰</span> Schedule Report
        </button>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
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
    
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .report-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      height: 350px;
    }
    
    .report-card h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      height: 250px;
      align-content: center;
    }
    
    .metric {
      text-align: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }
    
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }
    
    .metric-label {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
    }
    
    .actions-section {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    
    .btn-outline {
      background: white;
      color: #3b82f6;
      border: 2px solid #3b82f6;
    }
    
    .btn-outline:hover {
      background: #3b82f6;
      color: white;
    }
  `]
})
export class ReportsComponent {
  currentUser: any = null;

  // Pipeline chart data
  pipelineData: ChartData<'doughnut'> = {
    labels: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
    datasets: [
      {
        data: [1247, 356, 189, 42, 38],
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

  // Time to hire data
  timeToHireData: ChartData<'bar'> = {
    labels: ['Frontend', 'Backend', 'Product', 'Design', 'QA'],
    datasets: [
      {
        data: [12, 18, 15, 22, 14],
        label: 'Days',
        backgroundColor: '#3b82f6'
      }
    ]
  };

  timeToHireOptions: ChartConfiguration['options'] = {
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

  // Source effectiveness data
  sourceData: ChartData<'pie'> = {
    labels: ['LinkedIn', 'Indeed', 'Referrals', 'Company Site', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444'
        ]
      }
    ]
  };

  sourceOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(private authService: AuthService, public toastService: ToastService) {
    this.currentUser = this.authService.getCurrentUser();
    const allowedRoles = [UserRole.ADMIN, UserRole.RECRUITER];
    if (!this.currentUser || !allowedRoles.includes(this.currentUser.role as UserRole)) {
      console.warn('Unauthorized access to reports');
    }
  }

  generateReport() {
    this.toastService.success('Report generated successfully');
  }

  exportData() {
    this.toastService.info('Exporting report data...');
    // Simulate export process
    setTimeout(() => {
      this.toastService.success('Report data exported successfully');
    }, 1500);
  }

  scheduleReport() {
    this.toastService.success('Report scheduled for automated generation');
  }
}