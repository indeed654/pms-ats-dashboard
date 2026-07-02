import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-bar" [class.focused]="isFocused()">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          [placeholder]="placeholder"
          [value]="searchTerm()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="search-input"
        />
        @if (searchTerm()) {
          <button 
            class="clear-btn" 
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            ×
          </button>
        }
      </div>
      
      @if (showRecent && recentSearches().length > 0) {
        <div class="recent-searches" *ngIf="searchTerm(); else defaultSuggestions">
          <div class="recent-item" *ngFor="let item of recentSearches()">
            <span class="recent-icon">🕒</span>
            <span class="recent-text" (click)="selectRecent(item)">{{ item }}</span>
            <button 
              class="remove-recent" 
              (click)="removeRecent(item)"
              aria-label="Remove recent search"
            >
              ×
            </button>
          </div>
        </div>
        <ng-template #defaultSuggestions>
          <div class="suggestions">
            @for (suggestion of suggestions; track suggestion) {
              <div class="suggestion-item" (click)="selectSuggestion(suggestion)">
                <span class="suggestion-icon">💡</span>
                <span class="suggestion-text">{{ suggestion }}</span>
              </div>
            }
          </div>
        </ng-template>
      }
    </div>
  `,
  styles: [`
    .search-bar {
      position: relative;
      width: 100%;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 3rem 0.75rem 2.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      background: white;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-bar.focused .search-input {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-btn:hover {
      background: #f1f5f9;
      color: #475569;
    }

    .recent-searches, .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 100;
      max-height: 240px;
      overflow-y: auto;
    }

    .recent-item, .suggestion-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .recent-item:hover, .suggestion-item:hover {
      background-color: #f8fafc;
    }

    .recent-icon, .suggestion-icon {
      margin-right: 0.75rem;
      color: #94a3b8;
    }

    .recent-text, .suggestion-text {
      flex: 1;
      color: #1e293b;
    }

    .remove-recent {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      border-radius: 4px;
    }

    .remove-recent:hover {
      background: #f1f5f9;
      color: #475569;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Input() showRecent = true;
  @Input() suggestions: string[] = [
    'Jobs',
    'Candidates',
    'Interviews',
    'Reports',
    'Settings'
  ];
  
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchTerm = signal('');
  isFocused = signal(false);
  recentSearches = signal<string[]>([
    'Software Engineer',
    'Marketing Manager',
    'Data Scientist',
    'Product Designer'
  ]);

  onInput(event: any): void {
    const value = event.target.value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    // Delay to allow click events to register on suggestions
    setTimeout(() => {
      this.isFocused.set(false);
    }, 200);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchChange.emit('');
  }

  selectRecent(item: string): void {
    this.searchTerm.set(item);
    this.searchSubmit.emit(item);
    this.moveRecentToTop(item);
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm.set(suggestion);
    this.searchSubmit.emit(suggestion);
    this.addRecentSearch(suggestion);
  }

  removeRecent(item: string): void {
    const current = this.recentSearches();
    this.recentSearches.set(current.filter(i => i !== item));
  }

  private addRecentSearch(term: string): void {
    if (!term.trim()) return;
    
    const current = this.recentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== term.toLowerCase());
    this.recentSearches.set([term, ...filtered].slice(0, 5)); // Keep only last 5
  }

  private moveRecentToTop(item: string): void {
    const current = this.recentSearches();
    const filtered = current.filter(i => i !== item);
    this.recentSearches.set([item, ...filtered]);
  }
}