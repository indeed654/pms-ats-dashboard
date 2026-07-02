import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <p class="subtitle">System overview and management</p>
        </div>
        <div class="role-badge admin">Administrator</div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h3>Total Users</h3>
            <div class="stat-icon users">👥</div>
          </div>
          <div class="stat-value">1,248</div>
          <div class="stat-trend positive">+12% from last month</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Active Jobs</h3>
            <div class="stat-icon jobs">💼</div>
          </div>
          <div class="stat-value">89</div>
          <div class="stat-trend positive">+5% from last week</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>System Health</h3>
            <div class="stat-icon health">💚</div>
          </div>
          <div class="stat-value">98.7%</div>
          <div class="stat-trend positive">All systems operational</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h3>Pending Actions</h3>
            <div class="stat-icon actions">⚡</div>
          </div>
          <div class="stat-value">23</div>
          <div class="stat-trend warning">Requires attention</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>User Activity Overview</h3>
          <canvas 
            baseChart
            [data]="userActivityData"
            [options]="userActivityOptions"
            [type]="'line'">
          </canvas>
        </div>
        
        <div class="chart-card">
          <h3>System Performance</h3>
          <canvas 
            baseChart
            [data]="systemPerformanceData"
            [options]="systemPerformanceOptions"
            [type]="'bar'">
          </canvas>
        </div>
      </div>

      <!-- Admin Actions -->
      <div class="admin-actions">
        <h3>System Management</h3>
        <div class="actions-grid">
          <button class="action-card" (click)="manageUsers()">
            <div class="action-icon">👥</div>
            <h4>User Management</h4>
            <p>Manage user accounts and permissions</p>
          </button>
          
          <button class="action-card" (click)="generateReports()">
            <div class="action-icon">📊</div>
            <h4>Reports & Analytics</h4>
            <p>Generate system-wide reports</p>
          </button>
          
          <button class="action-card" (click)="systemSettings()">
            <div class="action-icon">⚙️</div>
            <h4>System Settings</h4>
            <p>Configure platform settings</p>
          </button>
          
          <button class="action-card" (click)="manageNotifications()">
            <div class="action-icon">🔔</div>
            <h4>Notifications</h4>
            <p>Manage system alerts</p>
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

    .role-badge.admin {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fecaca;
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

    .stat-icon.users { background: #dbeafe; color: #3b82f6; }
    .stat-icon.jobs { background: #dcfce7; color: #22c55e; }
    .stat-icon.health { background: #fef3c7; color: #f59e0b; }
    .stat-icon.actions { background: #ffe4e6; color: #ef4444; }

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
    }

    .chart-card h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .admin-actions {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    .admin-actions h3 {
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
export class AdminDashboardComponent implements OnInit {
  currentUser: any = null;

  // Chart data
  userActivityData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Active Users',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'New Registrations',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  userActivityOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  systemPerformanceData: ChartData<'bar'> = {
    labels: ['CPU', 'Memory', 'Disk', 'Network', 'Database'],
    datasets: [
      {
        data: [85, 72, 90, 65, 78],
        label: 'Performance %',
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

  systemPerformanceOptions: ChartConfiguration['options'] = {
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
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      // This should never happen due to route guards, but good practice
      console.warn('Unauthorized access to admin dashboard');
    }
  }

  manageUsers(): void {
    this.toastService.info('Opening user management...');
    this.router.navigate(['/app/users']);
  }

  generateReports(): void {
    this.toastService.info('Opening reports dashboard...');
    this.router.navigate(['/app/reports']);
  }

  systemSettings(): void {
    this.toastService.info('Opening system settings...');
    this.router.navigate(['/app/settings']);
  }

  manageNotifications(): void {
    this.toastService.info('Opening notification management...');
    this.router.navigate(['/app/activity']);
  }
}