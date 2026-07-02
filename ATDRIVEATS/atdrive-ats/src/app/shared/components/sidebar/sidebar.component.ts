import { Component, signal, OnInit, OnDestroy, computed, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, User } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/role.model';
import { getSidebarItemsForRole, SidebarItem } from '../../../core/models/sidebar.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <div class="logo">
        @if (!collapsed()) {
          <div class="logo-text">💼 ATS</div>
        } @else {
          <div class="logo-icon">💼</div>
        }
      </div>

      <button class="collapse-btn" (click)="toggle()" aria-label="Toggle sidebar">
        <svg class="collapse-icon" [class.collapsed-icon]="collapsed()" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <nav class="nav">
        @if (isLoading()) {
          <div class="sidebar-loading">
            <span>Loading...</span>
          </div>
        } @else if (navItems().length > 0) {
          @for (item of navItems(); track item.label) {
            @if (item.separator) {
              <div class="nav-separator"></div>
            } @else if (item.path) {
              <a
                [routerLink]="item.path"
                class="nav-item"
                [class.active]="isActive(item.path)"
                [class.disabled]="item.disabled"
                [title]="collapsed() ? item.label : ''"
                (click)="onItemClick(item, $event)"
              >
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path [attr.d]="getIconPath(item.icon || '')" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="label" *ngIf="!collapsed()">{{ item.label }}</span>
                
                @if (item.badge && !collapsed()) {
                  <span class="nav-badge" [class]="'badge-' + (item.badgeType || 'primary')">
                    {{ item.badge }}
                  </span>
                }
              </a>
            } @else if (item.onClick) {
              <button
                class="nav-item button-item"
                [class.active]="item.active"
                [class.disabled]="item.disabled"
                [title]="collapsed() ? item.label : ''"
                (click)="item.onClick()"
              >
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path [attr.d]="getIconPath(item.icon || '')" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="label" *ngIf="!collapsed()">{{ item.label }}</span>
              </button>
            }
          }
        } @else {
          <div class="sidebar-empty">
            <span>No menu items</span>
          </div>
        }
      </nav>

      <div class="sidebar-footer">
        <button class="logout" (click)="logout()">
          <svg class="logout-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span *ngIf="!collapsed()">Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      --brand-white: #ffffff;
      --brand-black: #000000;
      --bg-surface: #ffffff;
      --text-primary: #1e293b;
      --border-color: #e2e8f0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 0;
      margin-bottom: 1rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
      letter-spacing: -0.5px;
    }
    
    .logo-icon {
      font-size: 1.8rem;
      color: #3b82f6;
    }

    .sidebar {
      width: 240px;
      background: var(--bg-surface, #ffffff);
      color: var(--text-primary, #1e293b);
      display: flex;
      flex-direction: column;
      padding: 16px;
      transition: width 0.25s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-right: 1px solid var(--border-color, #e2e8f0);
    }

    .sidebar.collapsed { width: 72px; }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .collapse-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      margin-bottom: 16px;
      text-align: left;
      padding: 8px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .collapse-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }

    .collapse-icon {
      width: 16px;
      height: 16px;
      color: #94a3b8;
      transition: transform 0.3s ease;
    }

    .collapsed-icon {
      transform: scaleX(-1);
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      overflow-y: auto;
    }

    .sidebar-loading,
    .sidebar-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      outline: none;
      width: 100%;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }

    .nav-item:hover::before {
      left: 100%;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #3b82f6;
    }

    .nav-item.active {
      background: #f8fafc;
      color: #1e293b;
      font-weight: 600;
      border-left: 3px solid #3b82f6;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.2s ease, color 0.2s ease;
      flex-shrink: 0;
    }

    .nav-item:hover .nav-icon {
      color: #3b82f6;
    }

    .nav-item.active .nav-icon {
      color: white;
    }

    .nav-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .nav-separator {
      height: 1px;
      background: #e2e8f0;
      margin: 8px 0;
    }

    .nav-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      margin-left: auto;
    }

    .badge-primary {
      background: #3b82f6;
      color: white;
    }

    .badge-success {
      background: #10b981;
      color: white;
    }

    .badge-warning {
      background: #f59e0b;
      color: white;
    }

    .badge-danger {
      background: #ef4444;
      color: white;
    }

    .button-item {
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }

    .label {
      flex: 1;
      text-align: left;
      transition: opacity 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logout {
      width: 100%;
      background: none;
      border: none;
      color: #f87171;
      cursor: pointer;
      padding: 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .logout:hover {
      background: rgba(248, 113, 113, 0.15);
      transform: translateX(4px);
    }

    .logout-icon {
      width: 20px;
      height: 20px;
    }

    /* Animation preferences */
    @media (prefers-reduced-motion: reduce) {
      .sidebar,
      .nav-item,
      .logout {
        transition: none;
      }
      
      .nav-item:hover {
        transform: none;
      }
      
      .logout:hover {
        transform: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = signal(false);
  navItems = signal<SidebarItem[]>([]);
  currentUser = signal<User | null>(null);
  isLoading = signal(true);
  
  // Use destroy$ for cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Subscribe to current user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser.set(user);
        this.loadNavItems(user);
        this.isLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Load navigation items based on user role
   */
  private loadNavItems(user: User | null): void {
    if (user && user.role) {
      const userRole = user.role as UserRole;
      const items = getSidebarItemsForRole(userRole);
      this.navItems.set(items);
    } else {
      this.navItems.set([]);
    }
  }

  toggle(): void {
    this.collapsed.update(v => !v);
  }

  isActive(path: string): boolean {
    const currentUrl = this.router.url;
    if (path === '/app/dashboard') {
      return currentUrl === '/app/dashboard';
    }
    return currentUrl.startsWith(path);
  }

  getIconPath(iconName: string): string {
    const icons: Record<string, string> = {
      'dashboard': 'M3 12h2l2-2 2 2h10M3 6h18M3 18h18',
      'work': 'M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-7.5l-3-3z',
      'smart_toy': 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
      'people': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      'group': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      'calendar_today': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
      'insights': 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2m-6 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z',
      'person': 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z',
      'settings': 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
      'description': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
      'event': 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
      'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      'trending_up': 'M23 6l-9.5 9.5-5-5L1 18',
      'rate_review': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    };
    return icons[iconName] || 'M3 12h2l2-2 2 2h10M3 6h18M3 18h18';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onItemClick(item: SidebarItem, event?: Event): void {
    // Prevent navigation for disabled items
    if (item.disabled) {
      event?.preventDefault();
      return;
    }
    
    // Execute custom click handler if provided
    if (item.onClick) {
      item.onClick();
      event?.preventDefault();
    }
  }
}
