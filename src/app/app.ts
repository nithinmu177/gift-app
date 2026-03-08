import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FirestoreInitService } from './services/firestore-init.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('event-gift-planner');

  constructor(
    public auth: AuthService,
    private router: Router,
    private firestoreInit: FirestoreInitService
  ) {}

  ngOnInit() {
    // Initialize sample data on first app load
    this.firestoreInit.initializeSampleData().catch(err => 
      console.log('Data initialization complete or skipped:', err)
    );
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
