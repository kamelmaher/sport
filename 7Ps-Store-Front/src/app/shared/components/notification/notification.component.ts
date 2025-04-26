// notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div *ngFor="let notification of activeNotifications; let i = index"
           class="notification"
           [ngClass]="{
             'notification-success': notification.type === 'success',
             'notification-error': notification.type === 'error',
             'notification-info': notification.type === 'info'
           }">
        {{ notification.message }}
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      width: 300px;
    }
    .notification {
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 4px;
      color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .notification-success {
      background-color: #4caf50;
    }
    .notification-error {
      background-color: #f44336;
    }
    .notification-info {
      background-color: #2196f3;
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  activeNotifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      this.activeNotifications.push(notification);

      // Auto remove after timeout
      setTimeout(() => {
        this.activeNotifications = this.activeNotifications.filter(n => n !== notification);
      }, notification.timeout || 3000);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
