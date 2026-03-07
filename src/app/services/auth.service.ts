import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { firebaseEnabled } from '../firebase.config';

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

  login(email: string, password: string): Promise<UserCredential> {
    if (this.isFirebaseEnabled()) {
      return signInWithEmailAndPassword(this.auth as Auth, email, password);
    }
    return Promise.resolve({ user: { email } } as unknown as UserCredential);
  }

  signup(email: string, password: string): Promise<UserCredential> {
    if (this.isFirebaseEnabled()) {
      return createUserWithEmailAndPassword(this.auth as Auth, email, password);
    }
    return Promise.resolve({ user: { email } } as unknown as UserCredential);
  }

  logout() {
    if (this.isFirebaseEnabled()) {
      return signOut(this.auth as Auth);
    }
    return Promise.resolve();
  }
}
