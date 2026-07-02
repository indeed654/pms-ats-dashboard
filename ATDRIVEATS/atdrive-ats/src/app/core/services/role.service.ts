import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private authService: AuthService) {}

  getCurrentUserRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role as UserRole : null;
  }

  hasRole(role: UserRole): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getCurrentUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isRecruiter(): boolean {
    return this.hasRole(UserRole.RECRUITER);
  }

  isInterviewer(): boolean {
    return this.hasRole(UserRole.INTERVIEWER);
  }

  isCandidate(): boolean {
    return this.hasRole(UserRole.CANDIDATE);
  }

  // Check if user can perform administrative actions
  canManageUsers(): boolean {
    return this.hasAnyRole([UserRole.ADMIN]);
  }

  canManageJobs(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.RECRUITER]);
  }

  canViewCandidates(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.RECRUITER]);
  }

  canManageInterviews(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.RECRUITER, UserRole.INTERVIEWER]);
  }

  canViewActivity(): boolean {
    return this.hasAnyRole([UserRole.ADMIN]);
  }

  canAccessSettings(): boolean {
    return this.hasAnyRole([UserRole.ADMIN]);
  }

  canGenerateAIJD(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.RECRUITER]);
  }
}