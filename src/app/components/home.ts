import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, GiftItem } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { GiftsService, Gift } from '../services/gifts.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  fallbackImage = 'https://placehold.co/800x600?text=Event+Gift+Planner';
  user$: Observable<User | null>;
  giftIdeas: GiftItem[] = [];
  cartItemCount = 0;

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

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private gifts: GiftsService
  ) {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    // Load cart item count
    this.cart.getItems().subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // Load popular gifts from Firestore
    this.gifts.getGifts().subscribe(
      gifts => {
        if (gifts && gifts.length > 0) {
          // Show top 3 gifts
          this.giftIdeas = gifts.slice(0, 3).map(gift => ({
            id: gift.id || '',
            name: gift.name,
            price: gift.price,
            category: gift.category,
            rating: gift.rating,
            tag: gift.tag,
            imageUrl: gift.imageUrl
          }));
        } else {
          // Use default gift ideas if no data in Firestore
          this.loadDefaultGifts();
        }
      },
      error => {
        console.error('Error loading gifts:', error);
        this.loadDefaultGifts();
      }
    );
  }

  private loadDefaultGifts() {
    this.giftIdeas = [
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
  }

  addToCart(gift: GiftItem) {
    this.cart.add(gift);
    console.log(`Added ${gift.name} to cart`);
  }
}
