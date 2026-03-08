# Firebase Firestore Integration Guide

## Overview
Your event-gift-planner application is now fully integrated with Firebase and Firestore for backend data persistence. All data is synchronized in real-time.

## Firebase Configuration

The Firebase config is set up in `src/app/firebase.config.ts` with the following credentials:
- **Project ID**: gift-d24a5
- **Auth Domain**: gift-d24a5.firebaseapp.com
- **Storage Bucket**: gift-d24a5.firebasestorage.app

## Firestore Collections Structure

### 1. **events** - Event Planning
Store event plans with all details.

**Fields:**
```typescript
{
  id: string;
  userId: string;
  name: string;
  date: string;
  theme: string;
  location: string;
  host: string;
  description?: string;
  guestCount?: number;
  budget?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. **gifts** - Gift Catalog
Complete catalog of available gifts for purchase.

**Fields:**
```typescript
{
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  tag: string;
  relation?: string;
  imageUrl?: string;
  description?: string;
  inStock?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. **carts** - Shopping Carts
User shopping carts with items and totals.

**Fields:**
```typescript
{
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. **orders** - Orders
Completed orders with delivery and payment information.

**Fields:**
```typescript
{
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: DeliveryAddress;
  paymentMethod?: string;
  orderNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. **notifications** - User Notifications
In-app notifications for orders, events, and system updates.

**Fields:**
```typescript
{
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Services Reference

### AuthService
Handles user authentication with Firebase Auth.

**Usage:**
```typescript
constructor(private auth: AuthService) {}

// Login
this.auth.login('user@example.com', 'password').then(creds => {
  console.log('Logged in:', creds.user.email);
});

// Sign up
this.auth.signup('user@example.com', 'password', 'Display Name').then(creds => {
  console.log('Signed up:', creds.user.email);
});

// Logout
this.auth.logout();

// Get current user
const user = this.auth.getCurrentUser();
const user$ = this.auth.user$; // Observable

// Get user profile
const profile = this.auth.getUserProfile();

// Update profile
this.auth.updateUserProfile({ displayName: 'New Name' });
```

### FirestoreService
Base service for all Firestore operations.

**Usage:**
```typescript
constructor(private firestore: FirestoreService) {}

// Get all documents
this.firestore.getCollection<T>('collectionName').subscribe(docs => {
  console.log(docs);
});

// Get single document
this.firestore.getDocument<T>('collectionName', 'docId').subscribe(doc => {
  console.log(doc);
});

// Query documents
import { where } from '@angular/fire/firestore';
this.firestore.queryCollection<T>('collectionName', [
  where('field', '==', value)
]).subscribe(docs => {
  console.log(docs);
});

// Add document
this.firestore.addDocument('collectionName', data).then(ref => {
  console.log('Document added with ID:', ref.id);
});

// Update document
this.firestore.updateDocument('collectionName', 'docId', { field: newValue });

// Delete document
this.firestore.deleteDocument('collectionName', 'docId');
```

### EventService
Manages event planning and organization.

**Usage:**
```typescript
constructor(private events: EventService) {}

// Get all events
this.events.getEvents().subscribe(events => {
  console.log(events);
});

// Get user's events
this.events.getUserEvents().subscribe(events => {
  console.log('My events:', events);
});

// Get single event
this.events.getEventById('eventId').subscribe(event => {
  console.log(event);
});

// Create event
this.events.addEvent({
  name: 'Birthday Party',
  date: '2026-03-15',
  theme: 'Tropical',
  location: 'Beach',
  host: 'John Doe'
}).then(ref => {
  console.log('Event created:', ref.id);
});

// Update event
this.events.updateEvent('eventId', { theme: 'Modern' });

// Delete event
this.events.deleteEvent('eventId');

// Filter by theme
this.events.getEventsByTheme('Tropical').subscribe(events => {
  console.log(events);
});
```

### GiftsService
Manages the gift catalog.

**Usage:**
```typescript
constructor(private gifts: GiftsService) {}

// Get all gifts
this.gifts.getGifts().subscribe(gifts => {
  console.log(gifts);
});

// Get gift by ID
this.gifts.getGiftById('giftId').subscribe(gift => {
  console.log(gift);
});

// Filter by category
this.gifts.getGiftsByCategory('Electronics').subscribe(gifts => {
  console.log(gifts);
});

// Filter by relation (e.g., 'Friend', 'Family')
this.gifts.getGiftsByRelation('Friend').subscribe(gifts => {
  console.log(gifts);
});

// Search gifts
this.gifts.searchGifts('laptop').then(results => {
  console.log('Search results:', results);
});

// Add gift
this.gifts.addGift({
  name: 'Laptop',
  price: 1200,
  category: 'Electronics',
  rating: 4.5,
  tag: 'Tech',
  relation: 'Friend'
}).then(ref => {
  console.log('Gift added:', ref.id);
});

// Update gift
this.gifts.updateGift('giftId', { price: 1100 });

// Delete gift
this.gifts.deleteGift('giftId');
```

### CartService
Manages user shopping cart with Firestore persistence.

**Usage:**
```typescript
constructor(private cart: CartService) {}

// Get cart items (observable)
this.cart.getItems().subscribe(items => {
  console.log('Cart items:', items);
});

// Add item to cart
this.cart.add({
  id: '123',
  name: 'Gift Item',
  price: 50,
  category: 'Optional',
  rating: 4.5,
  tag: 'Gift'
});

// Update quantity
this.cart.updateQuantity(cartItem, 5);

// Remove item
this.cart.remove(cartItem);

// Clear cart
this.cart.clear();

// Get totals
console.log('Subtotal:', this.cart.subtotal);
console.log('Item count:', this.cart.itemCount);
```

### OrdersService
Manages order creation and tracking.

**Usage:**
```typescript
constructor(private orders: OrdersService) {}

// Get user's orders
this.orders.getUserOrders().subscribe(orders => {
  console.log('My orders:', orders);
});

// Get order by ID
this.orders.getOrderById('orderId').subscribe(order => {
  console.log(order);
});

// Create order from cart
this.orders.createOrder(
  cartItems,
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'USA'
  },
  'credit_card'
).then(ref => {
  console.log('Order created:', ref.id);
});

// Update order status
this.orders.updateOrderStatus('orderId', 'shipped');

// Cancel order
this.orders.cancelOrder('orderId');

// Get all orders (admin)
this.orders.getAllOrders().subscribe(orders => {
  console.log('All orders:', orders);
});
```

### NotificationsService
Manages user notifications.

**Usage:**
```typescript
constructor(private notifications: NotificationsService) {}

// Get all notifications
this.notifications.getAllNotifications().subscribe(notifs => {
  console.log(notifs);
});

// Create notification
this.notifications.createNotification(
  'Order Shipped',
  'Your order has been shipped!',
  'success',
  '/orders/123'
).then(ref => {
  console.log('Notification created:', ref.id);
});

// Mark as read
this.notifications.markAsRead('notifId');

// Mark all as read
this.notifications.markAllAsRead();

// Delete notification
this.notifications.deleteNotification('notifId');

// Get unread count
this.notifications.getUnreadCount().then(count => {
  console.log('Unread notifications:', count);
});
```

## Security Rules

When setting up Firebase, configure these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events collection
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Gifts collection
    match /gifts/{giftId} {
      allow read: if true; // Public catalog
      allow write: if request.auth.token.admin == true;
    }

    // Carts collection
    match /carts/{cartId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }

    // Notifications collection
    match /notifications/{notifId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Best Practices

1. **Always check authentication** before creating/updating user data
2. **Use Observables** for real-time data synchronization
3. **Handle errors** with proper try-catch and error callbacks
4. **Close subscriptions** with unsubscribe() or async pipe in templates
5. **Validate data** before sending to Firestore
6. **Use Firestore indexes** for complex queries
7. **Enable offline persistence** for better UX

## Example Component Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { EventService } from './services/event.service';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events$ = this.eventService.getEvents();
  user$ = this.authService.user$;
  cartItems$ = this.cartService.getItems();

  constructor(
    private eventService: EventService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Services automatically handle Firestore sync
  }

  addEvent(name: string, date: string, theme: string, location: string, host: string) {
    this.eventService.addEvent({ name, date, theme, location, host }).then(() => {
      // Event added successfully
    });
  }
}
```

## Firebase Console

Access your Firebase console at:
https://console.firebase.google.com/project/gift-d24a5

From there you can:
- View and manage Firestore data
- Monitor real-time database activity
- Set up authentication providers
- Configure security rules
- View analytics and performance metrics

## Troubleshooting

**"Firebase is not initialized"**
- Ensure `firebaseEnabled` is `true` in `firebase.config.ts`
- Check that `app.config.ts` includes Firebase providers

**"Permission denied" errors**
- Update security rules in Firebase console
- Verify user is authenticated
- Check that userId matches in data

**Offline data not syncing**
- Enable offline persistence in `app.config.ts`
- Check network connectivity
- Verify Firestore rules allow the operation

## Next Steps

1. Test the Firebase connection by checking browser console
2. Create initial Firestore collections in Firebase console
3. Add sample data for testing
4. Update your components to use the services
5. Configure security rules in Firebase console
6. Set up Firebase hosting for deployment
