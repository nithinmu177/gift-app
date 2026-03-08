# Firebase Integration - Code Examples

## Authentication Examples

### Login
```typescript
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password)
      .then(creds => {
        console.log('Logged in as:', creds.user.email);
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  }
}
```

### Sign Up
```typescript
signup() {
  this.auth.signup(this.email, this.password, this.displayName)
    .then(creds => {
      console.log('Account created:', creds.user);
      this.router.navigate(['/home']);
    })
    .catch(error => {
      console.error('Signup error:', error);
    });
}
```

### Get Current User
```typescript
// Get user as observable (reactive)
this.auth.user$.subscribe(user => {
  if (user) {
    console.log('Logged in user:', user.email);
  }
});

// Get user synchronously
const user = this.auth.getCurrentUser();
```

---

## Event Management Examples

### Get All Events
```typescript
import { EventService, EventPlan } from './services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.html'
})
export class EventsComponent implements OnInit {
  events$: Observable<EventPlan[]>;

  constructor(private events: EventService) {
    this.events$ = this.events.getEvents();
  }

  // Use in template with async pipe
  // <div *ngFor="let event of events$ | async">
}
```

### Create Event
```typescript
createNewEvent() {
  const newEvent: EventPlan = {
    name: 'Birthday Party',
    date: '2026-04-15',
    theme: 'Tropical',
    location: 'Beach Resort',
    host: 'John Doe',
    description: 'Amazing birthday celebration',
    guestCount: 50,
    budget: 50000
  };

  this.events.addEvent(newEvent)
    .then(ref => {
      console.log('Event created with ID:', ref.id);
      // Show success message
    })
    .catch(error => {
      console.error('Failed to create event:', error);
    });
}
```

### Update Event
```typescript
updateEventTheme(eventId: string) {
  this.events.updateEvent(eventId, {
    theme: 'Modern',
    budget: 75000
  })
  .then(() => {
    console.log('Event updated successfully');
  })
  .catch(error => {
    console.error('Update failed:', error);
  });
}
```

### Filter Events by Theme
```typescript
getPartiesOnly() {
  this.events.getEventsByTheme('Party').subscribe(events => {
    console.log('Party events:', events);
  });
}
```

---

## Shopping Cart Examples

### Add to Cart
```typescript
import { CartService, GiftItem } from './services/cart.service';

@Component({
  selector: 'app-gifts'
})
export class GiftsComponent {
  constructor(private cart: CartService) {}

  addToCart(gift: GiftItem) {
    this.cart.add(gift);
    // Optional: Show success notification
    console.log(`${gift.name} added to cart`);
  }
}
```

### Display Cart Items
```typescript
@Component({
  selector: 'app-cart',
  template: `
    <div *ngFor="let item of items">
      <h4>{{ item.name }}</h4>
      <p>Rs. {{ item.price }} x {{ item.quantity }}</p>
      <button (click)="remove(item)">Remove</button>
    </div>
    <p>Total: Rs. {{ cartService.subtotal }}</p>
  `
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.cartService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  remove(item: CartItem) {
    this.cartService.remove(item);
  }
}
```

### Update Quantity
```typescript
updateQuantity(item: CartItem, newQuantity: number) {
  this.cart.updateQuantity(item, newQuantity);
  console.log(`Updated ${item.name} quantity to ${newQuantity}`);
}
```

### Clear Cart
```typescript
clearCart() {
  if (confirm('Clear cart?')) {
    this.cart.clear();
    console.log('Cart cleared');
  }
}
```

---

## Gift Catalog Examples

### Get All Gifts
```typescript
import { GiftsService, Gift } from './services/gifts.service';

@Component({
  selector: 'app-gift-catalog'
})
export class GiftCatalogComponent implements OnInit {
  gifts$: Observable<Gift[]>;

  constructor(private gifts: GiftsService) {
    this.gifts$ = this.gifts.getGifts();
  }

  // Use with async pipe in template
  // <div *ngFor="let gift of gifts$ | async">
}
```

### Filter by Category
```typescript
getElectronicsGifts() {
  this.gifts.getGiftsByCategory('Electronics').subscribe(gifts => {
    console.log('Electronics gifts:', gifts);
  });
}
```

### Search Gifts
```typescript
searchGifts(query: string) {
  this.gifts.searchGifts(query).then(results => {
    console.log(`Search results for "${query}":`, results);
  });
}
```

### Add New Gift (Admin)
```typescript
addNewGift() {
  const newGift: Gift = {
    name: 'Premium Headphones',
    price: 5999,
    category: 'Electronics',
    rating: 4.8,
    tag: 'Audio',
    relation: 'Friend',
    description: 'Wireless noise-cancelling headphones',
    imageUrl: 'https://example.com/image.jpg',
    inStock: true
  };

  this.gifts.addGift(newGift)
    .then(ref => {
      console.log('Gift added:', ref.id);
    })
    .catch(error => {
      console.error('Failed to add gift:', error);
    });
}
```

---

## Order Management Examples

### Create Order
```typescript
import { OrdersService, DeliveryAddress } from './services/orders.service';

@Component({
  selector: 'app-checkout'
})
export class CheckoutComponent {
  constructor(
    private orders: OrdersService,
    private cart: CartService
  ) {}

  placeOrder() {
    const deliveryAddress: DeliveryAddress = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    };

    const cartItems = []; // Get from cart service
    
    this.orders.createOrder(
      cartItems,
      deliveryAddress,
      'credit_card'
    )
    .then(ref => {
      console.log('Order placed:', ref.id);
      // Clear cart after successful order
      this.cart.clear();
      // Redirect to order confirmation
    })
    .catch(error => {
      console.error('Order failed:', error);
    });
  }
}
```

### Get User Orders
```typescript
loadMyOrders() {
  this.orders.getUserOrders().subscribe(orders => {
    console.log('My orders:', orders);
    orders.forEach(order => {
      console.log(`Order #${order.orderNumber}: ${order.status}`);
    });
  });
}
```

### Update Order Status (Admin)
```typescript
shipOrder(orderId: string) {
  this.orders.updateOrderStatus(orderId, 'shipped')
    .then(() => {
      console.log('Order marked as shipped');
      // Send notification to customer
    })
    .catch(error => {
      console.error('Failed to update order:', error);
    });
}
```

### Cancel Order
```typescript
cancelOrder(orderId: string) {
  this.orders.cancelOrder(orderId)
    .then(() => {
      console.log('Order cancelled');
      // Refund customer
    })
    .catch(error => {
      console.error('Failed to cancel order:', error);
    });
}
```

---

## Notification Examples

### Create Notification
```typescript
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications'
})
export class NotificationsComponent {
  constructor(private notifications: NotificationsService) {}

  notifyOrderShipped(orderId: string) {
    this.notifications.createNotification(
      'Order Shipped',
      'Your order has been shipped and is on its way!',
      'success',
      `/orders/${orderId}`
    ).then(ref => {
      console.log('Notification sent:', ref.id);
    });
  }
}
```

### Get Notifications
```typescript
loadNotifications() {
  this.notifications.getAllNotifications().subscribe(notifs => {
    console.log('All notifications:', notifs);
  });
}
```

### Mark as Read
```typescript
markRead(notificationId: string) {
  this.notifications.markAsRead(notificationId)
    .then(() => {
      console.log('Notification marked as read');
    });
}
```

### Get Unread Count
```typescript
getUnreadCount() {
  this.notifications.getUnreadCount().then(count => {
    console.log(`You have ${count} unread notifications`);
    // Update badge in navbar
  });
}
```

---

## Advanced Usage

### Query with Conditions
```typescript
import { where } from '@angular/fire/firestore';

// Get orders from last month
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

this.firestore.queryCollection('orders', [
  where('userId', '==', currentUserId),
  where('createdAt', '>=', thirtyDaysAgo)
]).subscribe(orders => {
  console.log('Recent orders:', orders);
});
```

### Batch Operations
```typescript
// Delete all old notifications
async deleteOldNotifications() {
  const notifications = await this.firestore.getDocumentsByQuery('notifications', []);
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (const notif of notifications) {
    if (notif.createdAt && notif.createdAt.getTime() < thirtyDaysAgo) {
      await this.firestore.deleteDocument('notifications', notif.id);
    }
  }
}
```

### Real-time Updates
```typescript
// Subscribe to user's orders for real-time updates
this.orders.getUserOrders().subscribe(orders => {
  // This will automatically update whenever orders change in Firestore
  this.displayOrders = orders;
});
```

---

## Error Handling

```typescript
async safeOperation() {
  try {
    const result = await this.events.addEvent(eventData);
    console.log('Success:', result);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('You do not have permission to perform this action');
    } else if (error.code === 'not-authenticated') {
      console.error('Please log in first');
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

---

## Tips & Best Practices

1. **Always use async pipe in templates**
   ```html
   <div *ngFor="let item of items$ | async">{{ item.name }}</div>
   ```

2. **Unsubscribe from subscriptions to prevent memory leaks**
   ```typescript
   private destroy$ = new Subject<void>();

   ngOnInit() {
     this.service.data$.pipe(
       takeUntil(this.destroy$)
     ).subscribe(data => { /* ... */ });
   }

   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

3. **Use OnPush change detection for performance**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

4. **Handle loading and error states**
   ```html
   <div *ngIf="loading$ | async">Loading...</div>
   <div *ngIf="error$ | async as error" class="error">{{ error }}</div>
   <div *ngIf="data$ | async as data">{{ data }}</div>
   ```

---

Happy coding! 🚀
