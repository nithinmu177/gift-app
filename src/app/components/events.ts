import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService, EventPlan } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class EventsComponent implements OnInit, OnDestroy {
  events: EventPlan[] = [];
  loading = false;
  error = '';
  showForm = false;
  private destroy$ = new Subject<void>();

  newEvent: EventPlan = {
    name: '',
    date: '',
    theme: '',
    location: '',
    host: '',
    description: '',
    guestCount: 0,
    budget: 0,
  };

  constructor(
    private eventService: EventService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load events from Firestore
   */
  loadEvents() {
    this.loading = true;
    this.error = '';
    
    this.eventService
      .getUserEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (events) => {
          this.events = events;
          this.loading = false;
          console.log('Events loaded:', this.events);
        },
        (error) => {
          console.error('Error loading events:', error);
          this.error = 'Failed to load events. Please try again.';
          this.loading = false;
        }
      );
  }

  /**
   * Add a new event to Firestore
   */
  async addEvent() {
    if (!this.newEvent.name || !this.newEvent.date) {
      this.error = 'Please fill in event name and date.';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const result = await this.eventService.addEvent(this.newEvent);
      console.log('Event created:', result.id);
      
      // Reset form
      this.newEvent = {
        name: '',
        date: '',
        theme: '',
        location: '',
        host: '',
        description: '',
        guestCount: 0,
        budget: 0,
      };
      this.showForm = false;
      
      // Reload events
      this.loadEvents();
    } catch (error: any) {
      console.error('Error creating event:', error);
      this.error = 'Failed to create event. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(eventId: string | undefined, updatedData: Partial<EventPlan>) {
    if (!eventId) {
      this.error = 'Event ID is missing.';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.eventService.updateEvent(eventId, updatedData);
      console.log('Event updated:', eventId);
      this.loadEvents();
    } catch (error: any) {
      console.error('Error updating event:', error);
      this.error = 'Failed to update event. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Delete an event from Firestore
   */
  async removeEvent(eventId: string | undefined) {
    if (!eventId) {
      this.error = 'Event ID is missing.';
      return;
    }

    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.eventService.deleteEvent(eventId);
      console.log('Event deleted:', eventId);
      this.events = this.events.filter((e) => e.id !== eventId);
    } catch (error: any) {
      console.error('Error deleting event:', error);
      this.error = 'Failed to delete event. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Toggle form visibility
   */
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.error = '';
    }
  }
}
