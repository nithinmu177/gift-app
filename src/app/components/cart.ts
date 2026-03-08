import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../services/cart.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  coupon = '';
  deliveryDate = '';
  private destroy$ = new Subject<void>();

  constructor(public cart: CartService) {}

  ngOnInit() {
    this.cart
      .getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(item: CartItem, value: number) {
    this.cart.updateQuantity(item, value);
  }

  removeItem(item: CartItem) {
    this.cart.remove(item);
  }

  get total() {
    const deliveryFee = this.items.length ? 150 : 0;
    return this.cart.subtotal + deliveryFee;
  }
}
