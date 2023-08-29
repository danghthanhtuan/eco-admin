import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface ProductImage extends BaseModel {
  id: number;
  sortOrder: number;
  imageUrl: string;
}