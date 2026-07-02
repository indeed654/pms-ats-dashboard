import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar">{{ getUserInitials() }}</div>
          </div>
          <h1 class="profile-title">Profile Information</h1>
        </div>
        
        <div class="profile-details">
          <div class="detail-group">
            <label class="detail-label">Full Name</label>
            <div class="detail-value">{{ user().firstName }} {{ user().lastName }}</div>
          </div>
          
          <div class="detail-group">
            <label class="detail-label">Email</label>
            <div class="detail-value">{{ user().email }}</div>
          </div>
          
          <div class="detail-group">
            <label class="detail-label">Role</label>
            <div class="detail-value">{{ user().role }}</div>
          </div>
          
          <div class="detail-group">
            <label class="detail-label">Member Since</label>
            <div class="detail-value">January 2024</div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="btn btn-primary" (click)="editProfile()">
            <span>Edit Profile</span>
          </button>
          <button class="btn btn-outline" (click)="changePassword()">
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .profile-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(30, 41, 59, 0.1);
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .avatar-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f15a24 0%, #ff7a45 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .profile-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .detail-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .detail-label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .detail-value {
      font-size: 1.1rem;
      color: #1e293b;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .profile-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #f15a24 0%, #ff7a45 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(241, 90, 36, 0.3);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(241, 90, 36, 0.4);
    }
    
    .btn-outline {
      background: transparent;
      color: #f15a24;
      border: 2px solid #f15a24;
    }
    
    .btn-outline:hover {
      background: rgba(241, 90, 36, 0.1);
      transform: translateY(-1px);
    }
  `]
})
export class ProfileComponent {
  user = signal({
    firstName: 'Loading...',
    lastName: '',
    email: '',
    role: ''
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    public toastService: ToastService
  ) {
    // Load user data from auth service immediately
    this.loadUserData();
    
    // Set up effect to listen for auth state changes
    effect(() => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.user.set({
          firstName: currentUser.firstName || 'User',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          role: currentUser.role || 'user'
        });
      }
    });
  }

  private loadUserData() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.user.set({
          firstName: currentUser.firstName || 'User',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          role: currentUser.role || 'user'
        });
      } else {
        // Check if token exists but user is null - handle edge case
        const token = this.authService.getToken();
        if (token) {
          // Token exists but user not loaded, maybe need to refresh
          console.warn('Token exists but user data not available');
          this.user.set({
            firstName: 'User',
            lastName: '',
            email: '',
            role: 'user'
          });
        } else {
          this.user.set({
            firstName: 'User',
            lastName: '',
            email: '',
            role: 'user'
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.user.set({
        firstName: 'User',
        lastName: '',
        email: '',
        role: 'user'
      });
    }
  }

  getUserInitials(): string {
    const u = this.user();
    const firstInitial = u.firstName.charAt(0).toUpperCase();
    const lastInitial = u.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  editProfile(): void {
    this.toastService.info('Opening profile edit modal...');
    // In a real app, this would open an edit modal or navigate to edit page
  }

  changePassword(): void {
    this.toastService.info('Opening password change modal...');
    // In a real app, this would open password change modal
  }
}