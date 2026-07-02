import { Component, signal, OnInit, OnDestroy, computed, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { filter, Subject, takeUntil } from 'rxjs';

import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  template: `
    <div class="main-layout">
      <!-- Sidebar - always rendered when authenticated -->
      @if (isAuthenticated()) {
        <app-sidebar></app-sidebar>
      }

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <header class="main-header">
          <div class="header-content">
            <h1 class="page-title">{{ getPageTitle() }}</h1>

            <div class="header-actions">
              <!-- Search -->
              <div class="search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  class="search-input"
                  (keyup.enter)="onSearch($event)"
                />
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>

              <!-- Notifications -->
              <div class="notification-bell">
                <button
                  class="notification-btn"
                  aria-label="Notifications"
                  (click)="openNotifications()"
                >
                  <svg class="bell-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  @if (notificationCount() > 0) {
                    <span class="notification-badge">
                      {{ notificationCount() }}
                    </span>
                  }
                </button>
              </div>

              <!-- User Menu -->
              @if (currentUser(); as user) {
                <div class="user-profile">
                  <button
                    class="user-btn"
                    (click)="toggleUserMenu()"
                    aria-label="User menu"
                  >
                    <div class="user-avatar">{{ getUserInitials() }}</div>
                    <span class="user-name">
                      {{ user.firstName }} {{ user.lastName }}
                    </span>
                    <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  @if (showUserMenu()) {
                    <div class="user-menu-dropdown">
                      <ul class="user-menu-list">
                        <li>
                          <a [routerLink]="['/app/profile']" (click)="closeMenu()">Profile</a>
                        </li>
                        <li>
                          <a [routerLink]="['/app/settings']" (click)="closeMenu()">Settings</a>
                        </li>
                        <li>
                          <a href="#" (click)="onLogout($event)">Logout</a>
                        </li>
                      </ul>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Page Body -->
        <main class="main-body">
          @if (isAuthenticated()) {
            <div [@fadeSlide]>
              <router-outlet></router-outlet>
            </div>
          } @else {
            <div class="auth-guard-redirect">
              <div class="redirect-spinner"></div>
              <p>Redirecting to login...</p>
            </div>
          }
        </main>

        <!-- Footer -->
        <footer class="main-footer">
          <p>&copy; 2026 AtDrive ATS. All rights reserved.</p>
        </footer>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeSlide', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ],
  styles: [`
    :host {
      --brand-white: #ffffff;
      --brand-black: #000000;
      --bg-surface: #ffffff;
      --text-primary: #1e293b;
      --border-color: #e2e8f0;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: var(--bg-surface, #f8fafc);
      color: var(--text-primary, #1e293b);
      font-family: sans-serif;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(241, 90, 36, 0.2);
      border-top: 4px solid var(--brand-orange, #f15a24);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .main-layout {
      display: flex;
      height: 100vh;
      background-color: var(--bg-surface, #f8fafc);
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .main-body {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      background-color: var(--bg-surface, #f8fafc);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .main-header {
      padding: 1rem;
      background: var(--bg-surface, #ffffff);
      border-bottom: 1px solid var(--border-color, #e2e8f0);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #1e293b);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-container {
      position: relative;
    }

    .search-input {
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      font-size: 0.875rem;
      width: 240px;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      width: 280px;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .notification-btn {
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      font-size: 1.25rem;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      font-size: 0.625rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-profile {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
    }

    .user-btn:hover {
      background-color: color-mix(in srgb, var(--text-primary, #1e293b) 10%, transparent);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 8px;
      box-shadow: 0 10px 15px rgba(0,0,0,0.1);
      margin-top: 0.5rem;
      z-index: 200;
    }

    .user-menu-list {
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
    }

    .user-menu-list a {
      display: block;
      padding: 0.5rem 1rem;
      color: var(--text-primary, #1e293b);
      text-decoration: none;
      border-radius: 6px;
    }

    .user-menu-list a:hover {
      background-color: color-mix(in srgb, var(--text-primary, #1e293b) 10%, transparent);
    }

    .main-footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: color-mix(in srgb, var(--text-primary, #1e293b) 60%, transparent);
      border-top: 1px solid color-mix(in srgb, var(--text-primary, #1e293b) 15%, transparent);
      background: white;
    }

    .auth-guard-redirect {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 1rem;
      color: #64748b;
    }

    .redirect-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  showUserMenu = signal(false);
  notificationCount = signal(3);
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);
  
  // Cleanup subject
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated.set(isAuth);
        
        // If not authenticated and not on login page, redirect
        if (!isAuth && !this.router.url.includes('/login')) {
          this.router.navigate(['/login']);
        }
        
        this.cdr.markForCheck();
      });

    // Subscribe to current user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser.set(user);
        this.cdr.markForCheck();
      });

    // Close user menu on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showUserMenu.set(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPageTitle(): string {
    const url = this.router.url;

    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/jobs')) return 'Jobs';
    if (url.includes('/candidates')) return 'Candidates';
    if (url.includes('/interviews')) return 'Interviews';
    if (url.includes('/activity')) return 'Activity Log';
    if (url.includes('/settings')) return 'Settings';
    if (url.includes('/profile')) return 'Profile';
    if (url.includes('/users')) return 'Users';
    if (url.includes('/reports')) return 'Reports';
    if (url.includes('/applications')) return 'Applications';

    return 'AtDrive ATS';
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (user) {
      const first = user.firstName?.charAt(0) || '';
      const last = user.lastName?.charAt(0) || '';
      return `${first}${last}`.toUpperCase() || 'U';
    }
    return 'U';
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    if (!value) return;
    console.log('Searching:', value);
  }

  openNotifications(): void {
    console.log('Notifications opened');
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  closeMenu(): void {
    this.showUserMenu.set(false);
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
