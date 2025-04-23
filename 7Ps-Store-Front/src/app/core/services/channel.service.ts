// src/app/core/services/channel.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private apiUrl = 'http://your-backend-url/api';

  constructor(private http: HttpClient) { }

  getAds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ads`);
  }

  getChannels(page: number, country?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (country) {
      params = params.set('country', country);
    }
    return this.http.get<any>(`${this.apiUrl}/channels`, { params });
  }

  // إضافة دالة searchChannels لدعم البحث
  searchChannels(query: string): Observable<any> {
    let params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.apiUrl}/channels/search`, { params });
  }
}
