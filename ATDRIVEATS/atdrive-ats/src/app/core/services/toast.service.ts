import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 1;

  toastsList = this.toasts.asReadonly();

  success(message: string, duration: number = 3000) {
    this.addToast(message, 'success', duration);
  }

  error(message: string, duration: number = 5000) {
    this.addToast(message, 'error', duration);
  }

  warning(message: string, duration: number = 4000) {
    this.addToast(message, 'warning', duration);
  }

  info(message: string, duration: number = 3000) {
    this.addToast(message, 'info', duration);
  }

  private addToast(message: string, type: Toast['type'], duration: number) {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration
    };

    this.toasts.update(toasts => [...toasts, toast]);

    // Auto remove after duration
    setTimeout(() => {
      this.removeToast(toast.id);
    }, duration);
  }

  removeToast(id: number) {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
}