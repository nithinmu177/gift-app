import { Injectable, Optional } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { firebaseEnabled } from '../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class FirestoreInitService {
  constructor(@Optional() private firestore: Firestore | null) {}

  /**
   * Initialize Firestore with sample data
   * Call this once when app starts to populate empty database
   */
  async initializeSampleData() {
    if (!firebaseEnabled || !this.firestore) {
      console.log('Firebase disabled or not available');
      return;
    }

    try {
      // Add sample gifts
      const sampleGifts = [
        {
          name: 'Smart Watch',
          price: 4499,
          category: 'Birthday',
          rating: 4.7,
          tag: 'Popular',
          relation: 'Friends',
          imageUrl: 'https://images.pexels.com/photos/19961769/pexels-photo-19961769.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Latest smartwatch with fitness tracking',
          inStock: true,
        },
        {
          name: 'Bluetooth Speaker',
          price: 2199,
          category: 'Birthday',
          rating: 4.6,
          tag: 'Music',
          relation: 'Friends',
          imageUrl: 'https://images.pexels.com/photos/5511714/pexels-photo-5511714.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Portable wireless speaker with great sound',
          inStock: true,
        },
        {
          name: 'Perfume Gift Set',
          price: 1899,
          category: 'Birthday',
          rating: 4.8,
          tag: 'Luxury',
          relation: 'Partner',
          imageUrl: 'https://images.pexels.com/photos/9202849/pexels-photo-9202849.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Premium fragrance collection',
          inStock: true,
        },
        {
          name: 'Wedding Album',
          price: 3999,
          category: 'Wedding',
          rating: 4.9,
          tag: 'Luxury',
          relation: 'Partner',
          imageUrl: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Elegant wedding photo album',
          inStock: true,
        },
        {
          name: 'Anniversary Watch',
          price: 5499,
          category: 'Anniversary',
          rating: 4.8,
          tag: 'Luxury',
          relation: 'Partner',
          imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Elegant couple watches',
          inStock: true,
        },
        {
          name: 'Graduation Cap & Gown',
          price: 2499,
          category: 'Graduation',
          rating: 4.5,
          tag: 'Special',
          relation: 'Family',
          imageUrl: 'https://images.pexels.com/photos/4427925/pexels-photo-4427925.jpeg?auto=compress&cs=tinysrgb&w=900',
          description: 'Official graduation regalia',
          inStock: true,
        },
      ];

      const giftsRef = collection(this.firestore, 'gifts');
      for (const gift of sampleGifts) {
        await addDoc(giftsRef, {
          ...gift,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('✅ Sample gifts added to Firestore');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }
}
