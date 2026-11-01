import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class customers implements OnInit {

  customers: any[] = [];

  searchText = '';
  showForm = false;
  loading = true;
  errorMessage = '';
  saving = false;

  newCustomer = {
    name: '',
    email: '',
    phone: '',
    company: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  get filteredCustomers(): any[] {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      return this.customers;
    }

    return this.customers
      .map((customer, index) => {
        const name = String(customer.name || '').toLowerCase();

        const priority =
          name === query ? 0 :
          name.startsWith(query) ? 1 :
          name.includes(query) ? 2 : 3;

        return { customer, index, priority };
      })
      .filter(item => item.priority < 3)
      .sort((a, b) =>
        a.priority - b.priority || a.index - b.index
      )
      .map(item => item.customer);
  }

  get companyCount(): number {
    return new Set(
      this.customers
        .map(c => String(c.company || '').trim().toLowerCase())
        .filter(Boolean)
    ).size;
  }

  getCustomers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/customers')
      .subscribe({
        next: (data) => {
          console.log('Customers API response:', data);

          // Handle an array response or a paginated response.
          if (Array.isArray(data)) {
            this.customers = data;
          } else if (Array.isArray(data?.content)) {
            this.customers = data.content;
          } else {
            this.customers = [];
            console.error('Unexpected customer API response format.');
          }

          console.log('Customers loaded:', this.customers.length);

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Customer API error:', error);

          this.loading = false;
          this.errorMessage =
            'Unable to load customers. Please check the browser console.';
          this.cdr.detectChanges();
        }
      });
  }

  addCustomer(): void {
    if (
      !this.newCustomer.name.trim() ||
      !this.newCustomer.email.trim() ||
      !this.newCustomer.phone.trim() ||
      !this.newCustomer.company.trim()
    ) {
      alert('Please fill in all customer details.');
      return;
    }

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/customers',
      this.newCustomer
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newCustomer = {
          name: '',
          email: '',
          phone: '',
          company: ''
        };

        this.showForm = false;
        this.getCustomers();

        alert('Customer added successfully!');
      },

      error: (error) => {
        console.error('Error adding customer:', error);
        this.saving = false;
        alert('Failed to add customer.');
      }
    });
  }
}