import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel, ChannelResponse } from '../../models/channel.model';
import { environment } from '../../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = environment.apiUrl;
  private readonly arabCountriesUrl = `${this.apiUrl}/api/channels/arab-countries`;
  private readonly channelsUrl = `${this.apiUrl}/api/channels`;

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

  /**
   * Fetch channels with optional country and search filters
   * @param country Optional country filter
   * @param search Optional search term for channel name or frequency
   */
  getChannels(country?: string | null, search?: string | null): Observable<ChannelResponse> {
    let params = new HttpParams();

    if (country && country !== 'null' && country !== '') {
      params = params.set('country', country);
    }
    if (search && search !== 'null' && search !== '') {
      params = params.set('search', search);
    }

    return this.http.get<ChannelResponse>(this.channelsUrl, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  /**
   * Fetch list of Arab countries for filtering
   */
  getArabCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.arabCountriesUrl}`);
  }
}
