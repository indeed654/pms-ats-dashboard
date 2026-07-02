import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toastsList(); track toast.id) {
        <div 
          class="toast toast-{{toast.type}}"
          (click)="removeToast(toast.id)">
          <div class="toast-content">
            <span class="toast-icon">
              @switch (toast.type) {
                @case ('success') { ✅ }
                @case ('error') { ❌ }
                @case ('warning') { ⚠️ }
                @case ('info') { ℹ️ }
              }
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="removeToast(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid;
    }

    .toast:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .toast-success {
      background: rgba(76, 175, 80, 0.95);
      border-color: #4caf50;
      color: white;
    }

    .toast-error {
      background: rgba(244, 67, 54, 0.95);
      border-color: #f44336;
      color: white;
    }

    .toast-warning {
      background: rgba(255, 152, 0, 0.95);
      border-color: #ff9800;
      color: white;
    }

    .toast-info {
      background: rgba(33, 150, 243, 0.95);
      border-color: #2196f3;
      color: white;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .toast-message {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  removeToast(id: number) {
    this.toastService.removeToast(id);
  }
}