import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PlannedEvent {
  name: string;
  date: string;
  theme: string;
  location: string;
  host: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class EventsComponent {
  events: PlannedEvent[] = [
    {
      name: 'Nithin & Family Wedding',
      date: '2026-05-10',
      theme: 'Golden Bloom',
      location: 'Bengaluru Palace Grounds',
      host: 'Nithin M U',
    },
    {
      name: 'Sister Birthday',
      date: '2026-04-02',
      theme: 'Pastel Garden',
      location: 'Lavender Cafe',
      host: 'Family',
    },
  ];

  newEvent: PlannedEvent = {
    name: '',
    date: '',
    theme: '',
    location: '',
    host: '',
  };

  addEvent() {
    if (!this.newEvent.name || !this.newEvent.date) {
      return;
    }
    this.events = [{ ...this.newEvent }, ...this.events];
    this.newEvent = {
      name: '',
      date: '',
      theme: '',
      location: '',
      host: '',
    };
  }

  removeEvent(event: PlannedEvent) {
    this.events = this.events.filter((item) => item !== event);
  }
}
