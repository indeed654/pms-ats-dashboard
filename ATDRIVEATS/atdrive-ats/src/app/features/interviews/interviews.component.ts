import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="interviews-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Interviews</h1>
            <p class="page-subtitle">Manage and track all scheduled interviews</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="scheduleInterview()">
              <span class="btn-icon">+</span>
              Schedule Interview
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">📅</div>
          <div class="stat-content">
            <h3 class="stat-title">Upcoming Interviews</h3>
            <p class="stat-value">18</p>
            <p class="stat-description">Scheduled for this week</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">✅</div>
          <div class="stat-content">
            <h3 class="stat-title">Completed</h3>
            <p class="stat-value">124</p>
            <p class="stat-description">Total interviews</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">⏰</div>
          <div class="stat-content">
            <h3 class="stat-title">This Week</h3>
            <p class="stat-value">24</p>
            <p class="stat-description">Scheduled interviews</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">📈</div>
          <div class="stat-content">
            <h3 class="stat-title">Attendance Rate</h3>
            <p class="stat-value">86%</p>
            <p class="stat-description">Successful interviews</p>
          </div>
        </div>
      </div>

      <!-- Data Visualization -->
      <div class="analytics-section">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Interviews by Status</h3>
          </div>
          <div class="chart-content">
            <div class="pie-chart-placeholder">
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color" style="background-color: #3b82f6"></span>
                  <span>Scheduled (40%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background-color: #10b981"></span>
                  <span>Completed (35%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background-color: #f59e0b"></span>
                  <span>Rescheduled (15%)</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background-color: #ef4444"></span>
                  <span>Cancelled (10%)</span>
                </div>
              </div>
              <div class="chart-visualization">
                <div class="pie-chart">
                  <div class="pie-segment" style="--percentage: 40; --color: #3b82f6"></div>
                  <div class="pie-segment" style="--percentage: 35; --color: #10b981"></div>
                  <div class="pie-segment" style="--percentage: 15; --color: #f59e0b"></div>
                  <div class="pie-segment" style="--percentage: 10; --color: #ef4444"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interviews Table -->
      <div class="interviews-section">
        <div class="section-header">
          <h2>Upcoming Interviews</h2>
          <div class="section-controls">
            <select class="filter-select">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>All Upcoming</option>
            </select>
          </div>
        </div>
        
        <div class="interviews-table">
          <div class="table-header">
            <div class="table-cell">Candidate</div>
            <div class="table-cell">Job Role</div>
            <div class="table-cell">Interview Type</div>
            <div class="table-cell">Interviewer</div>
            <div class="table-cell">Date & Time</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Actions</div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">JS</div>
                <div class="candidate-details">
                  <h4>John Smith</h4>
                  <p>Senior Developer</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Frontend Lead</div>
            <div class="table-cell">Technical</div>
            <div class="table-cell">Emily Davis</div>
            <div class="table-cell">Today, 2:00 PM</div>
            <div class="table-cell">
              <span class="status-badge scheduled">Scheduled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">MJ</div>
                <div class="candidate-details">
                  <h4>Maria Johnson</h4>
                  <p>Product Designer</p>
                </div>
              </div>
            </div>
            <div class="table-cell">UX Designer</div>
            <div class="table-cell">HR Round</div>
            <div class="table-cell">Robert Chen</div>
            <div class="table-cell">Tomorrow, 10:30 AM</div>
            <div class="table-cell">
              <span class="status-badge scheduled">Scheduled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">DP</div>
                <div class="candidate-details">
                  <h4>David Park</h4>
                  <p>Fullstack Engineer</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Backend Engineer</div>
            <div class="table-cell">Managerial</div>
            <div class="table-cell">Lisa Wang</div>
            <div class="table-cell">Wed, 4:15 PM</div>
            <div class="table-cell">
              <span class="status-badge completed">Completed</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">SR</div>
                <div class="candidate-details">
                  <h4>Sophia Rodriguez</h4>
                  <p>Marketing Specialist</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Digital Marketing</div>
            <div class="table-cell">Final Round</div>
            <div class="table-cell">Michael Brown</div>
            <div class="table-cell">Thu, 11:00 AM</div>
            <div class="table-cell">
              <span class="status-badge scheduled">Scheduled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">DJ</div>
                <div class="candidate-details">
                  <h4>David Johnson</h4>
                  <p>Data Scientist</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Machine Learning Engineer</div>
            <div class="table-cell">Technical</div>
            <div class="table-cell">Jennifer Lee</div>
            <div class="table-cell">Fri, 9:30 AM</div>
            <div class="table-cell">
              <span class="status-badge scheduled">Scheduled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">CW</div>
                <div class="candidate-details">
                  <h4>Chloe Wilson</h4>
                  <p>HR Manager</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Human Resources Lead</div>
            <div class="table-cell">HR Round</div>
            <div class="table-cell">Robert Davis</div>
            <div class="table-cell">Today, 3:45 PM</div>
            <div class="table-cell">
              <span class="status-badge scheduled">Scheduled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">TP</div>
                <div class="candidate-details">
                  <h4>Thomas Parker</h4>
                  <p>Sales Director</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Sales Manager</div>
            <div class="table-cell">Panel</div>
            <div class="table-cell">Team Panel</div>
            <div class="table-cell">Mon, 1:00 PM</div>
            <div class="table-cell">
              <span class="status-badge completed">Completed</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">
              <div class="candidate-info">
                <div class="avatar">AO</div>
                <div class="candidate-details">
                  <h4>Amy Oliver</h4>
                  <p>Finance Analyst</p>
                </div>
              </div>
            </div>
            <div class="table-cell">Financial Analyst</div>
            <div class="table-cell">Technical</div>
            <div class="table-cell">Kevin Miller</div>
            <div class="table-cell">Tue, 10:15 AM</div>
            <div class="table-cell">
              <span class="status-badge cancelled">Cancelled</span>
            </div>
            <div class="table-cell">
              <button class="action-btn view">View</button>
              <button class="action-btn edit">Edit</button>
            </div>
          </div>
        </div>
        
        <div class="pagination">
          <button class="pagination-btn">Previous</button>
          <span class="pagination-info">Page 1 of 8</span>
          <button class="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .interviews-page {
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

    .btn-primary:active:not(:disabled) {
      transform: scale(0.97);
      box-shadow: 0 4px 8px rgba(241, 90, 36, 0.3);
    }

    .btn-outline {
      background: transparent;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }

    .btn-outline:hover:not(:disabled) {
      background: rgba(241, 90, 36, 0.1);
    }

    .content-grid {
      display: grid;
      gap: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #f15a24;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
    }
    
    .interview-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .interview-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      transition: all 0.2s ease;
    }

    .interview-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border-color: #cbd5e1;
    }

    .interview-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .interview-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f15a24, #ff7a45);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .interview-details h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .interview-details p {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .interview-time {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.75rem;
    }

    .interview-status {
      margin-top: 0.25rem;
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-scheduled {
      background: rgba(241, 90, 36, 0.1);
      color: #f15a24;
    }

    .status-completed {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .status-rescheduled {
      background: rgba(107, 114, 128, 0.1);
      color: #6b7280;
    }

    .interview-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      font-size: 1rem;
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
    
    .analytics-section {
      margin-bottom: 2rem;
    }
    
    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .chart-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }
    
    .pie-chart-placeholder {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-block;
    }
    
    .chart-visualization {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .pie-chart {
      width: 180px;
      height: 180px;
      position: relative;
    }
    
    .pie-segment {
      position: absolute;
      border-radius: 50%;
      clip-path: inset(0 0 0 0 round 50%);
    }
    
    .interviews-section {
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
    
    .interviews-table {
      margin-bottom: 1.5rem;
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 0.8fr 1.2fr;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 600;
      color: #334155;
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 0.8fr 1.2fr;
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
    
    .status-badge.scheduled {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .status-badge.completed {
      background: #e0e7ff;
      color: #4f46e5;
    }
    
    .status-badge.rescheduled {
      background: #ede9fe;
      color: #8b5cf6;
    }
    
    .status-badge.cancelled {
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
    
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }
    
    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .pagination-btn:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
    
    .pagination-info {
      color: #64748b;
      font-size: 0.875rem;
    }
  `]
})
export class InterviewsComponent {
  interviews = [
    { id: 1, candidateName: 'Alex Johnson', position: 'Senior Frontend Developer', initials: 'AJ', time: '10:00 AM', date: 'Today', status: 'Scheduled' },
    { id: 2, candidateName: 'Maria Garcia', position: 'UX Designer', initials: 'MG', time: '1:30 PM', date: 'Today', status: 'Scheduled' },
    { id: 3, candidateName: 'David Chen', position: 'Backend Engineer', initials: 'DC', time: '2:45 PM', date: 'Tomorrow', status: 'Scheduled' },
    { id: 4, candidateName: 'Sarah Williams', position: 'Product Manager', initials: 'SW', time: '11:15 AM', date: 'Wed', status: 'Completed' },
    { id: 5, candidateName: 'James Wilson', position: 'DevOps Specialist', initials: 'JW', time: '4:00 PM', date: 'Thu', status: 'Rescheduled' }
  ];
  

  
  viewDetails(id: number) {
    console.log(`Viewing details for interview ${id}`);
    // In a real app, this would navigate to the interview details page
  }
  
  scheduleInterview() {
    console.log('➕ Scheduling new interview...');
    alert('Schedule Interview functionality would open a modal in a real application');
  }
  
  reschedule(id: number) {
    console.log(`Rescheduling interview ${id}`);
    // Update the interview status in the list
    const interviewIndex = this.interviews.findIndex(i => i.id === id);
    if (interviewIndex !== -1) {
      this.interviews[interviewIndex].status = 'Rescheduled';
      console.log(`Interview ${id} status updated to Rescheduled`);
    }
  }
  
  cancel(id: number) {
    console.log(`Cancelling interview ${id}`);
    // Remove the interview from the list
    this.interviews = this.interviews.filter(i => i.id !== id);
    console.log(`Interview ${id} cancelled and removed from list`);
  }
  

  
  viewInterview(id: number) {
    console.log(`👁️ Viewing interview ${id}...`);
    alert(`Viewing details for interview ${id} - would navigate to interview details`);
  }
  
  editInterview(id: number) {
    console.log(`✏️ Editing interview ${id}...`);
    alert(`Edit Interview ${id} functionality would open edit modal`);
  }
  
  cancelInterview(id: number) {
    console.log(`❌ Cancelling interview ${id}...`);
    if (confirm(`Are you sure you want to cancel interview ${id}?`)) {
      console.log(`Interview ${id} cancelled successfully`);
    }
  }
}