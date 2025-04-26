import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Match } from '../../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly apiUrl = `${environment.apiUrl}/api/matches`;
  private matchesSubject = new BehaviorSubject<Match | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  getMatches(): Observable<Match> {
    console.log('Fetching matches from:', this.apiUrl);
    return this.http.get<Match>(this.apiUrl).pipe(
      tap(matches => {
        console.log('Received matches:', matches);
        this.matchesSubject.next(matches);
      }),
      catchError(error => {
        console.error('Error fetching matches:', error);
        return of({ 
          date: { 
            en: { 
              day: '', 
              month: '', 
              year: '' 
            } 
          }, 
          competitions: [] 
        });
      })
    );
  }

  getCurrentMatches(): Observable<Match | null> {
    return this.matchesSubject.asObservable();
  }
}