import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @if (notification) {
        <div class="alert alert-info alert-dismissible fade show" role="alert">
          {{ notification }}
          <button type="button" class="btn-close" (click)="clearNotification()" aria-label="Close"></button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notification: string | null = null;
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      message => {
        this.notification = message;
        // Auto-clear notification after 5 seconds
        setTimeout(() => this.clearNotification(), 5000);
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearNotification() {
    this.notification = null;
  }
}
