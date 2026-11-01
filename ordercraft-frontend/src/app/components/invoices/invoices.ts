import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css'
})
export class Invoices implements OnInit {

  invoices: any[] = [];
  searchText = '';

  showForm = false;
  loading = false;
  saving = false;
  errorMessage = '';

  newInvoice = {
    invoiceNumber: '',
    customerId: null as number | null,
    orderId: null as number | null,
    amount: null as number | null,
    invoiceDate: '',
    status: 'Pending'
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getInvoices();
  }

  get filteredInvoices(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.invoices;
    }

    return [...this.invoices]
      .filter(invoice =>
        String(invoice.invoiceNumber || '').toLowerCase().includes(search) ||
        String(invoice.customerId || '').toLowerCase().includes(search) ||
        String(invoice.orderId || '').toLowerCase().includes(search) ||
        String(invoice.status || '').toLowerCase().includes(search)
      )
      .sort((a, b) => {
        const priority = (invoice: any) => {
          const number = String(invoice.invoiceNumber || '').toLowerCase();

          if (number === search) return 0;
          if (number.startsWith(search)) return 1;
          return 2;
        };

        return priority(a) - priority(b);
      });
  }

  get totalInvoices(): number {
    return this.invoices.length;
  }

  get paidInvoices(): number {
    return this.invoices.filter(
      invoice => invoice.status?.toLowerCase() === 'paid'
    ).length;
  }

  get pendingInvoices(): number {
    return this.invoices.filter(
      invoice => invoice.status?.toLowerCase() === 'pending'
    ).length;
  }

  get overdueInvoices(): number {
    return this.invoices.filter(
      invoice => invoice.status?.toLowerCase() === 'overdue'
    ).length;
  }

  get totalInvoiceAmount(): number {
    return this.invoices.reduce(
      (total, invoice) => total + (Number(invoice.amount) || 0),
      0
    );
  }

  getInvoices(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/invoices')
      .subscribe({
        next: (data) => {
          this.invoices = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : [];

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading invoices:', error);
          this.loading = false;
          this.errorMessage = 'Unable to load invoices. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  addInvoice(): void {
    if (
      !this.newInvoice.invoiceNumber.trim() ||
      !this.newInvoice.customerId ||
      !this.newInvoice.orderId ||
      this.newInvoice.amount === null ||
      this.newInvoice.amount < 0 ||
      !this.newInvoice.invoiceDate ||
      !this.newInvoice.status
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const invoiceData = {
      invoiceNumber: this.newInvoice.invoiceNumber.trim(),
      customerId: this.newInvoice.customerId,
      orderId: this.newInvoice.orderId,
      amount: this.newInvoice.amount,
      invoiceDate: this.newInvoice.invoiceDate,
      status: this.newInvoice.status
    };

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/invoices',
      invoiceData
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newInvoice = {
          invoiceNumber: '',
          customerId: null,
          orderId: null,
          amount: null,
          invoiceDate: '',
          status: 'Pending'
        };

        this.showForm = false;
        this.getInvoices();

        alert('Invoice added successfully!');
      },
      error: (error) => {
        console.error('Error adding invoice:', error);
        this.saving = false;
        alert('Failed to add invoice.');
      }
    });
  }
}