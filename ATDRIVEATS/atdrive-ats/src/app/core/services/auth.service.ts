import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserRole, ROLE_DASHBOARDS } from '../models/role.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  name?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Use environment-based API URL
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('[AuthService] Initializing...');
    this.checkStoredUser();
  }

  /**
   * Check for stored user in localStorage on app initialization
   */
  private checkStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          console.log('[AuthService] Found stored user:', user.role);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch (e) {
          console.log('[AuthService] Error parsing stored user, clearing');
          this.clearStorage();
        }
      } else {
        console.log('[AuthService] No stored user found');
      }
    }
  }

  /**
   * Clear all auth-related storage
   */
  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<boolean> {
    console.log('[AuthService] Login attempt for:', email);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: LoginResponse) => {
        console.log('[AuthService] Login response:', response.status);
        
        if (response.status === 'Y' && response.token) {
          // Map backend user to frontend user model
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            firstName: response.user.name.split(' ')[0] || response.user.name,
            lastName: response.user.name.split(' ').slice(1).join(' ') || '',
            name: response.user.name,
            role: response.user.role
          };

          console.log('[AuthService] Login successful, user role:', user.role);

          // Store token and user
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
          }

          // Update behavior subjects
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          
          console.log('[AuthService] Auth state updated - isAuthenticated:', true);
        }
      }),
      map((response: LoginResponse) => response.status === 'Y'),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  /**
   * Get dashboard route based on user role
   */
  getDashboardRoute(): string {
    const user = this.getCurrentUser();
    if (user) {
      const role = user.role as UserRole;
      const route = ROLE_DASHBOARDS[role] || '/app/dashboard';
      console.log('[AuthService] getDashboardRoute:', route, 'for role:', role);
      return route;
    }
    console.log('[AuthService] getDashboardRoute: no user, returning default');
    return '/app/dashboard';
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearStorage();
    console.log('User logged out successfully');
  }

  /**
   * Check if user is authenticated (observable)
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current auth status synchronously
   */
  getCurrentAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Refresh user data from backend
   */
  refreshUser(): Observable<User | null> {
    return this.http.get<{ status: string; user: User }>(`${this.apiUrl}/auth/profile`).pipe(
      tap((response: { status: string; user: User }) => {
        if (response.status === 'Y' && response.user) {
          this.currentUserSubject.next(response.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
      }),
      map((response: { status: string; user: User }) => response.status === 'Y' ? response.user : null),
      catchError(() => {
        this.clearStorage();
        return of(null);
      })
    );
  }
}
