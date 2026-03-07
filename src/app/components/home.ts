import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, GiftItem } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  fallbackImage = 'https://placehold.co/800x600?text=Event+Gift+Planner';

  constructor(private cart: CartService) {}

  eventTypes = [
    {
      code: 'WB',
      title: 'Wedding Bliss',
      description: 'Themes, venues, and gifts curated for the big day.',
      imageUrl:
        'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80',
    },
    {
      code: 'BD',
      title: 'Birthday Bash',
      description: 'Surprise-ready picks and joyful party essentials.',
      imageUrl:
        'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
    },
    {
      code: 'AN',
      title: 'Anniversary',
      description: 'Meaningful keepsakes and elegant celebration ideas.',
      imageUrl:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    },
    {
      code: 'BB',
      title: 'Baby Blessing',
      description: 'Soft, safe, and thoughtful gifts for new parents.',
      imageUrl:
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
    },
  ];

  giftIdeas: GiftItem[] = [
    {
      id: 'gift-1',
      name: 'Classic Timepiece',
      price: 2499,
      category: 'Birthday',
      rating: 4.6,
      tag: 'Top rated',
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'gift-2',
      name: 'Luxury Fragrance Set',
      price: 1899,
      category: 'Anniversary',
      rating: 4.8,
      tag: 'Romantic',
      imageUrl:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'gift-3',
      name: 'Personalized Photo Frame',
      price: 1299,
      category: 'Wedding',
      rating: 4.5,
      tag: 'Custom',
      imageUrl:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    },
  ];

  highlights = [
    {
      title: 'Smart recommendations',
      description: 'AI-ready filters match gifts with budget, age, and event.',
    },
    {
      title: 'Secure checkout',
      description: 'Safe payments with multiple gateways and instant receipts.',
    },
    {
      title: 'Fast delivery',
      description: 'Same-day dispatch for last-minute celebrations.',
    },
  ];

  addToCart(gift: GiftItem) {
    this.cart.add(gift);
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.src = this.fallbackImage;
    }
  }
}
