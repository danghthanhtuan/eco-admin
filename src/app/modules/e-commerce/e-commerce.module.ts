import { Attribute, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { ECommerceComponent } from './e-commerce.component';
import { ECommerceRoutingModule } from './e-commerce-routing.module';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteCustomerModalComponent } from './customers/components/delete-customer-modal/delete-customer-modal.component';
import { DeleteCustomersModalComponent } from './customers/components/delete-customers-modal/delete-customers-modal.component';
import { FetchCustomersModalComponent } from './customers/components/fetch-customers-modal/fetch-customers-modal.component';
import { UpdateCustomersStatusModalComponent } from './customers/components/update-customers-status-modal/update-customers-status-modal.component';
import { EditCustomerModalComponent } from './customers/components/edit-customer-modal/edit-customer-modal.component';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductModalComponent } from './products/components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from './products/components/delete-products-modal/delete-products-modal.component';
import { UpdateProductsStatusModalComponent } from './products/components/update-products-status-modal/update-products-status-modal.component';
import { FetchProductsModalComponent } from './products/components/fetch-products-modal/fetch-products-modal.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { RemarksComponent } from './products/product-edit/remarks/remarks.component';
import { SpecificationsComponent } from './products/product-edit/specifications/specifications.component';
import { DeleteRemarkModalComponent } from './products/product-edit/remarks/delete-remark-modal/delete-remark-modal.component';
import { DeleteRemarksModalComponent } from './products/product-edit/remarks/delete-remarks-modal/delete-remarks-modal.component';
import { FetchRemarksModalComponent } from './products/product-edit/remarks/fetch-remarks-modal/fetch-remarks-modal.component';
import { DeleteSpecModalComponent } from './products/product-edit/specifications/delete-spec-modal/delete-spec-modal.component';
import { DeleteSpecsModalComponent } from './products/product-edit/specifications/delete-specs-modal/delete-specs-modal.component';
import { FetchSpecsModalComponent } from './products/product-edit/specifications/fetch-specs-modal/fetch-specs-modal.component';
import { EditRemarkModalComponent } from './products/product-edit/remarks/edit-remark-modal/edit-remark-modal.component';
import { EditSpecModalComponent } from './products/product-edit/specifications/edit-spec-modal/edit-spec-modal.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DeleteAttributeModalComponent } from './attributes/components/delete-attribute-modal/delete-attribute-modal.component';
import { AddAttributeModalComponent } from './attributes/components/add-attribute-modal/add-attribute-modal.component';
import { AttributeValuesComponent } from './attribute-values/attribute-values.component';
import { AddAttributeValueModalComponent } from './attribute-values/components/add-attribute-value-modal/add-attribute-value-modal.component';
import { DeleteAttributeValueModalComponent } from './attribute-values/components/delete-attribute-value-modal/delete-attribute-value-modal.component';
import { CategoryComponent } from './categories/categories.component';
import { AddCategoriesModalComponent } from './categories/components/add-categories-modal/add-categories-modal.component';
import { SlidesComponent } from './slides/slides.component';
import { AddSlidesModalComponent } from './slides/components/add-slides-modal.component';
import { DeleteSlidesModalComponent } from './slides/components/delete-slides-modal.component';
import { TrademarksComponent } from './trademarks/trademarks.component';
import { DeleteTrademarksModalComponent } from './trademarks/components/delete-trademarks-modal.component';
import { AddTrademarksModalComponent } from './trademarks/components/add-trademarks-modal.component';
import { FiltersComponent } from './filters/filters.component';
import { DeleteFilterModalComponent } from './filters/components/delete-filter-modal/delete-filter-modal.component';
import { AddFilterModalComponent } from './filters/components/add-filter-modal/add-filter-modal.component';
import { FilterValuesComponent } from './filter-values/filter-values.component';
import { AddFilterValueModalComponent } from './filter-values/components/add-filter-value-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    CustomersComponent,
    ProductsComponent,
    ECommerceComponent,
    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    FetchCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    EditCustomerModalComponent,
    DeleteProductModalComponent,
    DeleteProductsModalComponent,
    UpdateProductsStatusModalComponent,
    FetchProductsModalComponent,
    ProductEditComponent,
    RemarksComponent,
    SpecificationsComponent,
    DeleteRemarkModalComponent,
    DeleteRemarksModalComponent,
    FetchRemarksModalComponent,
    DeleteSpecModalComponent,
    DeleteSpecsModalComponent,
    FetchSpecsModalComponent,
    EditRemarkModalComponent,
    EditSpecModalComponent,
    AttributesComponent,
    DeleteAttributeModalComponent,
    AddAttributeModalComponent,
    AttributeValuesComponent,
    AddAttributeValueModalComponent,
    DeleteAttributeValueModalComponent,
    CategoryComponent,
    AddCategoriesModalComponent,
    SlidesComponent,
    AddSlidesModalComponent,
    DeleteSlidesModalComponent,
    TrademarksComponent,
    DeleteTrademarksModalComponent,
    AddTrademarksModalComponent,
    FiltersComponent,
    AddFilterModalComponent,
    DeleteFilterModalComponent,
    FilterValuesComponent,
    AddFilterValueModalComponent,

    TransactionsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ECommerceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatRadioModule
  ],
  entryComponents: [
    DeleteCustomerModalComponent,
    DeleteCustomersModalComponent,
    UpdateCustomersStatusModalComponent,
    FetchCustomersModalComponent,
    EditCustomerModalComponent,
    DeleteProductModalComponent,
    DeleteProductsModalComponent,
    UpdateProductsStatusModalComponent,
    FetchProductsModalComponent,
    DeleteRemarkModalComponent,
    DeleteRemarksModalComponent,
    FetchRemarksModalComponent,
    DeleteSpecModalComponent,
    DeleteSpecsModalComponent,
    FetchSpecsModalComponent,
    EditRemarkModalComponent,
    EditSpecModalComponent,

  ]
})
export class ECommerceModule {}
