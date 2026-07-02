import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.elevated]="elevated" [class.outlined]="outlined">
      @if (header || hasHeaderTemplate) {
        <div class="card-header">
          <ng-content select="[slot=header]"></ng-content>
          @if (header) {
            <h3 class="card-title">{{ header }}</h3>
          }
          @if (headerActions) {
            <div class="card-header-actions">
              <ng-content select="[slot=header-actions]"></ng-content>
            </div>
          }
        </div>
      }
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      @if (footer || hasFooterTemplate) {
        <div class="card-footer">
          <ng-content select="[slot=footer]"></ng-content>
          @if (footer) {
            <div class="card-footer-content">{{ footer }}</div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .card.elevated {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .card.elevated:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    .card.outlined {
      box-shadow: none;
      border: 1px solid #e2e8f0;
    }

    .card-header {
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .card-header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #f1f5f9;
      background-color: #f8fafc;
    }

    .card-footer-content {
      color: #64748b;
      font-size: 0.875rem;
    }
  `]
})
export class CardComponent {
  @Input() header?: string;
  @Input() footer?: string;
  @Input() headerActions = false;
  @Input() elevated = false;
  @Input() outlined = false;

  get hasHeaderTemplate(): boolean {
    // This would be detected properly in a real implementation
    // For now, we'll just return false since we can't detect ng-content presence directly
    return false;
  }

  get hasFooterTemplate(): boolean {
    return false;
  }
}