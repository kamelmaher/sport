// ads.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ad } from '../../models/ads.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdsService {
  private apiUrl = `${environment.apiUrl}/api/ads`;

  constructor(private http: HttpClient) { }

  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl);
  }

  createAd(adData: FormData): Observable<Ad> {
    return this.http.post<Ad>(this.apiUrl, adData);
  }

  updateAd(id: string, adData: Partial<Ad>): Observable<Ad> {
    return this.http.put<Ad>(`${this.apiUrl}/${id}`, adData);
  }

  deleteAd(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
