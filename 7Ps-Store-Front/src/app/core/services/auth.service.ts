import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { env } from 'process';
import { AuthResponse } from '../../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/users/login`;
  private readonly usersUrl = `${environment.apiUrl}/api/users`;
  constructor(private http: HttpClient, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

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
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  isAdmin(): boolean {
    const role: any = localStorage.getItem('role');
    // console.log('Role:', role);
    // console.log('Role parsed:', JSON.parse(role));
    return role == '"admin"';
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const cleanToken = token ? token.replace(/^"(.*)"$/, '$1') : '';
    // console.log('Cleaned Authorization Token:', cleanToken);

    return new HttpHeaders({
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json'
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.usersUrl, { headers: this.getAuthHeaders() });
  }

  getPendingUsers(): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/pending`, { headers: this.getAuthHeaders() });
  }

  getUserById(id: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.usersUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: AuthResponse): Observable<any> {
    return this.http.post<any>(this.usersUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, user: Partial<AuthResponse>): Observable<any> {
    return this.http.put<any>(`${this.usersUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.usersUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}


