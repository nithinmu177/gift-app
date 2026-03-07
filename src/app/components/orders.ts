import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface OrderStatus {
  id: string;
  name: string;
  status: string;
  eta: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  orders: OrderStatus[] = [
    { id: 'ORD-2104', name: 'Wedding Gift Box', status: 'In Transit', eta: 'Arrives in 2 days' },
    { id: 'ORD-2105', name: 'Birthday Surprise Pack', status: 'Packed', eta: 'Arrives tomorrow' },
    { id: 'ORD-2106', name: 'Anniversary Frame', status: 'Delivered', eta: 'Delivered' },
  ];

  timeline = ['Pending', 'Packed', 'Shipped', 'In Transit', 'Delivered'];
}
