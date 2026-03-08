import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { CartItem } from './cart.service';

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: DeliveryAddress;
  paymentMethod?: string;
  orderNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeliveryAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private currentUserId: string | null = null;

  constructor(
    private firestore: FirestoreService,
    @Optional() private auth: Auth | null
  ) {
    this.updateCurrentUserId();
  }

  /**
   * Update current user ID from auth
   */
  private updateCurrentUserId() {
    if (this.auth?.currentUser) {
      this.currentUserId = this.auth.currentUser.uid;
    }
  }

  /**
   * Get all orders for current user
   */
  getUserOrders(): Observable<Order[]> {
    if (!this.currentUserId) {
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.firestore.getDocumentsByField<Order>('orders', 'userId', this.currentUserId);
  }

  /**
   * Get a single order by ID
   */
  getOrderById(id: string): Observable<Order | undefined> {
    return this.firestore.getDocument<Order>('orders', id);
  }

  /**
   * Create a new order from cart
   */
  async createOrder(
    items: CartItem[],
    deliveryAddress: DeliveryAddress,
    paymentMethod?: string
  ): Promise<any> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const order: Order = {
      userId: this.currentUserId,
      items,
      subtotal,
      tax,
      total,
      status: 'pending',
      deliveryAddress,
      paymentMethod,
      orderNumber: this.generateOrderNumber(),
    };

    return this.firestore.addDocument('orders', order);
  }

  /**
   * Update order status
   */
  updateOrderStatus(id: string, status: Order['status']) {
    return this.firestore.updateDocument('orders', id, { status });
  }

  /**
   * Cancel an order
   */
  cancelOrder(id: string) {
    return this.firestore.updateDocument('orders', id, { status: 'cancelled' });
  }

  /**
   * Get all orders (admin)
   */
  getAllOrders(): Observable<Order[]> {
    return this.firestore.getCollection<Order>('orders');
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }
}
