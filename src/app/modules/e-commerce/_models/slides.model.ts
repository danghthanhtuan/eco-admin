import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Slide extends BaseModel {
  id: number;
  name: string;
  status: number;
  target: string;
  sortOrder: number;
  imageUrl: string;
}