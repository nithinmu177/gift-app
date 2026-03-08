import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { where } from '@angular/fire/firestore';

export interface Gift {
  id?: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  tag: string;
  relation?: string;
  imageUrl?: string;
  description?: string;
  inStock?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class GiftsService {
  constructor(private firestore: FirestoreService) {}

  /**
   * Get all gifts
   */
  getGifts(): Observable<Gift[]> {
    return this.firestore.getCollection<Gift>('gifts');
  }

  /**
   * Get a single gift by ID
   */
  getGiftById(id: string): Observable<Gift | undefined> {
    return this.firestore.getDocument<Gift>('gifts', id);
  }

  /**
   * Get gifts by category
   */
  getGiftsByCategory(category: string): Observable<Gift[]> {
    return this.firestore.getDocumentsByField<Gift>('gifts', 'category', category);
  }

  /**
   * Get gifts by relation
   */
  getGiftsByRelation(relation: string): Observable<Gift[]> {
    return this.firestore.getDocumentsByField<Gift>('gifts', 'relation', relation);
  }

  /**
   * Search gifts by name or description
   */
  async searchGifts(searchTerm: string): Promise<Gift[]> {
    const allGifts = await this.firestore.getDocumentsByQuery<Gift>('gifts', []);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allGifts.filter(
      (gift) =>
        gift.name.toLowerCase().includes(lowerSearchTerm) ||
        (gift.description && gift.description.toLowerCase().includes(lowerSearchTerm)) ||
        gift.tag.toLowerCase().includes(lowerSearchTerm)
    );
  }

  /**
   * Add a new gift
   */
  addGift(gift: Gift) {
    return this.firestore.addDocument('gifts', gift);
  }

  /**
   * Update an existing gift
   */
  updateGift(id: string, gift: Partial<Gift>) {
    return this.firestore.updateDocument('gifts', id, gift);
  }

  /**
   * Delete a gift
   */
  deleteGift(id: string) {
    return this.firestore.deleteDocument('gifts', id);
  }
}
