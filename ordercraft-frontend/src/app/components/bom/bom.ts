
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bom.html',
  styleUrl: './bom.css'
})
export class Bom implements OnInit {

  boms: any[] = [];
  showForm = false;
  searchText = '';

  loading = false;
  saving = false;
  errorMessage = '';

  newBom = {
    productId: null as number | null,
    componentName: '',
    quantity: null as number | null,
    unit: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getBoms();
  }

  get filteredBoms(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.boms;
    }

    return this.boms.filter(bom =>
      String(bom.productId ?? '').toLowerCase().includes(search) ||
      String(bom.componentName ?? '').toLowerCase().includes(search) ||
      String(bom.unit ?? '').toLowerCase().includes(search)
    );
  }

  get totalBoms(): number {
    return this.boms.length;
  }

  get uniqueComponents(): number {
    return new Set(
      this.boms
        .map(bom => String(bom.componentName || '').trim().toLowerCase())
        .filter(Boolean)
    ).size;
  }

  get totalQuantity(): number {
    return this.boms.reduce(
      (total, bom) => total + (Number(bom.quantity) || 0),
      0
    );
  }

  getBoms(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>('http://localhost:8082/api/boms').subscribe({
      next: (data) => {
        this.boms = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading BOM:', error);
        this.loading = false;
        this.errorMessage = 'Unable to load BOM records. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  addBom(): void {
    if (
      !this.newBom.productId ||
      this.newBom.productId <= 0 ||
      !this.newBom.componentName.trim() ||
      this.newBom.quantity === null ||
      this.newBom.quantity <= 0 ||
      !this.newBom.unit.trim()
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const bomData = {
      productId: this.newBom.productId,
      componentName: this.newBom.componentName.trim(),
      quantity: this.newBom.quantity,
      unit: this.newBom.unit.trim()
    };

    this.saving = true;

    this.http.post<any>(
      'http://localhost:8082/api/boms',
      bomData
    ).subscribe({
      next: () => {
        this.saving = false;

        this.newBom = {
          productId: null,
          componentName: '',
          quantity: null,
          unit: ''
        };

        this.showForm = false;
        this.getBoms();

        alert('BOM added successfully!');
      },
      error: (error) => {
        console.error('Error adding BOM:', error);
        this.saving = false;
        alert('Failed to add BOM.');
      }
    });
  }
}
