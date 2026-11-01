import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-orders.html',
  styleUrl: './purchase-orders.css'
})
export class PurchaseOrders implements OnInit {

  purchaseOrders: any[] = [];
  searchText = '';

  showForm = false;
  loading = false;
  saving = false;
  errorMessage = '';

  newPurchaseOrder = {
    poNumber: '',
    supplierName: '',
    productId: null as number | null,
    quantity: null as number | null,
    amount: null as number | null,
    status: 'Pending'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPurchaseOrders();
  }

  get filteredPurchaseOrders(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.purchaseOrders;
    }

    return [...this.purchaseOrders]
      .filter(po =>
        String(po.poNumber || '').toLowerCase().includes(search) ||
        String(po.supplierName || '').toLowerCase().includes(search)
      )
      .sort((a, b) => {
        const getPriority = (po: any) => {
          const number = String(po.poNumber || '').toLowerCase();
          const supplier = String(po.supplierName || '').toLowerCase();

          if (number === search || supplier === search) return 0;
          if (number.startsWith(search) || supplier.startsWith(search)) return 1;
          return 2;
        };

        return getPriority(a) - getPriority(b);
      });
  }

  get totalPurchaseOrders(): number {
    return this.purchaseOrders.length;
  }

  get pendingOrders(): number {
    return this.purchaseOrders.filter(
      po => po.status?.toLowerCase() === 'pending'
    ).length;
  }

  get receivedOrders(): number {
    return this.purchaseOrders.filter(
      po => po.status?.toLowerCase() === 'received'
    ).length;
  }

  get totalPurchaseAmount(): number {
    return this.purchaseOrders.reduce(
      (total, po) => total + (Number(po.amount) || 0),
      0
    );
  }

  getPurchaseOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/purchase-orders')
      .subscribe({
        next: (data) => {
          this.purchaseOrders = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading purchase orders:', error);
          this.loading = false;
          this.errorMessage = 'Unable to load purchase orders. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  addPurchaseOrder(): void {
    if (
      !this.newPurchaseOrder.poNumber.trim() ||
      !this.newPurchaseOrder.supplierName.trim() ||
      !this.newPurchaseOrder.productId ||
      this.newPurchaseOrder.quantity === null ||
      this.newPurchaseOrder.quantity <= 0 ||
      this.newPurchaseOrder.amount === null ||
      this.newPurchaseOrder.amount < 0 ||
      !this.newPurchaseOrder.status
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const purchaseOrderData = {
      poNumber: this.newPurchaseOrder.poNumber.trim(),
      supplierName: this.newPurchaseOrder.supplierName.trim(),
      productId: this.newPurchaseOrder.productId,
      quantity: this.newPurchaseOrder.quantity,
      amount: this.newPurchaseOrder.amount,
      status: this.newPurchaseOrder.status
    };

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/purchase-orders',
      purchaseOrderData
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newPurchaseOrder = {
          poNumber: '',
          supplierName: '',
          productId: null,
          quantity: null,
          amount: null,
          status: 'Pending'
        };

        this.showForm = false;
        this.getPurchaseOrders();

        alert('Purchase order added successfully!');
      },
      error: (error) => {
        console.error('Error adding purchase order:', error);
        this.saving = false;
        alert('Failed to add purchase order.');
      }
    });
  }
}