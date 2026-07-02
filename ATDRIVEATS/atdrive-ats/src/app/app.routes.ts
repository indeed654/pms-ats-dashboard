import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/role.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'app',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Admin Dashboard
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      // Recruiter Dashboard
      {
        path: 'recruiter/dashboard',
        loadComponent: () => import('./features/dashboard/recruiter-dashboard/recruiter-dashboard.component').then(m => m.RecruiterDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.RECRUITER] }
      },
      // Interviewer Dashboard
      {
        path: 'interviewer/dashboard',
        loadComponent: () => import('./features/dashboard/interviewer-dashboard/interviewer-dashboard.component').then(m => m.InterviewerDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.INTERVIEWER] }
      },
      // Candidate Dashboard
      {
        path: 'candidate/dashboard',
        loadComponent: () => import('./features/dashboard/candidate-dashboard/candidate-dashboard.component').then(m => m.CandidateDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.CANDIDATE] }
      },
      // Legacy dashboard route (redirects based on role)
      {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full'
      },
      // Jobs - Admin and Recruiter only
      {
        path: 'jobs',
        loadComponent: () => import('./features/jobs/jobs.component').then(m => m.JobsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER] }
      },
      // Candidates - Admin and Recruiter only
      {
        path: 'candidates',
        loadComponent: () => import('./features/candidates/candidates.component').then(m => m.CandidatesComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER] }
      },
      // Interviews - Admin, Recruiter, Interviewer
      {
        path: 'interviews',
        loadComponent: () => import('./features/interviews/interviews.component').then(m => m.InterviewsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.INTERVIEWER] }
      },
      // Activity - Admin only
      {
        path: 'activity',
        loadComponent: () => import('./features/activity/activity.component').then(m => m.ActivityComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      // Settings - Admin only
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      // AI JD Generator - Admin and Recruiter
      {
        path: 'ai/jd-generator',
        loadComponent: () => import('./features/ai-jd-generator/ai-jd-generator.component').then(m => m.AiJdGeneratorComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER] }
      },
      // Profile - All authenticated users
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.INTERVIEWER, UserRole.CANDIDATE] }
      },
      // Users - Admin only
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN] }
      },
      // Reports - Admin and Recruiter
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.ADMIN, UserRole.RECRUITER] }
      },
      // Feedback - Interviewer and Candidate
      {
        path: 'feedback',
        loadComponent: () => import('./features/feedback/feedback.component').then(m => m.FeedbackComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.INTERVIEWER, UserRole.CANDIDATE] }
      },
      // Applications - Candidate only
      {
        path: 'applications',
        loadComponent: () => import('./features/applications/applications.component').then(m => m.ApplicationsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.CANDIDATE] }
      },
      // Default redirect to role-specific dashboard
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
