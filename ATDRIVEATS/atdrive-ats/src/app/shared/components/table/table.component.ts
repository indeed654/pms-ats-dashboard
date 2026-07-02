import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <div class="table-header" *ngIf="showHeader">
        <div class="table-header-content">
          <h3 class="table-title">{{ title }}</h3>
          <div class="table-controls">
            <ng-content select="[slot=controls]"></ng-content>
          </div>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              @if (showCheckbox) {
                <th class="checkbox-cell">
                  <input 
                    type="checkbox" 
                    [checked]="allSelected"
                    (change)="toggleSelectAll($any($event.target))"
                    class="header-checkbox"
                  />
                </th>
              }
              @for (column of columns; track column.key) {
                <th 
                  class="table-header-cell"
                  [class.sortable]="column.sortable"
                  [class.sorted]="sortColumn() === column.key"
                  (click)="column.sortable && sort(column.key)"
                >
                  <div class="header-content">
                    <span>{{ column.header }}</span>
                    @if (column.sortable) {
                      <span class="sort-indicator">
                        @if (sortColumn() === column.key && sortOrder() === 'asc') {
                          ▲
                        } @else if (sortColumn() === column.key && sortOrder() === 'desc') {
                          ▼
                        } @else if (column.sortable) {
                          ◆
                        }
                      </span>
                    }
                  </div>
                </th>
              }
              @if (showActions) {
                <th class="actions-cell">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of data; track row.id || $index) {
              <tr 
                class="table-row"
                [class.selected]="isSelected(row)"
                (click)="onRowClick(row)"
              >
                @if (showCheckbox) {
                  <td class="checkbox-cell">
                    <input 
                      type="checkbox" 
                      [checked]="isSelected(row)"
                      (change)="toggleRowSelection(row, $any($event.target))"
                      class="row-checkbox"
                    />
                  </td>
                }
                @for (column of columns; track column.key) {
                  <td class="table-data-cell">
                    @if (column.template) {
                      <ng-container *ngTemplateOutlet="column.template; context: { $implicit: row[column.key], row: row }"></ng-container>
                    } @else {
                      {{ getNestedValue(row, column.key) }}
                    }
                  </td>
                }
                @if (showActions) {
                  <td class="actions-cell">
                    <div class="actions">
                      <ng-content select="[slot=actions]" [ngTemplateOutletContext]="{ row: row }"></ng-content>
                    </div>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [colSpan]="columns.length + (showCheckbox ? 1 : 0) + (showActions ? 1 : 0)" class="empty-cell">
                  <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h4 class="empty-title">{{ emptyTitle }}</h4>
                    <p class="empty-description">{{ emptyDescription }}</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      
      <div class="table-footer" *ngIf="showPagination">
        <div class="pagination-info">
          Showing {{ startIndex }}-{{ endIndex }} of {{ totalItems() }} results
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn"
            [disabled]="currentPage() <= 1"
            (click)="goToPage(currentPage() - 1)"
          >
            Previous
          </button>
          
          <div class="page-numbers">
            @for (page of pages; track page) {
              <button
                class="page-btn"
                [class.active]="page === currentPage()"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
          </div>
          
          <button 
            class="pagination-btn"
            [disabled]="currentPage() >= totalPages"
            (click)="goToPage(currentPage() + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      background-color: #f8fafc;
    }

    .table-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .table-controls {
      display: flex;
      gap: 0.5rem;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .table-header-cell {
      padding: 1rem 1rem;
      text-align: left;
      background-color: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
      color: #64748b;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-header-cell.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease;
    }

    .table-header-cell.sortable:hover {
      background-color: #f1f5f9;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .sort-indicator {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .table-header-cell.sorted {
      color: #2563eb;
    }

    .table-header-cell.sorted .sort-indicator {
      color: #2563eb;
    }

    .table-data-cell {
      padding: 1rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      font-size: 0.875rem;
    }

    .table-row {
      transition: background-color 0.2s ease;
      cursor: pointer;
    }

    .table-row:hover {
      background-color: #f8fafc;
    }

    .table-row.selected {
      background-color: #eff6ff;
    }

    .checkbox-cell {
      width: 1%;
      padding: 1rem;
      text-align: center;
    }

    .header-checkbox, .row-checkbox {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      accent-color: #2563eb;
    }

    .actions-cell {
      width: 1%;
      padding: 0.5rem 1rem;
      text-align: right;
      white-space: nowrap;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .empty-cell {
      padding: 3rem;
      text-align: center;
      border-bottom: none;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 3rem;
      color: #cbd5e1;
    }

    .empty-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      color: #64748b;
    }

    .empty-description {
      margin: 0;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .table-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f8fafc;
    }

    .pagination-info {
      color: #64748b;
      font-size: 0.875rem;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e1;
      background: white;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background-color: #f1f5f9;
      color: #475569;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .page-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      background: white;
      color: #64748b;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 36px;
    }

    .page-btn:hover {
      background-color: #f1f5f9;
      color: #475569;
    }

    .page-btn.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .table-header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .table-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .pagination-controls {
        align-self: center;
      }
    }
  `]
})
export class TableComponent {
  @Input({ required: true }) columns: Array<{
    key: string;
    header: string;
    sortable?: boolean;
    template?: any;
  }> = [];
  
  @Input({ required: true }) data: any[] = [];
  @Input() title = '';
  @Input() showHeader = true;
  @Input() showCheckbox = false;
  @Input() showActions = false;
  @Input() showPagination = false;
  @Input() pageSize = 10;
  @Input() emptyTitle = 'No records found';
  @Input() emptyDescription = 'There are no records matching your criteria.';
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<{ column: string; order: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();

  selectedRows: Set<any> = new Set();
  sortColumn = signal<string | null>(null);
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  totalItems = signal(0);

  constructor() {
    this.totalItems.set(this.data.length);
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.data.every(row => this.selectedRows.has(row));
  }

  get startIndex(): number {
    return (this.currentPage() - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage() * this.pageSize, this.totalItems());
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.pageSize);
  }

  get pages(): number[] {
    const pages = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage();
    
    // Show first page, last page, and a few around current page
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1); // ellipsis
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1); // ellipsis
      pages.push(totalPages);
    }
    
    return pages;
  }

  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  toggleRowSelection(row: any, checkbox: HTMLInputElement): void {
    if (checkbox.checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  toggleSelectAll(checkbox: HTMLInputElement): void {
    if (checkbox.checked) {
      this.data.forEach(row => this.selectedRows.add(row));
    } else {
      this.selectedRows.clear();
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  sort(column: string): void {
    if (this.sortColumn() === column) {
      // Toggle sort order if clicking the same column
      this.sortOrder.update((order: 'asc' | 'desc') => order === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      this.sortColumn.set(column);
      this.sortOrder.set('asc');
    }
    
    this.sortChange.emit({
      column: this.sortColumn()!,
      order: this.sortOrder()
    });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage()) return;
    
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}