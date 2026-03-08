import { Injectable, Optional } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  QueryConstraint,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { firebaseEnabled } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(@Optional() private firestore: Firestore | null) {}

  /**
   * Get all documents from a collection
   */
  getCollection<T>(name: string): Observable<T[]> {
    if (!firebaseEnabled || !this.firestore) {
      return of([] as T[]);
    }
    const ref = collection(this.firestore, name);
    const q = query(ref);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Get a single document by ID
   */
  getDocument<T>(collectionName: string, docId: string): Observable<T | undefined> {
    if (!firebaseEnabled || !this.firestore) {
      return of(undefined);
    }
    const docRef = doc(this.firestore, collectionName, docId);
    return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
  }

  /**
   * Query documents with conditions
   */
  queryCollection<T>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Observable<T[]> {
    if (!firebaseEnabled || !this.firestore) {
      return of([] as T[]);
    }
    const ref = collection(this.firestore, collectionName);
    const q = query(ref, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  /**
   * Get documents matching a condition (promise-based)
   */
  async getDocumentsByQuery<T>(
    collectionName: string,
    constraints: QueryConstraint[]
  ): Promise<T[]> {
    if (!firebaseEnabled || !this.firestore) {
      return [];
    }
    const ref = collection(this.firestore, collectionName);
    const q = query(ref, ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T));
  }

  /**
   * Add a new document to a collection
   */
  addDocument<T extends object>(collectionName: string, data: T) {
    if (!firebaseEnabled || !this.firestore) {
      return Promise.resolve({ id: 'local' });
    }
    const ref = collection(this.firestore, collectionName);
    return addDoc(ref, { ...data, createdAt: new Date() });
  }

  /**
   * Update an existing document
   */
  async updateDocument(
    collectionName: string,
    docId: string,
    data: Partial<any>
  ): Promise<void> {
    if (!firebaseEnabled || !this.firestore) {
      return Promise.resolve();
    }
    const docRef = doc(this.firestore, collectionName, docId);
    return updateDoc(docRef, { ...data, updatedAt: new Date() });
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    if (!firebaseEnabled || !this.firestore) {
      return Promise.resolve();
    }
    const docRef = doc(this.firestore, collectionName, docId);
    return deleteDoc(docRef);
  }

  /**
   * Get documents by a single field condition
   */
  getDocumentsByField<T>(
    collectionName: string,
    field: string,
    value: any
  ): Observable<T[]> {
    return this.queryCollection<T>(collectionName, [where(field, '==', value)]);
  }
}
