import { Injectable } from '@angular/core';
import { 
  Resolve, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService, User } from '../services/auth.service';

/**
 * AuthResolve - Route resolver that ensures auth state is resolved before navigation
 * 
 * This resolves the user data and ensures it's available before the component loads,
 * eliminating race conditions between auth state and route navigation.
 * 
 * Usage in routes:
 * {
 *   path: 'admin/dashboard',
 *   component: AdminDashboardComponent,
 *   resolve: { user: AuthResolve }
 * }
 */
@Injectable({ providedIn: 'root' })
export class AuthResolve implements Resolve<User | null> {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<User | null> {
    // Return the current user if already authenticated
    const currentUser = this.authService.getCurrentUser();
    const isAuthenticated = this.authService.getCurrentAuthStatus();

    if (isAuthenticated && currentUser) {
      console.log('[AuthResolve] User already authenticated:', currentUser.role);
      return of(currentUser);
    }

    // Check storage for persisted session
    const token = this.authService.getToken();
    if (token && currentUser) {
      console.log('[AuthResolve] Restored user from storage');
      return of(currentUser);
    }

    // Not authenticated - return null (guard should handle redirect)
    console.log('[AuthResolve] User not authenticated');
    return of(null);
  }
}
