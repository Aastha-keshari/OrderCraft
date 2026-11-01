import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  payments: any[] = [];
  searchText = '';

  showForm = false;
  loading = false;
  saving = false;
  errorMessage = '';

  newPayment = {
    invoiceId: null as number | null,
    amount: null as number | null,
    paymentDate: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPayments();
  }

  get filteredPayments(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.payments;
    }

    return this.payments.filter(payment =>
      String(payment.invoiceId ?? '').toLowerCase().includes(search) ||
      String(payment.paymentMethod ?? '').toLowerCase().includes(search) ||
      String(payment.status ?? '').toLowerCase().includes(search) ||
      String(payment.paymentDate ?? '').toLowerCase().includes(search)
    );
  }

  get totalPayments(): number {
    return this.payments.length;
  }

  get completedPayments(): number {
    return this.payments.filter(
      payment => payment.status?.toLowerCase() === 'completed'
    ).length;
  }

  get pendingPayments(): number {
    return this.payments.filter(
      payment => payment.status?.toLowerCase() === 'pending'
    ).length;
  }

  get failedPayments(): number {
    return this.payments.filter(
      payment => payment.status?.toLowerCase() === 'failed'
    ).length;
  }

  get totalPaymentAmount(): number {
    return this.payments.reduce(
      (total, payment) => total + (Number(payment.amount) || 0),
      0
    );
  }

  getPayments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/payments')
      .subscribe({
        next: (data) => {
          this.payments = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading payments:', error);
          this.loading = false;
          this.errorMessage = 'Unable to load payments. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  addPayment(): void {
    if (
      !this.newPayment.invoiceId ||
      this.newPayment.amount === null ||
      this.newPayment.amount <= 0 ||
      !this.newPayment.paymentDate ||
      !this.newPayment.paymentMethod ||
      !this.newPayment.status
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const paymentData = {
      invoiceId: this.newPayment.invoiceId,
      amount: this.newPayment.amount,
      paymentDate: this.newPayment.paymentDate,
      paymentMethod: this.newPayment.paymentMethod,
      status: this.newPayment.status
    };

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/payments',
      paymentData
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newPayment = {
          invoiceId: null,
          amount: null,
          paymentDate: '',
          paymentMethod: 'Bank Transfer',
          status: 'Pending'
        };

        this.showForm = false;
        this.getPayments();

        alert('Payment added successfully!');
      },
      error: (error) => {
        console.error('Error adding payment:', error);
        this.saving = false;
        alert('Failed to add payment.');
      }
    });
  }
}