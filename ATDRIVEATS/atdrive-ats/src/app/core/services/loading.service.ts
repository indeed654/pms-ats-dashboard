import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingStates = signal<Record<string, boolean>>({});

  isLoading = (key: string) => this.loadingStates()[key] || false;

  setLoading(key: string, loading: boolean) {
    this.loadingStates.update(states => ({
      ...states,
      [key]: loading
    }));
  }

  startLoading(key: string) {
    this.setLoading(key, true);
  }

  stopLoading(key: string) {
    this.setLoading(key, false);
  }
}