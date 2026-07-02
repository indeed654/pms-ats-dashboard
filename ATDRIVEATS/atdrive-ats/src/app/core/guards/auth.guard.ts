import { Injectable } from '@angular/core';
import { 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  CanActivate,
  CanActivateChild,
  NavigationExtras
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole, ROLE_DASHBOARDS } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * CanActivate implementation
   * Checks if user is authenticated before allowing route access
   */
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  /**
   * CanActivateChild implementation
   * Used for child routes
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  /**
   * Check authentication status
   * 
   * IMPORTANT: Guards should only allow or block access.
   * Navigation logic belongs to LoginComponent / AppInit.
   * Do NOT redirect from inside guards - this causes split-brain navigation issues.
   */
  private checkAuth(url: string): Observable<boolean> {
    console.log('[AuthGuard] Checking auth for URL:', url);
    
    // First check if user is already authenticated in memory
    if (this.authService.getCurrentAuthStatus()) {
      console.log('[AuthGuard] User is authenticated in memory');
      return of(true);
    }

    // Check localStorage for persisted session
    const token = this.authService.getToken();
    const storedUser = this.authService.getCurrentUser();
    
    if (token && storedUser) {
      console.log('[AuthGuard] User found in localStorage');
      return of(true);
    }

    // Not authenticated - redirect to login with return URL
    console.log('[AuthGuard] Not authenticated, redirecting to login');
    const extras: NavigationExtras = {
      queryParams: { returnUrl: url }
    };
    this.router.navigate(['/login'], extras);
    return of(false);
  }
}
