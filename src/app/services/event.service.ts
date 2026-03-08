import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Auth } from '@angular/fire/auth';

export interface EventPlan {
  id?: string;
  name: string;
  date: string;
  theme: string;
  location: string;
  host: string;
  userId?: string;
  description?: string;
  guestCount?: number;
  budget?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
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
   * Get all events for current user
   */
  getEvents(): Observable<EventPlan[]> {
    return this.firestore.getCollection<EventPlan>('events');
  }

  /**
   * Get a single event by ID
   */
  getEventById(id: string): Observable<EventPlan | undefined> {
    return this.firestore.getDocument<EventPlan>('events', id);
  }

  /**
   * Get events for current user
   */
  getUserEvents(): Observable<EventPlan[]> {
    if (!this.currentUserId) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.firestore.getDocumentsByField<EventPlan>('events', 'userId', this.currentUserId);
  }

  /**
   * Add a new event
   */
  addEvent(event: EventPlan) {
    const eventData: EventPlan = {
      ...event,
      userId: this.currentUserId || undefined,
    };
    return this.firestore.addDocument('events', eventData);
  }

  /**
   * Update an existing event
   */
  updateEvent(id: string, event: Partial<EventPlan>) {
    return this.firestore.updateDocument('events', id, event);
  }

  /**
   * Delete an event
   */
  deleteEvent(id: string) {
    return this.firestore.deleteDocument('events', id);
  }

  /**
   * Get events by theme
   */
  getEventsByTheme(theme: string): Observable<EventPlan[]> {
    return this.firestore.getDocumentsByField<EventPlan>('events', 'theme', theme);
  }
}
