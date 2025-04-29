// ads.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad } from '../../models/ads.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = `${environment.apiUrl}/api/ads`;

  constructor(private http: HttpClient) { }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const cleanToken = token ? token.replace(/^"(.*)"$/, '$1') : '';
    // console.log('Cleaned Authorization Token:', cleanToken);

    return new HttpHeaders({
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json'
    });
  }

  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createAd(adData: FormData): Observable<Ad> {
    return this.http.post<Ad>(this.apiUrl, adData, { headers: this.getAuthHeaders() });
  }

  updateAd(id: string, adData: Partial<Ad>): Observable<Ad> {
    return this.http.put<Ad>(`${this.apiUrl}/${id}`, adData, { headers: this.getAuthHeaders() });
  }

  deleteAd(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
