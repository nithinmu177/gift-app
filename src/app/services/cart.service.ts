import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, User } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  tag: string;
  relation?: string;
  imageUrl?: string;
}

export interface CartItem extends GiftItem {
  quantity: number;
}

export interface Cart {
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items$ = new BehaviorSubject<CartItem[]>([]);
  private cartId: string | null = null;
  private currentUserId: string | null = null;

  constructor(
    private firestore: FirestoreService,
    @Optional() private auth: Auth | null
  ) {
    this.initializeCart();
  }

  /**
   * Initialize cart for current user
   */
  private async initializeCart() {
    if (!this.auth?.currentUser) {
      // Fallback to local storage if not authenticated
      return;
    }
    this.currentUserId = this.auth.currentUser.uid;
    await this.loadCart();
  }

  /**
   * Load cart from Firestore
   */
  async loadCart() {
    if (!this.currentUserId) {
      this.items$.next([]);
      return;
    }

    try {
      const userCarts = await this.firestore.getDocumentsByQuery<Cart>('carts', []);
      const userCart = userCarts.find((c) => c.userId === this.currentUserId);

      if (userCart && userCart.id) {
        this.cartId = userCart.id;
        this.items$.next(userCart.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  /**
   * Add item to cart
   */
  add(item: GiftItem) {
    const currentItems = this.items$.getValue();
    const existing = currentItems.find((entry) => entry.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      currentItems.push({ ...item, quantity: 1 });
    }

    this.items$.next([...currentItems]);
    this.saveCart();
  }

  /**
   * Update item quantity
   */
  updateQuantity(item: CartItem, quantity: number) {
    const safeQuantity = Math.max(1, Math.floor(quantity || 1));
    const items = this.items$.getValue();
    const cartItem = items.find((ci) => ci.id === item.id);

    if (cartItem) {
      cartItem.quantity = safeQuantity;
      this.items$.next([...items]);
      this.saveCart();
    }
  }

  /**
   * Remove item from cart
   */
  remove(item: CartItem) {
    const items = this.items$.getValue();
    const filtered = items.filter((entry) => entry.id !== item.id);
    this.items$.next(filtered);
    this.saveCart();
  }

  /**
   * Clear cart
   */
  clear() {
    this.items$.next([]);
    this.saveCart();
  }

  /**
   * Get all cart items
   */
  getItems(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  /**
   * Get subtotal amount
   */
  get subtotal(): number {
    return this.items$.getValue().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Get item count
   */
  get itemCount(): number {
    return this.items$.getValue().reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Save cart to Firestore
   */
  private async saveCart() {
    if (!this.currentUserId) {
      return;
    }

    const items = this.items$.getValue();
    const cartData: Cart = {
      userId: this.currentUserId,
      items,
      subtotal: this.subtotal,
    };

    try {
      if (!this.cartId) {
        const result = await this.firestore.addDocument('carts', cartData);
        this.cartId = result.id;
      } else {
        await this.firestore.updateDocument('carts', this.cartId, cartData);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }
}
