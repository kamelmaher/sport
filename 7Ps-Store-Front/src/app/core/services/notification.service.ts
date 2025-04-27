import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  constructor() { }

  success(message: string, timeout: number = 3000): void {
    this.notificationSubject.next({ message, type: 'success', timeout });
  }

  error(message: string, timeout: number = 5000): void {
    this.notificationSubject.next({ message, type: 'error', timeout });
  }

  info(message: string, timeout: number = 3000): void {
    this.notificationSubject.next({ message, type: 'info', timeout });
  }
}
