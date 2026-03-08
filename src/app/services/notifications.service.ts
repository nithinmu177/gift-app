import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  actionUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private currentUserId: string | null = null;

  constructor(
    private firestore: FirestoreService,
    @Optional() private auth: Auth | null
  ) {
    this.updateCurrentUserId();
  }

  /**
   * Update current user ID from auth
   */
  private updateCurrentUserId() {
    if (this.auth?.currentUser) {
      this.currentUserId = this.auth.currentUser.uid;
    }
  }

  /**
   * Get all unread notifications for current user
   */
  getUnreadNotifications(): Observable<Notification[]> {
    if (!this.currentUserId) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.firestore.getDocumentsByField<Notification>(
      'notifications',
      'userId',
      this.currentUserId
    );
  }

  /**
   * Get all notifications for current user
   */
  getAllNotifications(): Observable<Notification[]> {
    if (!this.currentUserId) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.firestore.getDocumentsByField<Notification>(
      'notifications',
      'userId',
      this.currentUserId
    );
  }

  /**
   * Create a new notification
   */
  async createNotification(
    title: string,
    message: string,
    type: Notification['type'],
    actionUrl?: string
  ): Promise<any> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    const notification: Notification = {
      userId: this.currentUserId,
      title,
      message,
      type,
      read: false,
      actionUrl,
    };

    return this.firestore.addDocument('notifications', notification);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string) {
    return this.firestore.updateDocument('notifications', id, { read: true });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    if (!this.currentUserId) {
      return;
    }

    const notifications = await this.firestore.getDocumentsByQuery<Notification>(
      'notifications',
      []
    );
    const userNotifications = notifications.filter((n) => n.userId === this.currentUserId);

    for (const notification of userNotifications) {
      if (!notification.read && notification.id) {
        await this.markAsRead(notification.id);
      }
    }
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: string) {
    return this.firestore.deleteDocument('notifications', id);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    if (!this.currentUserId) {
      return 0;
    }

    const notifications = await this.firestore.getDocumentsByQuery<Notification>(
      'notifications',
      []
    );
    return notifications.filter((n) => n.userId === this.currentUserId && !n.read).length;
  }
}
