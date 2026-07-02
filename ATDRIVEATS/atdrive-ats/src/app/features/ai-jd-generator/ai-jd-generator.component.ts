import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AiJdService, JobDescriptionInput } from './ai-jd.service';

@Component({
  selector: 'app-ai-jd-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="jd-generator-container">
      <h1 class="page-title">AI Job Description Generator</h1>
      <p class="page-subtitle">Create professional job descriptions powered by AI in seconds</p>
      
      <div class="generator-grid">
        <!-- LEFT COLUMN: INPUT PANEL -->
        <div class="input-panel">
          <div class="panel-card">
            <h2 class="panel-title">Job Details</h2>
            
            <form [formGroup]="jdForm" (ngSubmit)="onGenerate()" class="jd-form">
              <!-- Job Title -->
              <div class="form-group">
                <label for="jobTitle" class="form-label">Job Title *</label>
                <input
                  id="jobTitle"
                  type="text"
                  formControlName="jobTitle"
                  class="form-control"
                  placeholder="e.g. Senior Software Engineer"
                />
                @if (jdForm.get('jobTitle')?.invalid && jdForm.get('jobTitle')?.touched) {
                  <span class="error-message">Job title is required</span>
                }
              </div>
              
              <!-- Department -->
              <div class="form-group">
                <label for="department" class="form-label">Department</label>
                <select
                  id="department"
                  formControlName="department"
                  class="form-control"
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Design">Design</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>
              
              <!-- Experience Level -->
              <div class="form-group">
                <label for="experienceLevel" class="form-label">Experience Level</label>
                <select
                  id="experienceLevel"
                  formControlName="experienceLevel"
                  class="form-control"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
              
              <!-- Employment Type -->
              <div class="form-group">
                <label for="employmentType" class="form-label">Employment Type</label>
                <select
                  id="employmentType"
                  formControlName="employmentType"
                  class="form-control"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <!-- Skills -->
              <div class="form-group">
                <label for="skills" class="form-label">Skills (comma separated)</label>
                <input
                  id="skills"
                  type="text"
                  formControlName="skills"
                  class="form-control"
                  placeholder="e.g. JavaScript, React, Node.js"
                />
                <small class="form-hint">Separate skills with commas</small>
              </div>
              
              <!-- Location -->
              <div class="form-group">
                <label for="location" class="form-label">Location</label>
                <select
                  id="location"
                  formControlName="location"
                  class="form-control"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
              
              <!-- Tone Selector -->
              <div class="form-group">
                <label for="tone" class="form-label">Tone</label>
                <select
                  id="tone"
                  formControlName="tone"
                  class="form-control"
                >
                  <option value="Professional">Professional</option>
                  <option value="Startup">Startup</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Friendly">Friendly</option>
                </select>
              </div>
              
              <!-- Generate Button -->
              <button
                type="submit"
                class="btn btn-primary generate-btn"
                [disabled]="jdForm.invalid || isGenerating()"
              >
                @if (isGenerating()) {
                  <span class="loading-spinner"></span>
                  <span>Generating...</span>
                } @else {
                  <span>🤖 Generate JD</span>
                }
              </button>
            </form>
          </div>
        </div>
        
        <!-- RIGHT COLUMN: OUTPUT PANEL -->
        <div class="output-panel">
          <div class="panel-card">
            <div class="output-header">
              <h2 class="panel-title">Generated Job Description</h2>
              @if (generatedJd()) {
                <div class="output-actions">
                  <button
                    class="btn btn-secondary"
                    (click)="copyToClipboard()"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  <button
                    class="btn btn-secondary"
                    (click)="saveJd()"
                    title="Save job description"
                  >
                    💾 Save
                  </button>
                  <button
                    class="btn btn-secondary"
                    (click)="exportAsText()"
                    title="Export as text"
                  >
                    📄 Export
                  </button>
                </div>
              }
            </div>
            
            @if (generatedJd()) {
              <div class="jd-output">
                <pre class="jd-content"><code>{{ generatedJd() }}</code></pre>
              </div>
            } @else {
              <div class="jd-placeholder">
                <div class="placeholder-icon">📝</div>
                <h3>Your AI-generated job description will appear here</h3>
                <p>Fill out the form on the left and click "Generate JD" to create a professional job description</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jd-generator-container {
      padding: 2rem;
      background-color: #f8fafc;
      min-height: calc(100vh - 120px);
    }
    
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .page-subtitle {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 2rem;
    }
    
    .generator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      height: calc(100vh - 200px);
    }
    
    .panel-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .panel-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .jd-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      flex: 1;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-label {
      font-weight: 500;
      color: #334155;
      font-size: 0.875rem;
    }
    
    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #f15a24;
      box-shadow: 0 0 0 2px rgba(241, 90, 36, 0.2);
    }
    
    .form-hint {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    
    .btn {
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #f15a24, #ff7a45);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(241, 90, 36, 0.4);
      transform: translateY(-1px);
    }
    
    .btn-primary:active:not(:disabled) {
      transform: scale(0.97);
      box-shadow: 0 4px 8px rgba(241, 90, 36, 0.3);
    }
    
    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
    }
    
    .btn-secondary:hover {
      background: #e2e8f0;
      color: #334155;
    }
    
    .generate-btn {
      margin-top: auto;
      padding: 1rem;
      font-size: 1rem;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .output-actions {
      display: flex;
      gap: 0.5rem;
    }
    
    .jd-output {
      flex: 1;
      overflow-y: auto;
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
    }
    
    .jd-content {
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      color: #334155;
      white-space: pre-wrap;
      margin: 0;
    }
    
    .jd-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 100%;
      color: #94a3b8;
      flex: 1;
    }
    
    .placeholder-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .jd-placeholder h3 {
      font-size: 1.125rem;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 0.5rem 0;
    }
    
    .jd-placeholder p {
      font-size: 0.875rem;
      margin: 0;
      max-width: 300px;
    }
    
    @media (max-width: 1024px) {
      .generator-grid {
        grid-template-columns: 1fr;
        height: auto;
      }
    }
  `]
})
export class AiJdGeneratorComponent {
  jdForm: FormGroup;
  isGenerating = signal(false);
  generatedJd = signal('');
  
  constructor(
    private fb: FormBuilder,
    private aiJdService: AiJdService,
    private router: Router
  ) {
    this.jdForm = this.fb.group({
      jobTitle: ['', Validators.required],
      department: [''],
      experienceLevel: ['Mid'],
      employmentType: ['Full-time'],
      skills: [''],
      location: ['Remote'],
      tone: ['Professional']
    });
  }
  
  onGenerate(): void {
    if (this.jdForm.valid) {
      this.isGenerating.set(true);
      
      // Simulate AI processing time
      setTimeout(() => {
        const formData = this.jdForm.value;
        
        // Parse skills from comma-separated string
        const skillsArray = formData.skills 
          ? formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : [];
          
        const input: JobDescriptionInput = {
          jobTitle: formData.jobTitle,
          department: formData.department || 'Technology',
          experienceLevel: formData.experienceLevel,
          employmentType: formData.employmentType,
          skills: skillsArray,
          location: formData.location,
          tone: formData.tone
        };
        
        const generated = this.aiJdService.generateJobDescription(input);
        this.generatedJd.set(generated);
        this.isGenerating.set(false);
      }, 1500); // Simulate AI processing time
    } else {
      this.jdForm.markAllAsTouched();
    }
  }
  
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.generatedJd()).then(() => {
      // Show feedback that text was copied
      console.log('Job description copied to clipboard');
      // In a real app, you'd show a toast notification
    });
  }
  
  saveJd(): void {
    // Simulate saving functionality
    console.log('Job description saved');
    // In a real app, you'd save to a backend
  }
  
  exportAsText(): void {
    // Simulate export functionality
    const blob = new Blob([this.generatedJd()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-description-${this.jdForm.get('jobTitle')?.value || 'untitled'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('Job description exported');
  }
}