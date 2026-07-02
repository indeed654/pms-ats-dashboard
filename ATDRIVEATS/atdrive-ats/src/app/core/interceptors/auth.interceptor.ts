import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthInterceptor - Intercepts HTTP requests and adds JWT token to headers
 * 
 * This ensures all API requests include the authentication token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>, 
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get token from auth service
    const token = this.authService.getToken();
    
    // Clone the request and add token header if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - token might be expired or invalid
          console.log('[AuthInterceptor] 401 Unauthorized - redirecting to login');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        
        if (error.status === 403) {
          // Forbidden - user doesn't have permission
          console.log('[AuthInterceptor] 403 Forbidden');
        }
        
        return throwError(() => error);
      })
    );
  }
}
