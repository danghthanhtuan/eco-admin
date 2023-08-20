import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Trademarks extends BaseModel {
  id: number;
  name: string;
  url: string;
  sortOrder: number;
  imageUrl: string;
}