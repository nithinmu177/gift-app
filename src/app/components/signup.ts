import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'user';
  status = '';
  userId = '';
  loading = false;
  private readonly timeoutMs = 12000;

  constructor(
    private auth: AuthService,
    private store: FirestoreService,
    private router: Router
  ) {}

  async signup() {
    this.status = '';
    if (this.password !== this.confirmPassword) {
      this.status = 'Passwords do not match.';
      return;
    }
    this.loading = true;
    try {
      this.status = 'Connecting to Firebase...';
      const result: any = await this.withTimeout(
        this.auth.signup(this.email, this.password),
        this.timeoutMs,
        'Signup timed out. Check internet or Firebase settings.'
      );
      this.userId = result?.user?.uid ?? '';

      try {
        this.status = 'Saving profile...';
        await this.store.addDocument('users', {
          name: this.name,
          email: this.email,
          role: this.role,
          createdAt: new Date().toISOString(),
        });
      } catch (error: any) {
        console.error('Profile save failed:', error);
        this.status =
          'Account created, but profile save failed. Check Firestore rules.';
      }

      if (!this.status) {
        this.status = this.auth.isFirebaseEnabled()
          ? 'Account created successfully. Redirecting...'
          : 'Signup simulated. Connect Firebase to enable real accounts.';
      }

      if (this.auth.isFirebaseEnabled()) {
        await this.router.navigate(['/']);
      }
    } catch (error: any) {
      const code = error?.code ? `${error.code}: ` : '';
      this.status = `${code}${error?.message ?? 'Signup failed. Please try again.'}`;
    } finally {
      this.loading = false;
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
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
