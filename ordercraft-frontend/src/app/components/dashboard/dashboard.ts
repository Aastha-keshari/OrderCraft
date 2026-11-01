
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class dashboard implements OnInit {

  customers: any[] = [];
  orders: any[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get completedOrders(): number {
    return this.orders.filter(
      order => order.status?.toLowerCase() === 'completed'
    ).length;
  }

  get pendingOrders(): number {
    return this.orders.filter(
      order => order.status?.toLowerCase() === 'pending'
    ).length;
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    let customersLoaded = false;
    let ordersLoaded = false;

    const checkLoading = () => {
      if (customersLoaded && ordersLoaded) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    this.http.get<any>('http://localhost:8082/api/customers')
      .subscribe({
        next: (data) => {
          this.customers = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          customersLoaded = true;
          checkLoading();
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          this.errorMessage = 'Unable to load customer data.';
          customersLoaded = true;
          checkLoading();
        }
      });

    this.http.get<any>('http://localhost:8082/api/manufacturing-orders')
      .subscribe({
        next: (data) => {
          this.orders = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          ordersLoaded = true;
          checkLoading();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.errorMessage = 'Unable to load order data.';
          ordersLoaded = true;
          checkLoading();
        }
      });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
