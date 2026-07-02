import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole, ROLE_DASHBOARDS } from '../../../core/models/role.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-container">
            <div class="login-logo">
              <span class="logo-icon">💼</span>
            </div>
          </div>
          <h1 class="welcome-text">Welcome Back</h1>
          <p class="subtitle">Sign in to your enterprise hiring platform</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Email Field -->
          <div class="input-group">
            <label for="email" class="input-label">Email Address</label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input-field"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                placeholder=" "
                autocomplete="email"
              />
              <span class="input-placeholder">Enter your email</span>
            </div>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <span class="error-message">{{ getEmailErrorMessage() }}</span>
            }
          </div>
          
          <!-- Password Field -->
          <div class="input-group">
            <label for="password" class="input-label">Password</label>
            <div class="input-wrapper">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                class="input-field"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder=" "
                autocomplete="current-password"
              />
              <span class="input-placeholder">Enter your password</span>
              <button
                type="button"
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                [title]="showPassword() ? 'Hide password' : 'Show password'"
              >
                <svg 
                  class="password-icon" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  @if (showPassword()) {
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  } @else {
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  }
                </svg>
              </button>
            </div>
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="error-message">{{ getPasswordErrorMessage() }}</span>
            }
          </div>
          
          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span>Keep me signed in</span>
            </label>
            <button type="button" class="forgot-password-link" (click)="onForgotPassword()">
              Forgot password?
            </button>
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            class="login-button"
            [disabled]="loginForm.invalid || isLoading()"
            [class.loading]="isLoading()"
          >
            @if (isLoading()) {
              <div class="button-content">
                <span class="loading-spinner"></span>
                <span>Signing In...</span>
              </div>
            } @else {
              <div class="button-content">
                <span>Sign In</span>
              </div>
            }
          </button>
          
          <!-- Error Message -->
          @if (errorMessage()) {
            <div class="error-banner">
              <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }
          
          <!-- Success Message -->
          @if (successMessage()) {
            <div class="success-banner">
              <svg class="success-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9812C18.7182 19.7077 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1117 8.53447 21.3449C6.51168 20.5781 4.78465 19.1717 3.61096 17.3386C2.43727 15.5056 1.87979 13.358 2.02168 11.2058C2.16356 9.05362 2.99721 7.01485 4.39828 5.3847C5.79935 3.75455 7.69279 2.62125 9.75736 2.14893C11.8219 1.67661 13.9445 1.88878 15.76 2.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ successMessage() }}</span>
            </div>
          }
        </form>
        
        <div class="login-footer">
          <p>Don't have an account? <button class="signup-link" (click)="onSignUp()">Contact Sales</button></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 1rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 14px;
      padding: 3rem 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      margin: 1rem;
      border: 1px solid #e2e8f0;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .login-logo {
      width: 72px;
      height: 72px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
    }

    .logo-icon {
      font-size: 2rem;
      color: white;
      font-weight: 700;
    }

    .welcome-text {
      margin: 0 0 0.5rem 0;
      font-size: 1.875rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }

    .subtitle {
      margin: 0;
      color: #64748b;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      color: #374151;
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
      line-height: 1.5;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      color: #111827;
      font-size: 1rem;
      transition: all 0.2s ease;
      position: relative;
      z-index: 1;
      line-height: 1.5;
      height: 48px;
    }

    .input-placeholder {
      position: absolute;
      left: 1.25rem;
      top: 1.25rem;
      color: #9ca3af;
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.2s ease;
      z-index: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .input-field:focus,
    .input-field:not(:placeholder-shown) {
      padding-top: 1.5rem;
      padding-bottom: 0.5rem;
    }

    .input-field:focus + .input-placeholder,
    .input-field:not(:placeholder-shown) + .input-placeholder {
      top: 0.5rem;
      font-size: 0.85rem;
      color: #6b7280;
      font-weight: 500;
    }

    .input-field:focus {
      outline: none;
      border-color: #2563eb;
      background: white;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }

    .input-field:focus + .input-placeholder {
      color: #2563eb;
    }

    .input-field.error {
      border-color: #dc2626;
    }

    .input-field.error:focus {
      border-color: #dc2626;
      background: white;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      z-index: 2;
    }

    .password-toggle:hover {
      color: #4b5563;
      background: #f9fafb;
    }

    .password-icon {
      width: 20px;
      height: 20px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0.5rem 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      color: #374151;
      font-size: 0.95rem;
      cursor: pointer;
      gap: 0.5rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
    }

    .checkbox-input {
      opacity: 0;
      position: absolute;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      position: relative;
      background: white;
    }

    .checkbox-input:checked + .checkbox-custom {
      background: #2563eb;
      border-color: #2563eb;
    }

    .checkbox-input:checked + .checkbox-custom::after {
      content: '✓';
      color: white;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .forgot-password-link {
      color: #4f46e5;
      text-decoration: none;
      font-size: 0.95rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0;
      transition: color 0.2s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
    }

    .forgot-password-link:hover {
      color: #3730a3;
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.01em;
      height: 52px;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4), 0 10px 10px -5px rgba(37, 99, 235, 0.2);
    }

    .login-button:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 5px 10px rgba(37, 99, 235, 0.3);
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .login-button.loading {
      pointer-events: none;
    }

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
    }

    .error-banner {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #dc2626;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
    }

    .success-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: #16a34a;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
    }

    .error-icon,
    .success-icon {
      flex-shrink: 0;
    }

    .login-footer {
      text-align: center;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .login-footer p {
      margin: 0;
      color: #6b7280;
      font-size: 0.95rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .signup-link {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0;
      transition: color 0.2s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .signup-link:hover {
      color: #3730a3;
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-card {
        margin: 0.5rem;
        padding: 2rem 1.5rem;
      }
      
      .welcome-text {
        font-size: 1.5rem;
      }
      
      .login-logo {
        width: 64px;
        height: 64px;
      }
      
      .logo-icon {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  
  private returnUrl: string = '/app/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to admin dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app/admin/dashboard';
    
    // Check if user is already logged in
    if (this.authService.getCurrentAuthStatus()) {
      const dashboardRoute = this.authService.getDashboardRoute();
      this.router.navigate([dashboardRoute], { replaceUrl: true });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      
      const { email, password } = this.loginForm.value;
      
      console.log('[LoginComponent] Submitting login for:', email);
      
      this.authService.login(email, password).subscribe({
        next: (success: boolean) => {
          this.isLoading.set(false);
          console.log('[LoginComponent] Login result:', success);
          
          if (success) {
            // Auth state is already updated in AuthService.login()
            // Navigate immediately - no setTimeout
            const dashboardRoute = this.authService.getDashboardRoute();
            console.log('[LoginComponent] Navigating to:', dashboardRoute);
            
            this.router.navigate([dashboardRoute], { replaceUrl: true });
          } else {
            this.errorMessage.set('Invalid credentials. Please try again.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('An error occurred during login. Please try again.');
          console.error('Login error:', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  onForgotPassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('Password reset instructions sent to your email.');
    console.log('Forgot password clicked');
  }

  onSignUp(): void {
    this.errorMessage.set('');
    this.successMessage.set('Contact sales team at sales@atdrive.com');
    console.log('Sign up clicked');
  }
}
