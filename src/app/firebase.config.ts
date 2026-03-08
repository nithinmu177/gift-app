// Firebase Configuration
// This configuration connects your Angular app to Firebase backend
// All data is stored in Firestore and synchronized in real-time

export const firebaseEnabled = true;

export const firebaseConfig = {
  apiKey: 'AIzaSyDd54cUdRUlOq6F52Gy0I2ItOnW0qlGf7s',
  authDomain: 'gift-d24a5.firebaseapp.com',
  projectId: 'gift-d24a5',
  storageBucket: 'gift-d24a5.firebasestorage.app',
  messagingSenderId: '739958560784',
  appId: '1:739958560784:web:3acfd8be74b5e2fd32d295',
  measurementId: 'G-TG6W1VJ75G',
};

/**
 * Firestore Collections Structure:
 *
 * - events: Store event plans with dates, themes, and locations
 * - gifts: Catalog of available gifts with pricing and details
 * - carts: User shopping carts with items and totals
 * - orders: Completed orders with delivery addresses and status
 * - notifications: User notifications for orders, events, and updates
 * - users: User profiles and preferences (optional)
 */
