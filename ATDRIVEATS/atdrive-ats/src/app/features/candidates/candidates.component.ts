import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { CandidatesStore } from '../../core/services/candidates.store';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="candidates-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Candidates</h1>
            <p class="page-subtitle">Manage and track all job candidates</p>
          </div>
          <div class="header-actions">
            <button 
              class="btn btn-primary"
              (click)="addCandidate()"
              [disabled]="loadingService.isLoading('add-candidate')">
              <span class="btn-icon" *ngIf="!loadingService.isLoading('add-candidate')">+</span>
              <span class="btn-icon spinning" *ngIf="loadingService.isLoading('add-candidate')">🔄</span>
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">👥</div>
          <div class="stat-content">
            <h3 class="stat-title">Total Candidates</h3>
            <p class="stat-value">{{ candidatesList().length }}</p>
            <p class="stat-description">Active profiles</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">✅</div>
          <div class="stat-content">
            <h3 class="stat-title">Shortlisted</h3>
            <p class="stat-value">{{ candidatesStore.shortlistedCount() }}</p>
            <p class="stat-description">Ready for interview</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">📅</div>
          <div class="stat-content">
            <h3 class="stat-title">In Interview</h3>
            <p class="stat-value">{{ candidatesStore.interviewCount() }}</p>
            <p class="stat-description">Currently interviewing</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">🎉</div>
          <div class="stat-content">
            <h3 class="stat-title">Hired</h3>
            <p class="stat-value">{{ candidatesStore.hiredCount() }}</p>
            <p class="stat-description">Recently hired</p>
          </div>
        </div>
      </div>

      <!-- Candidates Table -->
      <div class="candidates-section">
        <div class="section-header">
          <h2>All Candidates</h2>
        </div>
        
        <div class="candidates-table">
          <div class="table-header">
            <div class="table-cell">Candidate</div>
            <div class="table-cell">Position</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Experience</div>
            <div class="table-cell">Actions</div>
          </div>
          
          @for (candidate of candidatesList(); track candidate.id) {
            <div class="table-row">
              <div class="table-cell">
                <div class="candidate-info">
                  <div class="avatar">{{ getInitials(candidate.name) }}</div>
                  <div class="candidate-details">
                    <h4>{{ candidate.name }}</h4>
                    <p>{{ candidate.email }}</p>
                  </div>
                </div>
              </div>
              <div class="table-cell">{{ candidate.position }}</div>
              <div class="table-cell">
                <span class="status-badge" [class]="'status-' + candidate.status">
                  {{ candidate.status | titlecase }}
                </span>
              </div>
              <div class="table-cell">{{ candidate.experience }} years</div>
              <div class="table-cell">
                <button class="action-btn view" (click)="viewCandidate(candidate.id)">View</button>
                <button 
                  class="action-btn edit" 
                  (click)="moveStage(candidate.id, getNextStage(candidate.status))">
                  {{ getStageActionText(candidate.status) }}
                </button>
                <button 
                  class="action-btn reject" 
                  (click)="rejectCandidate(candidate.id)">
                  Reject
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .candidates-page {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .page-title {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
    }

    .page-subtitle {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1rem;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .stat-icon.primary { background: #dbeafe; color: #3b82f6; }
    .stat-icon.success { background: #e0e7ff; color: #4f46e5; }
    .stat-icon.warning { background: #ede9fe; color: #8b5cf6; }
    .stat-icon.info { background: #c7d2fe; color: #6366f1; }

    .stat-content {
      flex: 1;
    }

    .stat-title {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
    }

    .stat-value {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .stat-description {
      margin: 0;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .candidates-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .section-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .candidates-table {
      margin-bottom: 1.5rem;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1fr 1.5fr;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
      color: #334155;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1fr 1fr 1.5fr;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f8fafc;
    }

    .table-cell {
      display: flex;
      align-items: center;
    }

    .candidate-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .candidate-details h4 {
      margin: 0 0 0.125rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    .candidate-details p {
      margin: 0;
      font-size: 0.8rem;
      color: #64748b;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.applied {
      background: #dbeafe;
      color: #2563eb;
    }

    .status-badge.shortlisted {
      background: #e0e7ff;
      color: #4f46e5;
    }

    .status-badge.interview {
      background: #ede9fe;
      color: #8b5cf6;
    }

    .status-badge.hired {
      background: #ddd6fe;
      color: #7c3aed;
    }

    .status-badge.rejected {
      background: #c7d2fe;
      color: #6366f1;
    }

    .action-btn {
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      margin-right: 0.5rem;
    }

    .action-btn:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .action-btn.view {
      color: #3b82f6;
      border-color: #3b82f6;
    }

    .action-btn.view:hover {
      background: #eff6ff;
    }

    .action-btn.edit {
      color: #f59e0b;
      border-color: #f59e0b;
    }

    .action-btn.edit:hover {
      background: #fffbeb;
    }

    .action-btn.reject {
      color: #ef4444;
      border-color: #ef4444;
    }

    .action-btn.reject:hover {
      background: #fef2f2;
    }
  `]
})
export class CandidatesComponent {
  constructor(
    public candidatesStore: CandidatesStore,
    public loadingService: LoadingService
  ) {}

  get candidatesList() {
    return this.candidatesStore.candidatesList;
  }

  addCandidate() {
    this.loadingService.startLoading('add-candidate');
    // Simulate adding a new candidate
    setTimeout(() => {
      this.candidatesStore.addCandidate({
        name: `New Candidate ${Math.floor(Math.random() * 100)}`,
        email: `new${Math.floor(Math.random() * 1000)}@example.com`,
        phone: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
        position: ['Frontend Developer', 'Backend Engineer', 'UX Designer', 'Product Manager'][Math.floor(Math.random() * 4)],
        status: 'applied',
        experience: Math.floor(Math.random() * 10) + 1,
        skills: ['JavaScript', 'TypeScript', 'Angular', 'React'].slice(0, Math.floor(Math.random() * 4) + 1),
        appliedDate: new Date(),
        source: 'linkedin'
      });
      this.loadingService.stopLoading('add-candidate');
    }, 800);
  }

  viewCandidate(id: number) {
    console.log(`Viewing candidate ${id}`);
    // In a real app, this would navigate to the candidate profile page
    this.candidatesStore.toastService.info(`Viewing details for candidate ${id}`);
  }

  moveStage(id: number, newStatus: string) {
    console.log(`Moving candidate ${id} to ${newStatus} stage`);
    this.candidatesStore.moveCandidateStage(id, newStatus as any);
  }

  rejectCandidate(id: number) {
    if (confirm('Are you sure you want to reject this candidate?')) {
      this.candidatesStore.deleteCandidate(id);
    }
  }

  getNextStage(currentStatus: string): string {
    const stages: Record<string, string> = {
      'applied': 'shortlisted',
      'shortlisted': 'interview',
      'interview': 'hired',
      'hired': 'hired',
      'rejected': 'rejected'
    };
    return stages[currentStatus] || 'shortlisted';
  }

  getStageActionText(currentStatus: string): string {
    const actions: Record<string, string> = {
      'applied': 'Shortlist',
      'shortlisted': 'Interview',
      'interview': 'Hire',
      'hired': 'Hired',
      'rejected': 'Rejected'
    };
    return actions[currentStatus] || 'Advance';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}