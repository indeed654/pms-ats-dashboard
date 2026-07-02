import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole, ROLE_DASHBOARDS } from '../models/role.model';

/**
 * RoleGuard - Protects routes based on user roles
 * 
 * Usage in routes:
 * {
 *   path: 'admin/dashboard',
 *   component: AdminDashboardComponent,
 *   canActivate: [AuthGuard, RoleGuard],
 *   data: { roles: [UserRole.ADMIN] }
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Get required roles from route data
    const requiredRoles = route.data['roles'] as UserRole[] | undefined;
    
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      // Not authenticated - redirect to login
      console.log('[RoleGuard] No user found, redirecting to login');
      this.router.navigate(['/login']);
      return of(false);
    }

    // If no specific roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    // Check if user's role is in the allowed list
    const userRole = currentUser.role as UserRole;
    const hasRequiredRole = requiredRoles.includes(userRole);

    if (!hasRequiredRole) {
      // User doesn't have required role - redirect to their dashboard
      console.log(`[RoleGuard] User role '${userRole}' not in required roles, redirecting to dashboard`);
      
      const dashboardRoute = ROLE_DASHBOARDS[userRole] || '/app/dashboard';
      
      const extras: NavigationExtras = {
        queryParams: { 
          unauthorized: 'true',
          requiredRoles: requiredRoles.join(',')
        }
      };
      
      this.router.navigate([dashboardRoute], extras);
      return of(false);
    }

    // User has the required role
    return of(true);
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.authService.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.authService.getCurrentUser();
    return user ? roles.includes(user.role as UserRole) : false;
  }
}
