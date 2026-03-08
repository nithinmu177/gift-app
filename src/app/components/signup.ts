import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  status = '';
  loading = false;
  isFirebaseConnected = false;
  private readonly timeoutMs = 12000;

  constructor(
    private auth: AuthService,
    private store: FirestoreService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    this.auth.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
    this.isFirebaseConnected = this.auth.isFirebaseEnabled();
  }

  async signup() {
    this.status = '';

    // Validation
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.status = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.status = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.status = 'Password must be at least 6 characters long.';
      return;
    }

    this.loading = true;

    try {
      this.status = 'Creating account...';

      // Create Firebase Auth account
      const result: any = await this.withTimeout(
        this.auth.signup(this.email, this.password, this.name),
        this.timeoutMs,
        'Signup timed out. Check your internet connection.'
      );

      if (!result?.user?.uid) {
        throw new Error('Failed to create user account.');
      }

      // Save user profile to Firestore
      try {
        this.status = 'Creating user profile...';
        await this.store.addDocument('users', {
          userId: result.user.uid,
          name: this.name,
          email: this.email,
          phone: this.phone || null,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (error: any) {
        console.error('Profile save error:', error);
        this.status = 'Account created. Profile setup had an issue, but you can proceed.';
      }

      this.status = 'Account created successfully! Redirecting...';
      console.log('Signup successful for:', this.email);

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.status = 'Email already in use. Please try logging in or use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        this.status = 'Invalid email format. Please check and try again.';
      } else if (error.code === 'auth/weak-password') {
        this.status = 'Password is too weak. Use at least 6 characters with mixed case and numbers.';
      } else {
        this.status = error?.message ?? 'Signup failed. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }

  private withTimeout<T>(
    promise: Promise<T>,
    ms: number,
    message: string
  ): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const timeout = new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => {
      if (timer) {
        clearTimeout(timer);
      }
    });
  }
}
