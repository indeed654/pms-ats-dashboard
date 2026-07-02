import { Component, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { CandidatesStore } from '../../core/services/candidates.store';
import { JobsStore } from '../../core/services/jobs.store';
import { InterviewsStore } from '../../core/services/interviews.store';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CardComponent],
  animations: [
    trigger('enter', [
      transition(':enter', [
        style({ transform: 'translateY(12px)' }),
        animate('300ms cubic-bezier(0.22,1,0.36,1)', style({ transform: 'none' }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        query('.kpi-card', [
          style({ transform: 'translateY(10px)' }),
          stagger(80, animate('250ms ease-out', style({ transform: 'none' })))
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Executive Dashboard</h1>
        <div class="header-actions">
          <button class="btn btn-refresh" (click)="refreshData()" [disabled]="loading()">
            <span *ngIf="!loadingService.isLoading('dashboard-refresh')">Refresh</span>
            <span *ngIf="loadingService.isLoading('dashboard-refresh')">Refreshing...</span>
          </button>
          <button class="btn btn-export" (click)="exportReport()">
            <span>Export Report</span>
          </button>
        </div>
      </div>
      
      <div class="kpi-grid">
        <div class="kpi-card clickable" (click)="navigateTo('/app/jobs')">
          <h3>Total Jobs</h3>
          <div class="kpi-value">{{ jobsStore.jobsList().length }}</div>
        </div>
        <div class="kpi-card clickable" (click)="navigateTo('/app/candidates')">
          <h3>Active Candidates</h3>
          <div class="kpi-value">{{ candidatesStore.candidatesList().length }}</div>
        </div>
        <div class="kpi-card clickable" (click)="navigateTo('/app/interviews')">
          <h3>Interviews</h3>
          <div class="kpi-value">{{ interviewsStore.interviewsList().length }}</div>
        </div>
        <div class="kpi-card clickable" (click)="navigateTo('/app/reports')">
          <h3>Offers Sent</h3>
          <div class="kpi-value">{{ candidatesStore.hiredCount() }}</div>
        </div>
      </div>
      
      <div class="chart-grid">
        <div class="chart-container">
          <canvas baseChart
            [data]="lineChartData()"
            [options]="lineChartOptions"
            [type]="lineChartType">
          </canvas>
        </div>
        <div class="chart-container">
          <canvas baseChart
            [data]="doughnutChartData()"
            [options]="doughnutChartOptions"
            [type]="doughnutChartType">
          </canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* PROFESSIONAL DASHBOARD RESET - IMMUNE TO GLOBAL STYLES */
    .dashboard-container {
      /* Force solid background */
      background: #f8fafc !important;
      color: #1e293b !important;
      
      /* Remove any inherited opacity */
      opacity: 1 !important;
      
      /* Remove any filters */
      filter: none !important;
      
      /* Remove backdrop effects */
      backdrop-filter: none !important;
      
      /* Ensure proper stacking context */
      isolation: isolate;
      
      padding: 1.5rem;
      min-height: calc(100vh - 120px);
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }
    
    .dashboard-title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
    }
    
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      
      /* Reset any inherited transparency */
      opacity: 1 !important;
      filter: none !important;
      backdrop-filter: none !important;
    }
    
    .btn-refresh {
      background: #e2e8f0;
      color: #475569;
    }
    
    .btn-refresh:hover:not(:disabled) {
      background: #cbd5e1;
    }
    
    .btn-export {
      background: #3b82f6;
      color: white;
    }
    
    .btn-export:hover:not(:disabled) {
      background: #2563eb;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .kpi-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      text-align: center;
      transition: all 0.2s ease;
      cursor: pointer;
      
      /* Reset transparency effects */
      opacity: 1 !important;
      filter: none !important;
      backdrop-filter: none !important;
    }
    
    .kpi-card.clickable:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border: 2px solid #3b82f6;
    }
    
    .kpi-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
      margin-top: 0.5rem;
    }
    
    .chart-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    
    .chart-container {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      height: 300px;
      
      /* Reset transparency effects */
      opacity: 1 !important;
      filter: none !important;
      backdrop-filter: none !important;
    }
    
    /* Ensure chart canvas is not affected by global styles */
    .chart-container canvas {
      opacity: 1 !important;
      filter: none !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = signal(false);
  user = signal({
    firstName: 'Admin',
    lastName: 'User',
    email: '',
    role: 'admin'
  });

  get totalJobs() { return this.jobsStore.jobsList; }
  get totalCandidates() { return this.candidatesStore.candidatesList; }
  get totalInterviews() { return this.interviewsStore.interviewsList; }
  
  activeJobsCount = computed(() => this.jobsStore.activeJobs());
  totalApplicantsCount = computed(() => this.jobsStore.totalApplicants());
  scheduledInterviewsCount = computed(() => this.interviewsStore.scheduledCount());
  completedInterviewsCount = computed(() => this.interviewsStore.completedCount());

  constructor(
    private router: Router,
    private auth: AuthService,
    public candidatesStore: CandidatesStore,
    public jobsStore: JobsStore,
    public interviewsStore: InterviewsStore,
    public loadingService: LoadingService
  ) {
    effect(() => {
      const u = this.auth.getCurrentUser();
      if (u) this.user.set(u);
    });
  }

  ngOnInit() {
    // Redirect to role-specific dashboard
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      const role = currentUser.role;
      let redirectRoute = '/app/admin/dashboard';
      
      switch (role) {
        case 'admin':
          redirectRoute = '/app/admin/dashboard';
          break;
        case 'recruiter':
          redirectRoute = '/app/recruiter/dashboard';
          break;
        case 'interviewer':
          redirectRoute = '/app/interviewer/dashboard';
          break;
        case 'candidate':
          redirectRoute = '/app/candidate/dashboard';
          break;
        default:
          redirectRoute = '/app/admin/dashboard';
      }
      
      // Only redirect if we're not already on the correct dashboard
      const currentUrl = this.router.url;
      if (!currentUrl.includes(redirectRoute)) {
        console.log('[DashboardComponent] Redirecting to role-specific dashboard:', redirectRoute);
        this.router.navigate([redirectRoute]);
        return;
      }
    }
    
    this.refreshData();
  }

  lineChartType: ChartType = 'line';
  doughnutChartType: ChartType = 'doughnut';
  barChartType: ChartType = 'bar';

  lineChartData = computed<ChartConfiguration['data']>(() => ({
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
    datasets: [
      {
        label: 'Applications',
        data: [
          this.candidatesStore.candidatesList().length - 45,
          this.candidatesStore.candidatesList().length - 38,
          this.candidatesStore.candidatesList().length - 30,
          this.candidatesStore.candidatesList().length - 25,
          this.candidatesStore.candidatesList().length - 10,
          this.candidatesStore.candidatesList().length - 5,
          this.candidatesStore.candidatesList().length
        ],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,.15)',
        tension: 0.35,
        borderWidth: 3,
        fill: true
      },
      {
        label: 'Hires',
        data: [
          this.candidatesStore.hiredCount() - 8,
          this.candidatesStore.hiredCount() - 6,
          this.candidatesStore.hiredCount() - 4,
          this.candidatesStore.hiredCount() - 3,
          this.candidatesStore.hiredCount() - 2,
          this.candidatesStore.hiredCount() - 1,
          this.candidatesStore.hiredCount()
        ],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,.15)',
        tension: 0.35,
        borderWidth: 3,
        fill: true
      }
    ]
  }));

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#0f172a', font: { weight: 'bold' } } }
    },
    scales: {
      x: { ticks: { color: '#334155' }, grid: { display: false } },
      y: { ticks: { color: '#334155' }, grid: { color: '#e2e8f0' } }
    }
  };

  doughnutChartData = computed<ChartConfiguration['data']>(() => ({
    labels: ['New','Interview','Offer','Hired'],
    datasets: [{
      data: [
        this.candidatesStore.candidatesList().filter(c => c.status === 'applied').length,
        this.candidatesStore.interviewCount(),
        this.candidatesStore.shortlistedCount(),
        this.candidatesStore.hiredCount()
      ],
      backgroundColor: ['#3b82f6','#f59e0b','#10b981','#22c55e'],
      borderWidth: 0
    }]
  }));

  doughnutChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: { position: 'bottom', labels: { color: '#0f172a' } }
    }
  };

  refreshData() {
    this.loadingService.startLoading('dashboard-refresh');
    this.loading.set(true);
    
    // Simulate data refresh with some randomness
    setTimeout(() => {
      // Add a new candidate occasionally
      if (Math.random() > 0.7) {
        this.candidatesStore.addCandidate({
          name: `New Candidate ${Math.floor(Math.random() * 100)}`,
          email: `new${Math.floor(Math.random() * 1000)}@example.com`,
          phone: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
          position: ['Frontend Developer', 'Backend Engineer', 'Product Manager'][Math.floor(Math.random() * 3)],
          status: 'applied',
          experience: Math.floor(Math.random() * 10) + 1,
          skills: ['JavaScript', 'TypeScript', 'Angular'].slice(0, Math.floor(Math.random() * 3) + 1),
          appliedDate: new Date(),
          source: ['linkedin', 'referral', 'career_page'][Math.floor(Math.random() * 3)] as any
        });
      }
      
      // Update some job applicant counts
      this.jobsStore.jobsList().forEach(job => {
        if (Math.random() > 0.8) {
          this.jobsStore.incrementApplicants(job.id);
        }
      });
      
      this.loading.set(false);
      this.loadingService.stopLoading('dashboard-refresh');
      console.log('✅ Dashboard refreshed with new data');
    }, 1200);
  }

  exportReport() {
    const blob = new Blob(
      [`Dashboard Export\nGenerated: ${new Date().toLocaleString()}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    console.log('📤 Report exported');
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}