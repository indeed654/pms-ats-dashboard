import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="stat-card" 
      [class.clickable]="clickable"
      [class.positive]="trend === 'positive'"
      [class.negative]="trend === 'negative'"
      (click)="onClick()"
    >
      <div class="stat-header">
        <div class="stat-icon">
          <span>{{ icon }}</span>
        </div>
        <div class="stat-info">
          <h3 class="stat-title">{{ title }}</h3>
          <p class="stat-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      
      <div class="stat-value">{{ value }}</div>
      
      @if (trendValue !== undefined) {
        <div class="stat-trend">
          <span class="trend-icon">{{ trendIcon() }}</span>
          <span class="trend-value">{{ trendValue }}%</span>
          <span class="trend-text">{{ trendText }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
      cursor: default;
    }

    .stat-card.clickable {
      cursor: pointer;
    }

    .stat-card.clickable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    .stat-card.positive {
      border-left: 4px solid #10b981;
    }

    .stat-card.negative {
      border-left: 4px solid #ef4444;
    }

    .stat-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-size: 1.25rem;
    }

    .stat-info {
      flex: 1;
    }

    .stat-title {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .stat-subtitle {
      margin: 0;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
    }

    .trend-icon {
      font-size: 0.75rem;
    }

    .trend-value {
      font-weight: 600;
    }

    .trend-positive .trend-value {
      color: #10b981;
    }

    .trend-negative .trend-value {
      color: #ef4444;
    }

    .trend-text {
      color: #94a3b8;
    }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input({ required: true }) value!: string | number;
  @Input() icon!: string;
  @Input() trend?: 'positive' | 'negative';
  @Input() trendValue?: number;
  @Input() trendText?: string;
  @Input() clickable = false;
  @Input() routerLink?: string;

  constructor(private router: Router) {}

  onClick(): void {
    if (this.clickable && this.routerLink) {
      this.router.navigate([this.routerLink]);
    }
  }

  trendIcon(): string {
    if (this.trend === 'positive') return '▲';
    if (this.trend === 'negative') return '▼';
    return '';
  }
}