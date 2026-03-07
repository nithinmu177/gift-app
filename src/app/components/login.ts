import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  remember = true;
  status = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.loading = true;
    this.status = '';
    try {
      await this.auth.login(this.email, this.password);
      this.status = this.auth.isFirebaseEnabled()
        ? 'Login successful. Welcome back.'
        : 'Login simulated. Connect Firebase to enable real authentication.';
      if (this.auth.isFirebaseEnabled()) {
        await this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.status = error?.message ?? 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
