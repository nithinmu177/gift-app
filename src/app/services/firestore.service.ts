import { Injectable, Optional } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { firebaseEnabled } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(@Optional() private firestore: Firestore | null) {}

  getCollection<T>(name: string): Observable<T[]> {
    if (!firebaseEnabled || !this.firestore) {
      return of([] as T[]);
    }
    const ref = collection(this.firestore, name);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  addDocument<T extends object>(name: string, data: T) {
    if (!firebaseEnabled || !this.firestore) {
      return Promise.resolve({ id: 'local' });
    }
    const ref = collection(this.firestore, name);
    return addDoc(ref, data);
  }
}
