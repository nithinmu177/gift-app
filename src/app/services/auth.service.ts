import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { firebaseEnabled } from '../firebase.config';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$: Observable<User | null>;

  constructor(@Optional() private auth: Auth | null) {
    this.user$ = this.isFirebaseEnabled()
      ? authState(this.auth as Auth)
      : of(null);
  }

  isFirebaseEnabled(): boolean {
    return firebaseEnabled && !!this.auth;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.auth?.currentUser || null;
  }

  /**
   * Get current user as observable
   */
  getCurrentUserAsObservable(): Observable<User | null> {
    return this.user$;
  }

  /**
   * Login user with email and password
   */
  login(email: string, password: string): Promise<UserCredential> {
    if (this.isFirebaseEnabled()) {
      return signInWithEmailAndPassword(this.auth as Auth, email, password);
    }
    return Promise.resolve({ user: { email } } as unknown as UserCredential);
  }

  /**
   * Sign up user with email and password
   */
  signup(email: string, password: string, displayName?: string): Promise<UserCredential> {
    if (this.isFirebaseEnabled()) {
      return createUserWithEmailAndPassword(this.auth as Auth, email, password).then(
        async (credentials) => {
          if (displayName) {
            await updateProfile(credentials.user, { displayName });
          }
          return credentials;
        }
      );
    }
    return Promise.resolve({ user: { email } } as unknown as UserCredential);
  }

  /**
   * Logout user
   */
  logout(): Promise<void> {
    if (this.isFirebaseEnabled()) {
      return signOut(this.auth as Auth);
    }
    return Promise.resolve();
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = this.getCurrentUser();
    if (user && this.isFirebaseEnabled()) {
      return updateProfile(user, updates);
    }
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile | null {
    const user = this.getCurrentUser();
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    }
    return null;
  }
}
