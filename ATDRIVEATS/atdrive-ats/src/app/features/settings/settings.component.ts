import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-header">
      <h1>Settings</h1>
      <p>Manage your account, preferences, and integrations</p>
    </section>

    <section class="page-body">

      <!-- Account Settings -->
      <div class="settings-card">
        <h3>Account Information</h3>

        <div class="form-group">
          <label>Full Name</label>
          <input type="text" [(ngModel)]="account.name" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="account.email" />
        </div>

        <button
          class="btn btn-primary"
          (click)="saveAccount()"
          [disabled]="saving()">
          {{ saving() ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <!-- Security -->
      <div class="settings-card">
        <h3>Security</h3>

        <div class="form-group">
          <label>New Password</label>
          <input type="password" [(ngModel)]="security.password" />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" [(ngModel)]="security.confirmPassword" />
        </div>

        <button
          class="btn btn-outline"
          (click)="changePassword()"
          [disabled]="saving()">
          Change Password
        </button>
      </div>

      <!-- Integrations -->
      <div class="settings-card">
        <h3>Integrations</h3>

        <div class="integration">
          <span>Slack</span>
          <button class="btn btn-sm"
            [class.connected]="integrations.slack"
            (click)="toggleIntegration('slack')">
            {{ integrations.slack ? 'Connected' : 'Connect' }}
          </button>
        </div>

        <div class="integration">
          <span>Email Notifications</span>
          <button class="btn btn-sm"
            [class.connected]="integrations.email"
            (click)="toggleIntegration('email')">
            {{ integrations.email ? 'Enabled' : 'Enable' }}
          </button>
        </div>

        <div class="integration">
          <span>Calendar</span>
          <button class="btn btn-sm"
            [class.connected]="integrations.calendar"
            (click)="toggleIntegration('calendar')">
            {{ integrations.calendar ? 'Connected' : 'Connect' }}
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="settings-card danger-zone">
        <h3>Danger Zone</h3>
        
        <div class="danger-option">
          <div class="danger-info">
            <h4>Logout All Sessions</h4>
            <p>Log out all devices signed in to your account</p>
          </div>
          <button class="btn btn-danger" (click)="logoutAllSessions()">
            Logout All Sessions
          </button>
        </div>
        
        <div class="danger-option">
          <div class="danger-info">
            <h4>Reset Preferences</h4>
            <p>Reset all your personal preferences to defaults</p>
          </div>
          <button class="btn btn-danger" (click)="resetPreferences()">
            Reset Preferences
          </button>
        </div>
      </div>

    </section>
  `,
  styles: [`
    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .page-header p {
      color: #64748b;
    }

    .page-body {
      display: grid;
      gap: 24px;
      max-width: 720px;
    }

    .settings-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }
    
    .settings-card.danger-zone {
      border-color: #fecaca;
      background: #fef2f2;
    }

    .settings-card h3 {
      margin-bottom: 16px;
      font-size: 1.125rem;
      color: #1e293b;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    .form-group label {
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }

    .form-group input {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      font-size: 0.875rem;
      transition: border-color 0.2s ease;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #f15a24;
      box-shadow: 0 0 0 2px rgba(241, 90, 36, 0.2);
    }

    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      border: none;
      font-weight: 500;
      transition: all 0.2s ease;
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
      background: linear-gradient(135deg, #f15a24, #ff7a45);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(241, 90, 36, 0.4);
      transform: translateY(-1px);
    }

    .btn-primary:active:not(:disabled) {
      transform: scale(0.97);
      box-shadow: 0 4px 8px rgba(241, 90, 36, 0.3);
    }

    .btn-outline {
      background: transparent;
      color: #f15a24;
      border: 1px solid #f15a24;
    }

    .btn-outline:hover:not(:disabled) {
      background: rgba(241, 90, 36, 0.1);
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 8px 16px;
    }
    
    .btn-danger:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
      transform: translateY(-1px);
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.75rem;
    }

    .integration {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .integration:last-child {
      border-bottom: none;
    }

    .connected {
      background: #22c55e;
      color: white;
    }
    
    .danger-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #fecaca;
    }
    
    .danger-option:last-child {
      border-bottom: none;
    }
    
    .danger-info h4 {
      margin: 0 0 4px 0;
      color: #dc2626;
      font-size: 1rem;
    }
    
    .danger-info p {
      margin: 0;
      color: #991b1b;
      font-size: 0.875rem;
    }
  `]
})
export class SettingsComponent {
  saving = signal(false);

  account = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  security = {
    password: '',
    confirmPassword: ''
  };

  integrations = {
    slack: false,
    email: true,
    calendar: false
  };

  constructor(public toastService: ToastService) {}

  saveAccount() {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.toastService.success('Account updated successfully');
    }, 800);
  }

  changePassword() {
    if (this.security.password !== this.security.confirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.security.password = '';
      this.security.confirmPassword = '';
      this.toastService.success('Password changed successfully');
    }, 800);
  }

  toggleIntegration(type: 'slack' | 'email' | 'calendar') {
    this.integrations[type] = !this.integrations[type];
    const status = this.integrations[type] ? 'enabled' : 'disabled';
    this.toastService.info(`${type} integration ${status}`);
  }
  
  logoutAllSessions() {
    console.log('Logging out all sessions');
    this.toastService.warning('All sessions have been logged out');
  }
  
  resetPreferences() {
    console.log('Resetting preferences');
    alert('Preferences have been reset to default');
  }
}