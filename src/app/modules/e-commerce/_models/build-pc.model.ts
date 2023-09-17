import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface BuildPC extends BaseModel {
  id: number;
  categoryIds: string;
  keySearch: string;
  name: string;
}