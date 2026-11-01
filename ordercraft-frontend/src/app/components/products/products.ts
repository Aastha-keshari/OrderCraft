
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  products: any[] = [];
  searchText = '';

  loading = false;
  saving = false;
  showForm = false;
  errorMessage = '';

  private apiUrl = 'http://localhost:8082/api/products';

  newProduct = {
    name: '',
    description: '',
    price: null as number | null,
    stockQuantity: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProducts();
  }

  // Load products from database
  getProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(this.apiUrl)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.products = data;
          } else if (Array.isArray(data?.content)) {
            this.products = data.content;
          } else {
            this.products = [];
            console.error('Unexpected product response:', data);
          }
        },
        error: (error) => {
          console.error('Product loading error:', error);
          this.errorMessage =
            'Unable to load products. Check whether the backend is running.';
        }
      });
  }

  // Search products by name
  get filteredProducts(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.products;
    }

    return this.products.filter(product =>
      product.name?.toLowerCase().includes(search)
    );
  }

  // Total stock
  get totalStock(): number {
    return this.products.reduce(
      (total, product) => total + Number(product.stockQuantity || 0),
      0
    );
  }

  // Add new product
  addProduct(): void {

    if (
      !this.newProduct.name.trim() ||
      !this.newProduct.description.trim() ||
      this.newProduct.price === null ||
      this.newProduct.stockQuantity === null
    ) {
      alert('Please fill all required fields.');
      return;
    }

    if (
      this.newProduct.price < 0 ||
      this.newProduct.stockQuantity < 0
    ) {
      alert('Price and stock cannot be negative.');
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const productData = {
      name: this.newProduct.name.trim(),
      description: this.newProduct.description.trim(),
      price: this.newProduct.price,
      stockQuantity: this.newProduct.stockQuantity
    };

    this.http.post(this.apiUrl, productData)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => {
          alert('Product added successfully!');

          this.newProduct = {
            name: '',
            description: '',
            price: null,
            stockQuantity: null
          };

          this.showForm = false;

          // Reload saved products from database
          this.getProducts();
        },
        error: (error) => {
          console.error('Product saving error:', error);
          this.errorMessage = 'Unable to save product. Please try again.';
        }
      });
  }
}
