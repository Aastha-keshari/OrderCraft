import { Routes } from '@angular/router';

import { Layout } from './components/layout/layout';

import { dashboard } from './components/dashboard/dashboard';
import { customers } from './components/customers/customers';
import { Products } from './components/products/products';
import { Orders } from './components/orders/orders';
import { Bom } from './components/bom/bom';
import { PurchaseOrders } from './components/purchase-orders/purchase-orders';
import { Invoices } from './components/invoices/invoices';
import { Payments } from './components/payments/payments';

export const routes: Routes = [

  {
    path: '',
    component: Layout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: dashboard
      },

      {
        path: 'customer',
        component: customers
      },

      {
        path: 'product',
        component: Products
      },

      {
        path: 'order',
        component: Orders
      },

      {
        path: 'bom',
        component: Bom
      },

      {
        path: 'purchase-order',
        component: PurchaseOrders
      },

      {
        path: 'invoice',
        component: Invoices
      },

      {
        path: 'payment',
        component: Payments
      }

    ]
  }

];