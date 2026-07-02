import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feedback-container">
      <div class="header">
        <h1>Interview Feedback</h1>
        <p>Review and manage candidate interview feedback</p>
      </div>
      
      <div class="feedback-grid">
        <div class="feedback-card">
          <h3>Pending Feedback</h3>
          <div class="stat-value">3</div>
          <div class="stat-label">Interviews requiring feedback</div>
        </div>
        
        <div class="feedback-card">
          <h3>Completed This Week</h3>
          <div class="stat-value">12</div>
          <div class="stat-label">Feedback submissions</div>
        </div>
        
        <div class="feedback-card">
          <h3>Avg. Rating</h3>
          <div class="stat-value">4.2</div>
          <div class="stat-label">Out of 5 stars</div>
        </div>
        
        <div class="feedback-card">
          <h3>Response Time</h3>
          <div class="stat-value">1.2d</div>
          <div class="stat-label">Average completion time</div>
        </div>
      </div>
      
      <div class="feedback-list">
        <h2>Pending Feedback</h2>
        <div class="feedback-items">
          <div class="feedback-item" *ngFor="let feedback of pendingFeedback">
            <div class="feedback-header">
              <div class="candidate-info">
                <div class="candidate-avatar">{{ feedback.candidate.name.charAt(0) }}</div>
                <div>
                  <div class="candidate-name">{{ feedback.candidate.name }}</div>
                  <div class="position">{{ feedback.position }}</div>
                </div>
              </div>
              <div class="interview-date">{{ feedback.interviewDate }}</div>
            </div>
            
            <div class="feedback-content">
              <div class="rating-section">
                <label>Overall Rating:</label>
                <div class="stars">
                  <span 
                    *ngFor="let star of [1,2,3,4,5]" 
                    class="star" 
                    [class.filled]="star <= feedback.rating"
                    (click)="setRating(feedback, star)">
                    ⭐
                  </span>
                </div>
              </div>
              
              <div class="feedback-form">
                <div class="form-group">
                  <label>Technical Skills:</label>
                  <textarea 
                    [(ngModel)]="feedback.technicalFeedback" 
                    placeholder="Assess technical competencies..."
                    rows="3"></textarea>
                </div>
                
                <div class="form-group">
                  <label>Communication:</label>
                  <textarea 
                    [(ngModel)]="feedback.communicationFeedback" 
                    placeholder="Evaluate communication skills..."
                    rows="3"></textarea>
                </div>
                
                <div class="form-group">
                  <label>Overall Impression:</label>
                  <textarea 
                    [(ngModel)]="feedback.overallFeedback" 
                    placeholder="Your overall assessment..."
                    rows="4"></textarea>
                </div>
                
                <div class="form-group">
                  <label>Recommendation:</label>
                  <select [(ngModel)]="feedback.recommendation">
                    <option value="">Select recommendation</option>
                    <option value="strong_hire">Strong Hire</option>
                    <option value="hire">Hire</option>
                    <option value="no_hire">No Hire</option>
                    <option value="strong_no_hire">Strong No Hire</option>
                  </select>
                </div>
              </div>
              
              <div class="feedback-actions">
                <button class="btn btn-primary" (click)="submitFeedback(feedback)">
                  Submit Feedback
                </button>
                <button class="btn btn-outline" (click)="saveDraft(feedback)">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
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
    
    .feedback-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .feedback-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      text-align: center;
    }
    
    .feedback-card h3 {
      margin: 0 0 1rem 0;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.85rem;
      color: #64748b;
    }
    
    .feedback-list h2 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .feedback-item {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      margin-bottom: 1.5rem;
    }
    
    .feedback-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .candidate-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .candidate-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #f59e0b;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .candidate-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1.1rem;
    }
    
    .position {
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .interview-date {
      color: #64748b;
      font-weight: 500;
    }
    
    .rating-section {
      margin-bottom: 1.5rem;
    }
    
    .rating-section label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }
    
    .stars {
      display: flex;
      gap: 0.25rem;
    }
    
    .star {
      font-size: 1.5rem;
      cursor: pointer;
      color: #d1d5db;
      transition: color 0.2s ease;
    }
    
    .star.filled {
      color: #f59e0b;
    }
    
    .star:hover {
      color: #f59e0b;
    }
    
    .feedback-form {
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }
    
    textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.9rem;
      transition: border-color 0.2s ease;
    }
    
    textarea:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .feedback-actions {
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
    }
    
    .btn-primary {
      background: #f59e0b;
      color: white;
    }
    
    .btn-primary:hover {
      background: #d97706;
      transform: translateY(-2px);
    }
    
    .btn-outline {
      background: white;
      color: #f59e0b;
      border: 2px solid #f59e0b;
    }
    
    .btn-outline:hover {
      background: #f59e0b;
      color: white;
    }
  `]
})
export class FeedbackComponent {
  currentUser: any = null;
  pendingFeedback = [
    {
      id: 1,
      candidate: { name: 'Sarah Johnson' },
      position: 'Senior Frontend Developer',
      interviewDate: 'Jan 25, 2024',
      rating: 0,
      technicalFeedback: '',
      communicationFeedback: '',
      overallFeedback: '',
      recommendation: ''
    },
    {
      id: 2,
      candidate: { name: 'Michael Chen' },
      position: 'Product Manager',
      interviewDate: 'Jan 24, 2024',
      rating: 0,
      technicalFeedback: '',
      communicationFeedback: '',
      overallFeedback: '',
      recommendation: ''
    },
    {
      id: 3,
      candidate: { name: 'Emma Rodriguez' },
      position: 'UX Designer',
      interviewDate: 'Jan 23, 2024',
      rating: 0,
      technicalFeedback: '',
      communicationFeedback: '',
      overallFeedback: '',
      recommendation: ''
    }
  ];

  constructor(private authService: AuthService, public toastService: ToastService) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== UserRole.INTERVIEWER) {
      console.warn('Unauthorized access to feedback');
    }
  }

  setRating(feedback: any, rating: number) {
    feedback.rating = rating;
  }

  submitFeedback(feedback: any) {
    if (feedback.rating === 0) {
      this.toastService.error('Please provide a rating');
      return;
    }
    
    if (!feedback.recommendation) {
      this.toastService.error('Please select a recommendation');
      return;
    }
    
    this.toastService.success(`Feedback submitted for ${feedback.candidate.name}`);
    // In real app, this would save to backend
  }

  saveDraft(feedback: any) {
    this.toastService.info(`Draft saved for ${feedback.candidate.name}`);
    // In real app, this would save draft to backend
  }
}