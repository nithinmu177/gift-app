import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  remember = true;
  status = '';
  loading = false;
  isFirebaseConnected = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Check if user is already logged in
    this.auth.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
    this.isFirebaseConnected = this.auth.isFirebaseEnabled();
  }

  async login() {
    this.loading = true;
    this.status = '';

    if (!this.email || !this.password) {
      this.status = 'Please enter both email and password.';
      this.loading = false;
      return;
    }

    try {
      const result = await this.auth.login(this.email, this.password);
      console.log('Login successful:', result.user.email);
      this.status = 'Login successful. Redirecting...';

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        this.status = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        this.status = 'Account not found. Please sign up first.';
      } else if (error.code === 'auth/too-many-requests') {
        this.status = 'Too many failed login attempts. Please try later.';
      } else {
        this.status = error?.message ?? 'Login failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}
