import { Routes } from '@angular/router';

import { CartComponent } from './components/cart';
import { EventsComponent } from './components/events';
import { GiftsComponent } from './components/gifts';
import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';
import { NotificationsComponent } from './components/notifications';
import { OrdersComponent } from './components/orders';
import { SignupComponent } from './components/signup';
import { redirectIfAuthenticated } from './guards/redirect-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [redirectIfAuthenticated] },
  { path: 'signup', component: SignupComponent, canActivate: [redirectIfAuthenticated] },
  { path: 'events', component: EventsComponent },
  { path: 'gifts', component: GiftsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'notifications', component: NotificationsComponent },
];
