import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, GiftItem } from '../services/cart.service';

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
export class GiftsComponent {
  fallbackImage = 'https://placehold.co/800x600?text=Gift+Image';

  constructor(private cart: CartService) {}

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
  ];
  budgets = ['All', 'Under Rs. 1500', 'Rs. 1500 - 3000', 'Rs. 3000+'];
  relations = ['All', 'Partner', 'Parents', 'Friends', 'Family', 'Colleagues'];

  gifts: GiftItem[] = [
    {
      id: 'b1',
      name: 'Smart Watch',
      price: 4499,
      category: 'Birthday',
      rating: 4.7,
      tag: 'Popular',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?smartwatch',
    },
    {
      id: 'b2',
      name: 'Bluetooth Speaker',
      price: 2199,
      category: 'Birthday',
      rating: 4.6,
      tag: 'Music',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?bluetooth-speaker',
    },
    {
      id: 'b3',
      name: 'Perfume Gift Set',
      price: 1899,
      category: 'Birthday',
      rating: 4.8,
      tag: 'Luxury',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?perfume-gift',
    },
    {
      id: 'b4',
      name: 'Customized Photo Frame',
      price: 999,
      category: 'Birthday',
      rating: 4.5,
      tag: 'Custom',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?photo-frame',
    },
    {
      id: 'b5',
      name: 'Birthday Cake Surprise',
      price: 1499,
      category: 'Birthday',
      rating: 4.7,
      tag: 'Sweet',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?birthday-cake',
    },
    {
      id: 'b6',
      name: 'Personalized Mug',
      price: 599,
      category: 'Birthday',
      rating: 4.4,
      tag: 'Custom',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?personalized-mug',
    },
    {
      id: 'w1',
      name: 'Dinner Set / Crockery Set',
      price: 3599,
      category: 'Wedding',
      rating: 4.6,
      tag: 'Classic',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?dinner-set',
    },
    {
      id: 'w2',
      name: 'Couple Watch Set',
      price: 4999,
      category: 'Wedding',
      rating: 4.7,
      tag: 'Couple',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?couple-watch',
    },
    {
      id: 'w3',
      name: 'Luxury Bed Sheet Set',
      price: 2799,
      category: 'Wedding',
      rating: 4.5,
      tag: 'Home',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?bedsheet',
    },
    {
      id: 'w4',
      name: 'Home Decor Showpiece',
      price: 1999,
      category: 'Wedding',
      rating: 4.4,
      tag: 'Decor',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?home-decor',
    },
    {
      id: 'w5',
      name: 'Microwave Oven',
      price: 6999,
      category: 'Wedding',
      rating: 4.6,
      tag: 'Appliance',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?microwave-oven',
    },
    {
      id: 'w6',
      name: 'Couple Photo Frame',
      price: 1199,
      category: 'Wedding',
      rating: 4.5,
      tag: 'Memories',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?couple-photo-frame',
    },
    {
      id: 'a1',
      name: 'Couple Jewelry Set',
      price: 3899,
      category: 'Anniversary',
      rating: 4.8,
      tag: 'Romantic',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?couple-jewelry',
    },
    {
      id: 'a2',
      name: 'Romantic Candle Light Dinner Kit',
      price: 2299,
      category: 'Anniversary',
      rating: 4.7,
      tag: 'Date night',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?candle-light-dinner',
    },
    {
      id: 'a3',
      name: 'Customized Couple Portrait',
      price: 1999,
      category: 'Anniversary',
      rating: 4.6,
      tag: 'Custom',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?couple-portrait',
    },
    {
      id: 'a4',
      name: 'Love Message Bottle',
      price: 799,
      category: 'Anniversary',
      rating: 4.4,
      tag: 'Sweet',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?message-bottle',
    },
    {
      id: 'a5',
      name: 'Couple Travel Bag Set',
      price: 3299,
      category: 'Anniversary',
      rating: 4.6,
      tag: 'Travel',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?travel-bag',
    },
    {
      id: 'a6',
      name: 'Personalized Photo Album',
      price: 1499,
      category: 'Anniversary',
      rating: 4.5,
      tag: 'Memories',
      relation: 'Partner',
      imageUrl: 'https://source.unsplash.com/800x800/?photo-album',
    },
    {
      id: 'g1',
      name: 'Laptop Backpack',
      price: 2499,
      category: 'Graduation',
      rating: 4.6,
      tag: 'Campus',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?laptop-backpack',
    },
    {
      id: 'g2',
      name: 'Smart Pen / Digital Notebook',
      price: 3999,
      category: 'Graduation',
      rating: 4.5,
      tag: 'Tech',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?digital-notebook',
    },
    {
      id: 'g3',
      name: 'Inspirational Book Set',
      price: 1599,
      category: 'Graduation',
      rating: 4.7,
      tag: 'Books',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?book-set',
    },
    {
      id: 'g4',
      name: 'Graduation Photo Frame',
      price: 999,
      category: 'Graduation',
      rating: 4.4,
      tag: 'Memories',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?graduation-frame',
    },
    {
      id: 'g5',
      name: 'Premium Diary & Pen Set',
      price: 1299,
      category: 'Graduation',
      rating: 4.6,
      tag: 'Classic',
      relation: 'Colleagues',
      imageUrl: 'https://source.unsplash.com/800x800/?pen-set',
    },
    {
      id: 'g6',
      name: 'Bluetooth Headphones',
      price: 2999,
      category: 'Graduation',
      rating: 4.7,
      tag: 'Audio',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?bluetooth-headphones',
    },
    {
      id: 'f1',
      name: 'Dry Fruit Gift Box',
      price: 1799,
      category: 'Festival',
      rating: 4.6,
      tag: 'Festive',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?dry-fruits',
    },
    {
      id: 'f2',
      name: 'Decorative Lamp / Diyas',
      price: 1299,
      category: 'Festival',
      rating: 4.5,
      tag: 'Decor',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?diya',
    },
    {
      id: 'f3',
      name: 'Chocolate Gift Basket',
      price: 1499,
      category: 'Festival',
      rating: 4.6,
      tag: 'Sweet',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?chocolate-gift',
    },
    {
      id: 'f4',
      name: 'Sweets Gift Hamper',
      price: 1699,
      category: 'Festival',
      rating: 4.7,
      tag: 'Traditional',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?sweets-hamper',
    },
    {
      id: 'f5',
      name: 'Festival Decoration Kit',
      price: 1199,
      category: 'Festival',
      rating: 4.5,
      tag: 'Decor',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?festival-decor',
    },
    {
      id: 'f6',
      name: 'Premium Tea / Coffee Set',
      price: 1399,
      category: 'Festival',
      rating: 4.6,
      tag: 'Warm',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?coffee-set',
    },
    {
      id: 'bs1',
      name: 'Baby Clothes Set',
      price: 1299,
      category: 'Baby Shower',
      rating: 4.6,
      tag: 'Soft',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?baby-clothes',
    },
    {
      id: 'bs2',
      name: 'Baby Toy Set',
      price: 999,
      category: 'Baby Shower',
      rating: 4.5,
      tag: 'Fun',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?baby-toys',
    },
    {
      id: 'bs3',
      name: 'Baby Care Kit',
      price: 1599,
      category: 'Baby Shower',
      rating: 4.6,
      tag: 'Care',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?baby-care',
    },
    {
      id: 'bs4',
      name: 'Baby Blanket',
      price: 899,
      category: 'Baby Shower',
      rating: 4.5,
      tag: 'Cozy',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?baby-blanket',
    },
    {
      id: 'bs5',
      name: 'Baby Walker',
      price: 3499,
      category: 'Baby Shower',
      rating: 4.4,
      tag: 'Support',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?baby-walker',
    },
    {
      id: 'bs6',
      name: 'Soft Plush Toys',
      price: 799,
      category: 'Baby Shower',
      rating: 4.7,
      tag: 'Cute',
      relation: 'Family',
      imageUrl: 'https://source.unsplash.com/800x800/?plush-toy',
    },
    {
      id: 't1',
      name: 'Wireless Earbuds',
      price: 2499,
      category: 'Tech',
      rating: 4.7,
      tag: 'Audio',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?wireless-earbuds',
    },
    {
      id: 't2',
      name: 'Smart Watch',
      price: 4499,
      category: 'Tech',
      rating: 4.7,
      tag: 'Wearable',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?smart-watch',
    },
    {
      id: 't3',
      name: 'Power Bank',
      price: 1299,
      category: 'Tech',
      rating: 4.6,
      tag: 'Travel',
      relation: 'Colleagues',
      imageUrl: 'https://source.unsplash.com/800x800/?power-bank',
    },
    {
      id: 't4',
      name: 'Gaming Mouse',
      price: 1799,
      category: 'Tech',
      rating: 4.5,
      tag: 'Gaming',
      relation: 'Friends',
      imageUrl: 'https://source.unsplash.com/800x800/?gaming-mouse',
    },
    {
      id: 't5',
      name: 'Bluetooth Keyboard',
      price: 1999,
      category: 'Tech',
      rating: 4.6,
      tag: 'Work',
      relation: 'Colleagues',
      imageUrl: 'https://source.unsplash.com/800x800/?bluetooth-keyboard',
    },
    {
      id: 't6',
      name: 'Tablet Stand',
      price: 699,
      category: 'Tech',
      rating: 4.4,
      tag: 'Desk',
      relation: 'Colleagues',
      imageUrl: 'https://source.unsplash.com/800x800/?tablet-stand',
    },
  ];

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
