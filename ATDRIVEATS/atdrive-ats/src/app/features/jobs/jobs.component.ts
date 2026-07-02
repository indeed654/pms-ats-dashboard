import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RoleService } from '../../core/services/role.service';
import { UserRole } from '../../core/models/role.model';
import { RoleDirectivesModule } from '../../shared/role-directives.module';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  status: 'active' | 'paused' | 'closed' | 'draft';
  applicants: number;
  postedDate: string;
}

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, CardComponent, BaseChartDirective, RoleDirectivesModule],
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s cubic-bezier(0.22, 1, 0.36, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('jobCardStagger', [
      transition(':enter', [
        query('.job-card', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('80ms', [
            animate('0.4s cubic-bezier(0.22, 1, 0.36, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('chartLoad', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="jobs-page" [@pageEnter]>
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">Jobs</h1>
            <p class="page-subtitle">Manage all job postings and hiring pipelines</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline filter-btn">
              <span class="btn-icon">🔍</span>
              <span class="btn-text">Filter</span>
            </button>
            <button class="btn btn-outline export-btn">
              <span class="btn-icon">📊</span>
              <span class="btn-text">Export Jobs</span>
            </button>
            <button 
              *appHasRole="[UserRole.ADMIN, UserRole.RECRUITER]"
              class="btn btn-primary add-job-btn" 
              (click)="addNewJob()">
              <span class="btn-icon">➕</span>
              <span class="btn-text">Add New Job</span>
            </button>
            
            <button 
              *appHasNotRole="[UserRole.ADMIN, UserRole.RECRUITER]"
              class="btn btn-outline disabled-btn" 
              disabled>
              <span class="btn-icon">🔒</span>
              <span class="btn-text">Add Job (Restricted)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview" [@pageEnter]>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon active-icon">💼</div>
            <div class="stat-info">
              <div class="stat-number">{{ activeJobs() }}</div>
              <div class="stat-label">Active Jobs</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon applicants-icon">👥</div>
            <div class="stat-info">
              <div class="stat-number">{{ totalApplicants() }}</div>
              <div class="stat-label">Total Applicants</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon review-icon">📋</div>
            <div class="stat-info">
              <div class="stat-number">{{ inReview() }}</div>
              <div class="stat-label">In Review</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon filled-icon">✅</div>
            <div class="stat-info">
              <div class="stat-number">{{ recentlyFilled() }}</div>
              <div class="stat-label">Recently Filled</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon active-icon">💼</div>
          <div class="stat-info">
            <div class="stat-number">24</div>
            <div class="stat-label">Open Jobs</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon applicants-icon">👥</div>
          <div class="stat-info">
            <div class="stat-number">1,247</div>
            <div class="stat-label">Total Applications</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon review-icon">📋</div>
          <div class="stat-info">
            <div class="stat-number">52</div>
            <div class="stat-label">Avg per Job</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon filled-icon">✅</div>
          <div class="stat-info">
            <div class="stat-number">18</div>
            <div class="stat-label">Recently Filled</div>
          </div>
        </div>
      </div>

      <!-- Job Analytics -->
      <div class="analytics-section" [@chartLoad]>
        <div class="charts-grid">
          <app-card class="chart-card">
            <div class="card-header">
              <h3>Applications per Job</h3>
            </div>
            <div class="chart-container">
              <canvas
                baseChart
                [data]="applicationsChartData"
                [options]="applicationsChartOptions"
                [type]="applicationsChartType">
              </canvas>
            </div>
          </app-card>
          
          <app-card class="chart-card">
            <div class="card-header">
              <h3>Jobs by Status</h3>
            </div>
            <div class="chart-container">
              <canvas
                baseChart
                [data]="statusChartData"
                [options]="statusChartOptions"
                [type]="statusChartType">
              </canvas>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Job Listings -->
      <div class="jobs-section">
        <div class="section-header">
          <h2>Job Positions</h2>
          <div class="view-controls">
            <button 
              class="view-toggle" 
              [class.active]="viewMode() === 'grid'"
              (click)="viewMode.set('grid')">
              Grid View
            </button>
            <button 
              class="view-toggle" 
              [class.active]="viewMode() === 'list'"
              (click)="viewMode.set('list')">
              List View
            </button>
          </div>
        </div>

        <div class="jobs-container" [@jobCardStagger]>
          <!-- Grid View -->
          <div class="jobs-grid" *ngIf="viewMode() === 'grid'">
            <div 
              class="job-card" 
              *ngFor="let job of jobs()"
              [class.paused]="job.status === 'paused'"
              [class.closed]="job.status === 'closed'">
              <div class="job-header">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-status" [class]="'status-' + job.status">
                  {{ job.status | titlecase }}
                </div>
              </div>
              
              <div class="job-details">
                <div class="job-meta">
                  <span class="meta-item">
                    <span class="meta-icon">🏢</span>
                    {{ job.department }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📍</span>
                    {{ job.location }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    {{ job.postedDate }}
                  </span>
                </div>
                
                <div class="applicants-count">
                  <span class="count-icon">👤</span>
                  <span class="count-number">{{ job.applicants }}</span>
                  <span class="count-label">applicants</span>
                </div>
              </div>
              
              <div class="job-actions">
                <button 
                  class="action-btn view-btn" 
                  (click)="viewApplicants(job.id)"
                  [disabled]="loadingJob() === job.id">
                  <span class="btn-icon" *ngIf="loadingJob() !== job.id">👁️</span>
                  <span class="btn-icon spinning" *ngIf="loadingJob() === job.id">🔄</span>
                  View Applicants
                </button>
                <button 
                  class="action-btn edit-btn" 
                  (click)="editJob(job.id)">
                  <span class="btn-icon">✏️</span>
                  Edit
                </button>
                <button 
                  class="action-btn toggle-btn" 
                  (click)="toggleJobStatus(job.id)"
                  [class.pause]="job.status === 'active'"
                  [class.resume]="job.status === 'paused'">
                  <span class="btn-icon">{{ job.status === 'active' ? '⏸️' : '▶️' }}</span>
                  {{ job.status === 'active' ? 'Pause' : 'Resume' }}
                </button>
                <button 
                  class="action-btn close-btn" 
                  (click)="closeJob(job.id)"
                  [disabled]="job.status === 'closed'">
                  <span class="btn-icon">❌</span>
                  Close Job
                </button>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div class="jobs-list" *ngIf="viewMode() === 'list'">
            <div 
              class="job-row" 
              *ngFor="let job of jobs()"
              [class.paused]="job.status === 'paused'"
              [class.closed]="job.status === 'closed'">
              <div class="row-main">
                <div class="job-basic-info">
                  <div class="job-title">{{ job.title }}</div>
                  <div class="job-meta-list">
                    <span class="meta-tag">{{ job.department }}</span>
                    <span class="meta-tag">{{ job.location }}</span>
                    <span class="meta-tag">{{ job.postedDate }}</span>
                  </div>
                </div>
                <div class="job-stats">
                  <div class="status-badge" [class]="'status-' + job.status">
                    {{ job.status | titlecase }}
                  </div>
                  <div class="applicants-badge">
                    <span class="badge-icon">👤</span>
                    {{ job.applicants }}
                  </div>
                </div>
              </div>
              <div class="row-actions">
                <button class="icon-btn" (click)="viewApplicants(job.id)" title="View Applicants">
                  <span class="btn-icon">👁️</span>
                </button>
                <button class="icon-btn" (click)="editJob(job.id)" title="Edit Job">
                  <span class="btn-icon">✏️</span>
                </button>
                <button 
                  class="icon-btn" 
                  (click)="toggleJobStatus(job.id)"
                  [title]="job.status === 'active' ? 'Pause Job' : 'Resume Job'">
                  <span class="btn-icon">{{ job.status === 'active' ? '⏸️' : '▶️' }}</span>
                </button>
                <button 
                  class="icon-btn close-icon" 
                  (click)="closeJob(job.id)"
                  [disabled]="job.status === 'closed'"
                  title="Close Job">
                  <span class="btn-icon">❌</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header Styles */
    .page-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(241, 90, 36, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
    }

    .header-text {
      flex: 1;
    }

    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f15a24 0%, #ff7a45 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 0.875rem;
    }

    /* Button Styles */
    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      position: relative;
      overflow: hidden;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
    
    .disabled-btn {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn:hover:not(:disabled)::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      background-size: 200% 200%;
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      background-position: 100% 100%;
    }

    .btn-primary:active:not(:disabled) {
      transform: scale(0.98) translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: #3b82f6;
      border: 2px solid #3b82f6;
      position: relative;
    }

    .btn-outline::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(241, 90, 36, 0.1);
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 8px;
    }

    .btn-outline:hover:not(:disabled) {
      background: rgba(241, 90, 36, 0.05);
      transform: translateY(-1px);
    }

    .btn-outline:hover:not(:disabled)::after {
      opacity: 1;
    }

    .btn-icon {
      font-size: 1.25rem;
      transition: transform 0.3s ease;
    }

    .btn:hover:not(:disabled) .btn-icon {
      transform: scale(1.1);
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Stats Overview */
    .stats-overview {
      margin-bottom: 2.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: linear-gradient(145deg, white, #f8fafc);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      border: 1px solid rgba(241, 90, 36, 0.08);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(241, 90, 36, 0.1);
      border-color: rgba(241, 90, 36, 0.2);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .active-icon {
      background: linear-gradient(135deg, rgba(241, 90, 36, 0.15), rgba(255, 122, 69, 0.15));
      color: #f15a24;
    }

    .applicants-icon {
      background: linear-gradient(135deg, rgba(241, 90, 36, 0.15), rgba(255, 122, 69, 0.15));
      color: #ff7a45;
    }

    .review-icon {
      background: linear-gradient(135deg, rgba(241, 90, 36, 0.15), rgba(255, 122, 69, 0.15));
      color: #d9480f;
    }

    .filled-icon {
      background: linear-gradient(135deg, rgba(241, 90, 36, 0.15), rgba(255, 122, 69, 0.15));
      color: #f59e0b;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: #f15a24;
      margin: 0 0 0.25rem 0;
      line-height: 1.1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Analytics Section */
    .analytics-section {
      margin-bottom: 2.5rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
    }

    .chart-card {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(241, 90, 36, 0.08);
      transition: all 0.3s ease;
    }

    .chart-card:hover {
      box-shadow: 0 8px 25px rgba(241, 90, 36, 0.1);
      border-color: rgba(241, 90, 36, 0.15);
    }

    .card-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid rgba(241, 90, 36, 0.05);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }

    .chart-container {
      padding: 1rem 1.5rem 1.5rem;
      height: 280px;
    }

    /* Jobs Section */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(241, 90, 36, 0.1);
    }

    .section-header h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .view-controls {
      display: flex;
      background: #f1f5f9;
      border-radius: 12px;
      padding: 4px;
    }

    .view-toggle {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #64748b;
    }

    .view-toggle.active {
      background: white;
      color: #3b82f6;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Job Cards - Grid View */
    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .job-card {
      background: white;
      border-radius: 16px;
      padding: 1.75rem;
      border: 1px solid rgba(241, 90, 36, 0.08);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      position: relative;
      overflow: hidden;
    }

    .job-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 35px rgba(241, 90, 36, 0.15);
      border-color: rgba(241, 90, 36, 0.2);
    }

    .job-card.paused {
      opacity: 0.7;
      background: #f8fafc;
    }

    .job-card.closed {
      opacity: 0.5;
      background: #f1f5f9;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .job-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      flex: 1;
      margin-right: 1rem;
    }

    .job-status {
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-active {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .status-paused {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .status-closed {
      background: rgba(156, 163, 175, 0.15);
      color: #9ca3af;
    }

    .status-draft {
      background: rgba(99, 102, 241, 0.15);
      color: #6366f1;
    }

    .job-details {
      margin-bottom: 1.5rem;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-size: 0.9rem;
    }

    .meta-icon {
      font-size: 1rem;
      opacity: 0.8;
    }

    .applicants-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(241, 90, 36, 0.08);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      width: fit-content;
    }

    .count-icon {
      font-size: 1.1rem;
    }

    .count-number {
      font-weight: 700;
      color: #f15a24;
      font-size: 1.1rem;
    }

    .count-label {
      color: #64748b;
      font-size: 0.85rem;
    }

    .job-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .action-btn {
      padding: 0.75rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .view-btn {
      background: linear-gradient(135deg, #f15a24, #ff7a45);
      color: white;
    }

    .view-btn:hover:not(:disabled) {
      box-shadow: 0 4px 15px rgba(241, 90, 36, 0.3);
      transform: translateY(-2px);
    }

    .edit-btn {
      background: rgba(241, 90, 36, 0.1);
      color: #f15a24;
      border: 1px solid rgba(241, 90, 36, 0.3);
    }

    .edit-btn:hover:not(:disabled) {
      background: rgba(241, 90, 36, 0.2);
    }

    .toggle-btn.pause {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .toggle-btn.resume {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .toggle-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .close-btn {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .close-btn:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
    }

    /* Job List View */
    .jobs-list {
      background: white;
      border-radius: 16px;
      border: 1px solid rgba(241, 90, 36, 0.08);
      overflow: hidden;
    }

    .job-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(241, 90, 36, 0.05);
      transition: all 0.2s ease;
    }

    .job-row:last-child {
      border-bottom: none;
    }

    .job-row:hover {
      background: rgba(241, 90, 36, 0.02);
    }

    .job-row.paused {
      opacity: 0.7;
      background: rgba(245, 158, 11, 0.03);
    }

    .job-row.closed {
      opacity: 0.5;
      background: rgba(156, 163, 175, 0.03);
    }

    .row-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      margin-right: 1rem;
    }

    .job-basic-info {
      flex: 1;
    }

    .job-meta-list {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .meta-tag {
      background: rgba(241, 90, 36, 0.1);
      color: #f15a24;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .job-stats {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .status-badge {
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .applicants-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(241, 90, 36, 0.08);
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-weight: 600;
      color: #f15a24;
    }

    .badge-icon {
      font-size: 1rem;
    }

    .row-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: rgba(241, 90, 36, 0.1);
      color: #f15a24;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .icon-btn:hover:not(:disabled) {
      background: rgba(241, 90, 36, 0.2);
      transform: scale(1.1);
    }

    .icon-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .close-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .close-icon:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.2);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .jobs-page {
        padding: 1rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .page-title {
        font-size: 1.75rem;
      }
      
      .jobs-grid {
        grid-template-columns: 1fr;
      }
      
      .job-actions {
        grid-template-columns: 1fr;
      }
      
      .row-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .job-stats {
        width: 100%;
        justify-content: space-between;
      }
    }

    @media (max-width: 480px) {
      .header-actions {
        width: 100%;
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
        justify-content: center;
      }
      
      .view-controls {
        width: 100%;
      }
      
      .view-toggle {
        flex: 1;
        text-align: center;
      }
    }

    /* Animation Preferences */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .job-card:hover,
      .stat-card:hover,
      .chart-card:hover {
        transform: none !important;
      }
    }
  `]
})
export class JobsComponent {
  // Expose UserRole enum to template
  protected readonly UserRole = UserRole;
  
  // Role-based properties
  currentUserRole: UserRole | null = null;
  
  constructor(public roleService: RoleService) {
    this.currentUserRole = this.roleService.getCurrentUserRole();
  }

  // Signals for reactive state management
  viewMode = signal<'grid' | 'list'>('grid');
  loadingJob = signal<number | null>(null);
  
  // Stats signals
  activeJobs = signal(24);
  totalApplicants = signal(342);
  inReview = signal(18);
  recentlyFilled = signal(6);

  jobs = signal<Job[]>([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      status: 'active',
      applicants: 42,
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      status: 'active',
      applicants: 28,
      postedDate: '1 week ago'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'New York, NY',
      status: 'paused',
      applicants: 15,
      postedDate: '3 weeks ago'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Austin, TX',
      status: 'active',
      applicants: 31,
      postedDate: '5 days ago'
    },
    {
      id: 5,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Chicago, IL',
      status: 'closed',
      applicants: 19,
      postedDate: '1 month ago'
    },
    {
      id: 6,
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Remote',
      status: 'active',
      applicants: 37,
      postedDate: '4 days ago'
    }
  ]);

  // Chart configurations
  statusChartData: ChartConfiguration['data'] = {
    labels: ['Active', 'Paused', 'Closed', 'Draft'],
    datasets: [{
      data: [24, 3, 2, 1],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(156, 163, 175, 0.8)',
        'rgba(99, 102, 241, 0.8)'
      ],
      borderColor: [
        '#10b981',
        '#f59e0b',
        '#9ca3af',
        '#6366f1'
      ],
      borderWidth: 3,
      hoverOffset: 15
    }]
  };

  statusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1e293b',
          font: {
            size: 12,
            weight: 'normal'
          },
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#f15a24',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  statusChartType: ChartType = 'doughnut';

  applicationsChartData: ChartConfiguration['data'] = {
    labels: ['Frontend Dev', 'Product Manager', 'UX Designer', 'DevOps', 'Marketing', 'Data Science'],
    datasets: [{
      data: [42, 28, 15, 31, 19, 37],
      backgroundColor: 'rgba(241, 90, 36, 0.7)',
      borderColor: '#f15a24',
      borderWidth: 2,
      borderRadius: 6
    }]
  };

  applicationsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#f15a24',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(241, 90, 36, 0.1)',
          drawOnChartArea: true,
          drawTicks: true
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          }
        }
      }
    }
  };

  applicationsChartType: ChartType = 'bar';

  // Action methods
  addNewJob() {
    console.log('➕ Opening new job creation form...');
    alert('Add New Job functionality would open a modal in a real application');
  }

  viewApplicants(jobId: number) {
    this.loadingJob.set(jobId);
    console.log(`👁️ Viewing applicants for job ${jobId}...`);
    
    setTimeout(() => {
      this.loadingJob.set(null);
      console.log(`✅ Loaded applicants for job ${jobId}`);
      alert(`Viewing applicants for job ${jobId} - would navigate to applicants page`);
    }, 1500);
  }

  editJob(jobId: number) {
    console.log(`✏️ Editing job ${jobId}...`);
    alert(`Edit Job ${jobId} functionality would open edit modal`);
  }

  toggleJobStatus(jobId: number) {
    const jobs = this.jobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex !== -1) {
      const currentStatus = jobs[jobIndex].status;
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      jobs[jobIndex] = { ...jobs[jobIndex], status: newStatus };
      this.jobs.set([...jobs]);
      
      console.log(`🔄 Job ${jobId} status changed from ${currentStatus} to ${newStatus}`);
    }
  }

  closeJob(jobId: number) {
    const jobs = this.jobs();
    const jobIndex = jobs.findIndex(job => job.id === jobId);
    
    if (jobIndex !== -1 && jobs[jobIndex].status !== 'closed') {
      if (confirm(`Are you sure you want to close "${jobs[jobIndex].title}"?`)) {
        jobs[jobIndex] = { ...jobs[jobIndex], status: 'closed' };
        this.jobs.set([...jobs]);
        console.log(`❌ Job ${jobId} closed successfully`);
      }
    }
  }
}