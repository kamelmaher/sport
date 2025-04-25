import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { env } from 'process';
import { AuthResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/users/login`;

  constructor(private http: HttpClient, private router: Router) {

  }

  // Login with username and phone
  login(userName: string, phone: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Accept-Language', 'ar'); // إضافة قبول اللغة العربية

    return this.http.post<any>(this.apiUrl, { userName, phone }, { headers })
      .pipe(
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role: any = localStorage.getItem('role');
    console.log('Role:', role);
    console.log('Role parsed:', JSON.parse(role));
    return role == '"admin"';
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('token');
    // this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
//   // Check if user is logged in
//   isLoggedIn(): boolean {
//     return this.currentUserSubject.value !== null;
//   }

//   // Check if user is admin
//   isAdmin(): boolean {
//     const user = this.currentUserSubject.value;
//     return user ? user.isAdmin : false;
//   }

//   // Get current user
//   getCurrentUser(): any | null {
//     return this.currentUserSubject.value;
//   }

//   // Check authentication status (for route guards)
//   checkAuthStatus(): Observable<boolean> {
//     const user = this.currentUserSubject.value;
//     if (user) {
//       return of(true);
//     } else {
//       // Optionally: verify token with backend
//       return of(false);
//     }
//   }

//   // Register new user
//   register(userData: { username: string; phone: string }): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
//       tap(user => {
//         // Auto-login after registration if desired
//         // this.login(user.username, user.phone).subscribe();
//       })
//     );
//   }

//   // Update user profile
//   updateProfile(userId: string, updateData: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/users/${userId}`, updateData).pipe(
//       tap(updatedUser => {
//         if (this.currentUserSubject.value?._id === updatedUser._id) {
//           localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//           this.currentUserSubject.next(updatedUser);
//         }
//       })
//     );
//   }
// }

// }

