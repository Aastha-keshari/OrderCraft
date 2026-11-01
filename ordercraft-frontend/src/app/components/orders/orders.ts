import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: any[] = [];
  searchText = '';

  showForm = false;
  loading = false;
  saving = false;
  errorMessage = '';

  newOrder = {
    orderNumber: '',
    customerId: null as number | null,
    productId: null as number | null,
    quantity: null as number | null,
    status: 'Pending'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  get filteredOrders(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.orders;
    }

    return [...this.orders]
      .filter(order =>
        String(order.orderNumber || '').toLowerCase().includes(search)
      )
      .sort((a, b) => {
        const nameA = String(a.orderNumber || '').toLowerCase();
        const nameB = String(b.orderNumber || '').toLowerCase();

        const priority = (name: string) => {
          if (name === search) return 0;
          if (name.startsWith(search)) return 1;
          return 2;
        };

        return priority(nameA) - priority(nameB);
      });
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

  getOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/manufacturing-orders')
      .subscribe({
        next: (data) => {
          this.orders = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.loading = false;
          this.errorMessage = 'Unable to load manufacturing orders. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  addOrder(): void {
    if (
      !this.newOrder.orderNumber.trim() ||
      !this.newOrder.customerId ||
      !this.newOrder.productId ||
      this.newOrder.quantity === null ||
      this.newOrder.quantity <= 0 ||
      !this.newOrder.status
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const orderData = {
      orderNumber: this.newOrder.orderNumber.trim(),
      customerId: this.newOrder.customerId,
      productId: this.newOrder.productId,
      quantity: this.newOrder.quantity,
      status: this.newOrder.status
    };

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/manufacturing-orders',
      orderData
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newOrder = {
          orderNumber: '',
          customerId: null,
          productId: null,
          quantity: null,
          status: 'Pending'
        };

        this.showForm = false;
        this.getOrders();

        alert('Manufacturing order added successfully!');
      },
      error: (error) => {
        console.error('Error adding order:', error);
        this.saving = false;
        alert('Failed to add manufacturing order.');
      }
    });
  }
}