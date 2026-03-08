import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationsService, Notification } from '../services/notifications.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  // Notification preferences
  emailUpdates = true;
  smsUpdates = false;
  otpAlerts = true;
  orderUpdates = true;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all notifications from Firestore
   */
  loadNotifications() {
    this.loading = true;
    this.error = '';

    this.notificationsService
      .getAllNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (notifications) => {
          this.notifications = notifications.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Most recent first
          });
          this.updateUnreadCount();
          this.loading = false;
          console.log('Notifications loaded:', this.notifications);
        },
        (error) => {
          console.error('Error loading notifications:', error);
          this.error = 'Failed to load notifications. Please try again.';
          this.loading = false;
        }
      );
  }

  /**
   * Update unread count
   */
  updateUnreadCount() {
    this.unreadCount = this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string | undefined) {
    if (!notificationId) {
      return;
    }

    try {
      await this.notificationsService.markAsRead(notificationId);
      const notif = this.notifications.find((n) => n.id === notificationId);
      if (notif) {
        notif.read = true;
        this.updateUnreadCount();
      }
      console.log('Notification marked as read:', notificationId);
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      this.error = 'Failed to update notification.';
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      await this.notificationsService.markAllAsRead();
      this.notifications.forEach((n) => {
        n.read = true;
      });
      this.updateUnreadCount();
      console.log('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      this.error = 'Failed to mark all as read.';
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string | undefined) {
    if (!notificationId) {
      return;
    }

    try {
      await this.notificationsService.deleteNotification(notificationId);
      this.notifications = this.notifications.filter((n) => n.id !== notificationId);
      this.updateUnreadCount();
      console.log('Notification deleted:', notificationId);
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      this.error = 'Failed to delete notification.';
    }
  }

  /**
   * Get notification badge class
   */
  getNotificationClass(notification: Notification): string {
    if (notification.read) {
      return 'notification-read';
    }
    return `notification-${notification.type}`;
  }

  /**
   * Get icon for notification type
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '●';
    }
  }
}
