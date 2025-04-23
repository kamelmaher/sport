import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4800/api/auth'; // Update with your API URL
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage if available
    // const user = localStorage.getItem('currentUser');
    // if (user) {
    //   this.currentUserSubject.next(JSON.parse(user));
    // }
  }

  //   // Login with username and phone
  //   login(username: string, phone: string): Observable<any> {
  //     return this.http.post(`${this.apiUrl}/login`, { username, phone }).pipe(
  //       tap(user => {
  //         // Store user details and jwt token in local storage
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //       }),
  //       catchError(error => {
  //         console.error('Login error:', error);
  //         throw error;
  //       })
  //     );
  //   }

  //   // Logout the user
  //   logout(): void {
  //     // Remove user from local storage and set current user to null
  //     localStorage.removeItem('currentUser');
  //     this.currentUserSubject.next(null);
  //     this.router.navigate(['/login']);
  //   }

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

}
