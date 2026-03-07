import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  coupon = '';
  deliveryDate = '';

  constructor(public cart: CartService) {}

  updateQuantity(item: CartItem, value: number) {
    this.cart.updateQuantity(item, value);
  }

  removeItem(item: CartItem) {
    this.cart.remove(item);
  }

  get total() {
    const deliveryFee = this.cart.items.length ? 150 : 0;
    return this.cart.subtotal + deliveryFee;
  }
}
