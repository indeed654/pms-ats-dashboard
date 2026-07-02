import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="activity-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Activity Timeline</h1>
            <p class="page-subtitle">Recent events and updates in the system</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline">
              <span class="btn-icon">🔄</span>
              Refresh
            </button>
            <button class="btn btn-outline">
              <span class="btn-icon">📧</span>
              Export Log
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">🕒</div>
          <div class="stat-content">
            <h3 class="stat-title">Today's Events</h3>
            <p class="stat-value">24</p>
            <p class="stat-description">Activities recorded</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">👤</div>
          <div class="stat-content">
            <h3 class="stat-title">Candidate Actions</h3>
            <p class="stat-value">18</p>
            <p class="stat-description">Applications & updates</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">💼</div>
          <div class="stat-content">
            <h3 class="stat-title">Job Updates</h3>
            <p class="stat-value">6</p>
            <p class="stat-description">New postings & changes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">📅</div>
          <div class="stat-content">
            <h3 class="stat-title">Interviews</h3>
            <p class="stat-value">4</p>
            <p class="stat-description">Scheduled & completed</p>
          </div>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="activity-section">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <div class="section-controls">
            <select class="filter-select">
              <option>All Activities</option>
              <option>Candidate Actions</option>
              <option>Interviews</option>
              <option>Job Updates</option>
              <option>System Events</option>
            </select>
            <select class="filter-select">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
        
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">👤</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>John Smith applied for Senior Developer position</h4>
                <p>Submitted resume and cover letter</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">2 hours ago</span>
                <span class="activity-type candidate">Candidate Action</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">📅</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Interview scheduled with Sarah Johnson</h4>
                <p>Technical round with Engineering team</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">4 hours ago</span>
                <span class="activity-type interview">Interview</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">✅</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Mike Chen moved to Offer stage</h4>
                <p>Passed all interview rounds successfully</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">1 day ago</span>
                <span class="activity-type status">Status Update</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">📝</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>New job posting created: UX Designer</h4>
                <p>Posted by Emily Davis in Design department</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">2 days ago</span>
                <span class="activity-type job">Job Update</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">📤</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Offer sent to Alex Thompson</h4>
                <p>For the Product Manager position</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">2 days ago</span>
                <span class="activity-type offer">Offer</span>
              </div>
            </div>
          </div>
                  
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">✅</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Background check completed for James Wilson</h4>
                <p>Successfully cleared for Senior Developer role</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">3 days ago</span>
                <span class="activity-type status">Status Update</span>
              </div>
            </div>
          </div>
                  
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">🔄</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Interview rescheduled for Maria Garcia</h4>
                <p>New slot booked for next Monday at 10:00 AM</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">3 days ago</span>
                <span class="activity-type interview">Interview</span>
              </div>
            </div>
          </div>
                  
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">📋</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Reference check initiated for David Chen</h4>
                <p>Contacted previous employer for verification</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">4 days ago</span>
                <span class="activity-type status">Status Update</span>
              </div>
            </div>
          </div>
                  
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-icon">💰</div>
            </div>
            <div class="timeline-content">
              <div class="activity-info">
                <h4>Salary negotiation completed with Olivia Parker</h4>
                <p>Agreed on compensation package for UX Designer role</p>
              </div>
              <div class="activity-meta">
                <span class="activity-time">5 days ago</span>
                <span class="activity-type job">Job Update</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-page {
      padding: 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .page-header h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
      color: #1e293b;
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
    }

    .btn-outline {
      background: transparent;
      color: #64748b;
      border: 1px solid #cbd5e1;
    }

    .btn-outline:hover {
      background: #f8fafc;
      color: #475569;
    }

    .content-grid {
      display: grid;
      gap: 1.5rem;
    }

    .section-placeholder {
      padding: 1rem;
    }

    .section-placeholder h3 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
      color: #1e293b;
      text-align: center;
    }

    .section-placeholder p {
      margin: 0 0 2rem 0;
      color: #64748b;
      font-size: 1rem;
      text-align: center;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #f8fafc;
    }

    .activity-icon {
      font-size: 1.25rem;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #e0e7ff;
      color: #3730a3;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 0.25rem 0;
      color: #1e293b;
      font-size: 0.95rem;
    }

    .activity-time {
      margin: 0;
      color: #94a3b8;
      font-size: 0.85rem;
    }
    
    /* Enhanced UI Elements */
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
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
    .stat-icon.success { background: #dcfce7; color: #22c55e; }
    .stat-icon.warning { background: #fef3c7; color: #f59e0b; }
    .stat-icon.info { background: #dbeafe; color: #3b82f6; }
    
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
    
    .activity-section {
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
    
    .section-controls {
      display: flex;
      gap: 1rem;
    }
    
    .filter-select {
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .timeline {
      position: relative;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 18px;
      width: 2px;
      background: #e2e8f0;
    }
    
    .timeline-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      position: relative;
      padding-left: 2.5rem;
    }
    
    .timeline-marker {
      position: absolute;
      left: 0;
      top: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: white;
      border: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    
    .marker-icon {
      font-size: 1rem;
      color: #64748b;
    }
    
    .timeline-content {
      flex: 1;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
    }
    
    .activity-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .activity-info p {
      margin: 0;
      font-size: 0.85rem;
      color: #64748b;
    }
    
    .activity-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #f1f5f9;
    }
    
    .activity-time {
      font-size: 0.8rem;
      color: #94a3b8;
    }
    
    .activity-type {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
    }
    
    .activity-type.candidate {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .activity-type.interview {
      background: #fef3c7;
      color: #d97706;
    }
    
    .activity-type.status {
      background: #dcfce7;
      color: #16a34a;
    }
    
    .activity-type.job {
      background: #ddd6fe;
      color: #7c3aed;
    }
    
    .activity-type.offer {
      background: #fbcfe8;
      color: #be185d;
    }
  `]
})
export class ActivityComponent {}