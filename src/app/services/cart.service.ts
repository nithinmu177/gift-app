import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: CartItem[] = [];

  add(item: GiftItem) {
    const existing = this.items.find((entry) => entry.id === item.id);
    if (existing) {
      existing.quantity += 1;
      return;
    }
    this.items = [...this.items, { ...item, quantity: 1 }];
  }

  updateQuantity(item: CartItem, quantity: number) {
    const safeQuantity = Math.max(1, Math.floor(quantity || 1));
    item.quantity = safeQuantity;
  }

  remove(item: CartItem) {
    this.items = this.items.filter((entry) => entry.id !== item.id);
  }

  clear() {
    this.items = [];
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
