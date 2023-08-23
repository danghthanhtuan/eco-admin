import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ECommerceComponent } from './e-commerce.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { AttributesComponent } from './attributes/attributes.component';
import { AttributeValuesComponent } from './attribute-values/attribute-values.component';
import { CategoryComponent } from './categories/categories.component';
import { SlidesComponent } from './slides/slides.component';
import { TrademarksComponent } from './trademarks/trademarks.component';
import { FiltersComponent } from './filters/filters.component';
import { FilterValuesComponent } from './filter-values/filter-values.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: ECommerceComponent,
    children: [
       {
        path: 'attributes',
        component: AttributesComponent,
      },
      {
        path: 'attribute/values',
        component: AttributeValuesComponent,
      },
      {
        path: 'categories',
        component: CategoryComponent,
      },
      {
        path: 'slides',
        component: SlidesComponent,
      }, 
      {
        path: 'filter',
        component: FiltersComponent,
      },
      {
        path: 'filter/values',
        component: FilterValuesComponent,
      },
      {
        path: 'trademarks',
        component: TrademarksComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'product/add',
        component: ProductEditComponent
      },
      {
        path: 'product/edit',
        component: ProductEditComponent
      },
      {
        path: 'product/edit/:id',
        component: ProductEditComponent
      },
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: '**', redirectTo: 'customers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECommerceRoutingModule {}
