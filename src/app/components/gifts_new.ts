import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, GiftItem } from '../services/cart.service';
import { GiftsService, Gift } from '../services/gifts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface GiftFilter {
  search: string;
  category: string;
  budget: string;
  relation: string;
}

@Component({
  selector: 'app-gifts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gifts.html',
  styleUrl: './gifts.css',
})
export class GiftsComponent implements OnInit, OnDestroy {
  fallbackImage = 'https://placehold.co/800x600?text=Gift+Image';
  gifts: GiftItem[] = [];
  loading = false;
  error = '';
  private destroy$ = new Subject<void>();

  constructor(
    private cart: CartService,
    private giftsService: GiftsService
  ) {}

  filter: GiftFilter = {
    search: '',
    category: 'All',
    budget: 'All',
    relation: 'All',
  };

  categories = [
    'All',
    'Birthday',
    'Wedding',
    'Anniversary',
    'Graduation',
    'Festival',
    'Baby Shower',
    'Tech',
    'Electronics',
  ];
  budgets = ['All', 'Under Rs. 1500', 'Rs. 1500 - 3000', 'Rs. 3000+'];
  relations = ['All', 'Partner', 'Parents', 'Friends', 'Family', 'Colleagues'];

  ngOnInit() {
    this.loadGifts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load gifts from Firestore
   */
  loadGifts() {
    this.loading = true;
    this.error = '';

    this.giftsService
      .getGifts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (gifts: Gift[]) => {
          // Convert Gift to GiftItem
          this.gifts = gifts.map(gift => ({
            id: gift.id || '',
            name: gift.name,
            price: gift.price,
            category: gift.category,
            rating: gift.rating,
            tag: gift.tag,
            relation: gift.relation,
            imageUrl: gift.imageUrl
          }));
          this.loading = false;
          console.log('Gifts loaded from Firestore:', this.gifts);
        },
        (error) => {
          console.error('Error loading gifts:', error);
          this.error = 'Failed to load gifts. Showing sample data.';
          this.loadSampleGifts();
          this.loading = false;
        }
      );
  }

  /**
   * Load sample gifts if Firestore is not available
   */
  private loadSampleGifts() {
    this.gifts = [
      {
        id: 'b1',
        name: 'Smart Watch',
        price: 4499,
        category: 'Birthday',
        rating: 4.7,
        tag: 'Popular',
        relation: 'Friends',
        imageUrl: 'https://images.pexels.com/photos/19961769/pexels-photo-19961769.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        id: 'b2',
        name: 'Bluetooth Speaker',
        price: 2199,
        category: 'Birthday',
        rating: 4.6,
        tag: 'Music',
        relation: 'Friends',
        imageUrl: 'https://images.pexels.com/photos/5511714/pexels-photo-5511714.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
      {
        id: 'b3',
        name: 'Perfume Gift Set',
        price: 1899,
        category: 'Birthday',
        rating: 4.8,
        tag: 'Luxury',
        relation: 'Partner',
        imageUrl: 'https://images.pexels.com/photos/9202849/pexels-photo-9202849.jpeg?auto=compress&cs=tinysrgb&w=900',
      },
    ];
  }

  /**
   * Get filtered gifts based on search and filter criteria
   */
  get filteredGifts() {
    return this.gifts.filter((gift) => {
      const matchesSearch = gift.name.toLowerCase().includes(this.filter.search.toLowerCase());
      const matchesCategory = this.filter.category === 'All' || gift.category === this.filter.category;
      const matchesBudget =
        this.filter.budget === 'All' ||
        (this.filter.budget === 'Under Rs. 1500' && gift.price < 1500) ||
        (this.filter.budget === 'Rs. 1500 - 3000' && gift.price >= 1500 && gift.price <= 3000) ||
        (this.filter.budget === 'Rs. 3000+' && gift.price > 3000);
      const matchesRelation =
        this.filter.relation === 'All' || gift.relation === this.filter.relation;
      return matchesSearch && matchesCategory && matchesBudget && matchesRelation;
    });
  }

  /**
   * Add gift to cart
   */
  addToCart(gift: GiftItem) {
    this.cart.add(gift);
    console.log(`Added ${gift.name} to cart`);
  }

  /**
   * Handle image load errors
   */
  handleImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.fallbackImage) {
      target.src = this.fallbackImage;
    }
  }
}
