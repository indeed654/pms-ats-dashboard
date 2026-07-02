import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Users Management</h1>
        <p>Manage system users and permissions</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="stat-value">1,248</div>
          <div class="stat-trend positive">+12% from last month</div>
        </div>
        
        <div class="stat-card">
          <h3>Active Users</h3>
          <div class="stat-value">1,189</div>
          <div class="stat-trend positive">+8% from last week</div>
        </div>
        
        <div class="stat-card">
          <h3>Admin Users</h3>
          <div class="stat-value">12</div>
          <div class="stat-trend">System administrators</div>
        </div>
        
        <div class="stat-card">
          <h3>Pending Invites</h3>
          <div class="stat-value">5</div>
          <div class="stat-trend warning">Requires attention</div>
        </div>
      </div>
      
      <div class="actions-section">
        <button class="btn btn-primary" (click)="inviteUser()">
          <span>+</span> Invite User
        </button>
        <button class="btn btn-outline" (click)="exportUsers()">
          <span>↓</span> Export Users
        </button>
      </div>
      
      <div class="users-table">
        <h2>User List</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of mockUsers">
                <td>
                  <div class="user-info">
                    <div class="avatar">{{ user.name.charAt(0) }}</div>
                    <div>
                      <div class="user-name">{{ user.name }}</div>
                      <div class="user-id">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                    {{ user.role }}
                  </span>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + user.status">
                    {{ user.status }}
                  </span>
                </td>
                <td>{{ user.lastActive }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="icon-btn edit" (click)="editUser(user.id)" title="Edit User">
                      ✏️
                    </button>
                    <button class="icon-btn delete" (click)="deleteUser(user.id)" title="Delete User">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    
    .stat-card h3 {
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
    
    .stat-trend {
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .stat-trend.positive { color: #22c55e; }
    .stat-trend.warning { color: #f59e0b; }
    
    .actions-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
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
    
    .users-table h2 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .table-container {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background: #f8fafc;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    
    td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    .user-name {
      font-weight: 600;
      color: #1e293b;
    }
    
    .user-id {
      font-size: 0.8rem;
      color: #64748b;
    }
    
    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .role-admin { background: #fee2e2; color: #dc2626; }
    .role-recruiter { background: #dbeafe; color: #3b82f6; }
    .role-interviewer { background: #fef3c7; color: #f59e0b; }
    .role-candidate { background: #dcfce7; color: #22c55e; }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .status-active { background: #dcfce7; color: #22c55e; }
    .status-inactive { background: #f1f5f9; color: #64748b; }
    .status-pending { background: #fef3c7; color: #f59e0b; }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .icon-btn.edit {
      background: #dbeafe;
      color: #3b82f6;
    }
    
    .icon-btn.edit:hover {
      background: #3b82f6;
      color: white;
    }
    
    .icon-btn.delete {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .icon-btn.delete:hover {
      background: #dc2626;
      color: white;
    }
  `]
})
export class UsersComponent {
  currentUser: any = null;
  mockUsers = [
    { id: 1, name: 'John Admin', email: 'john.admin@company.com', role: 'ADMIN', status: 'active', lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Recruiter', email: 'sarah.recruiter@company.com', role: 'RECRUITER', status: 'active', lastActive: '1 day ago' },
    { id: 3, name: 'Mike Interviewer', email: 'mike.interviewer@company.com', role: 'INTERVIEWER', status: 'active', lastActive: '3 hours ago' },
    { id: 4, name: 'Lisa Candidate', email: 'lisa.candidate@company.com', role: 'CANDIDATE', status: 'pending', lastActive: '1 week ago' },
    { id: 5, name: 'David Manager', email: 'david.manager@company.com', role: 'ADMIN', status: 'inactive', lastActive: '2 weeks ago' }
  ];

  constructor(private authService: AuthService, public toastService: ToastService) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      console.warn('Unauthorized access to users management');
    }
  }

  inviteUser() {
    this.toastService.info('Opening invitation modal...');
  }

  exportUsers() {
    this.toastService.info('Exporting user data...');
    // Simulate export process
    setTimeout(() => {
      this.toastService.success('User data exported successfully');
    }, 1500);
  }

  editUser(userId: number) {
    this.toastService.info(`Opening edit modal for user ${userId}`);
  }

  deleteUser(userId: number) {
    if (confirm(`Are you sure you want to delete user ${userId}?`)) {
      this.toastService.warning(`User ${userId} deleted successfully`);
    }
  }
}