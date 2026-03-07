import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

export interface EventPlan {
  id?: string;
  name: string;
  date: string;
  theme: string;
  location: string;
  host: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private store: FirestoreService) {}

  getEvents(): Observable<EventPlan[]> {
    return this.store.getCollection<EventPlan>('events');
  }

  addEvent(event: EventPlan) {
    return this.store.addDocument('events', event);
  }
}
