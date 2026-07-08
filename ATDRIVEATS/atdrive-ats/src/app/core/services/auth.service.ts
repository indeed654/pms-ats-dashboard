import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
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

  // Production-ready API URL
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('[AuthService] Initializing...');
    this.checkStoredUser();
  }

  /**
   * Check for stored authentication
   */
  private checkStoredUser(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        const user: User = JSON.parse(storedUser);

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        console.log('[AuthService] User restored:', user.email);
      } catch (error) {
        console.error('[AuthService] Invalid stored user');
        this.clearStorage();
      }
    }
  }

  /**
   * Login
   */
  login(email: string, password: string): Observable<boolean> {
    console.log('[AuthService] Login:', email);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        email,
        password
      })
      .pipe(
        tap((response) => {
          if (response.status === 'Y' && response.token) {
            const fullName = response.user.name || '';

            const user: User = {
              id: response.user.id,
              email: response.user.email,
              name: fullName,
              firstName: fullName.split(' ')[0] || '',
              lastName: fullName.split(' ').slice(1).join(' '),
              role: response.user.role
            };

            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('authToken', response.token);
              localStorage.setItem('currentUser', JSON.stringify(user));
              localStorage.setItem('isLoggedIn', 'true');
            }

            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);

            console.log('[AuthService] Login successful');
          }
        }),
        map((response) => response.status === 'Y'),
        catchError((error) => {
          console.error('[AuthService] Login failed', error);
          return of(false);
        })
      );
  }

  /**
   * Logout
   */
  logout(): void {
    this.clearStorage();
    console.log('[AuthService] Logged out');
  }

  /**
   * Clear authentication
   */
  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
    }

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Observable auth state
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Current auth state
   */
  getCurrentAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * JWT Token
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem('authToken');
  }

  /**
   * User role check
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === role;
  }

  /**
   * Dashboard Route
   */
  getDashboardRoute(): string {
    const user = this.getCurrentUser();

    if (!user) {
      return '/app/dashboard';
    }

    const role = user.role as UserRole;

    return ROLE_DASHBOARDS[role] || '/app/dashboard';
  }

  /**
   * Refresh user profile
   */
  refreshUser(): Observable<User | null> {
    return this.http
      .get<{ status: string; user: User }>(`${this.apiUrl}/auth/profile`)
      .pipe(
        tap((response) => {
          if (response.status === 'Y') {
            this.currentUserSubject.next(response.user);

            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem(
                'currentUser',
                JSON.stringify(response.user)
              );
            }
          }
        }),
        map((response) =>
          response.status === 'Y' ? response.user : null
        ),
        catchError(() => {
          this.clearStorage();
          return of(null);
        })
      );
  }
}