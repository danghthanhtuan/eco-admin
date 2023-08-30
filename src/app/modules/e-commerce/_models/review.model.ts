import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Review extends BaseModel {
  id: number;
  content: number;
  rate: number;
  name: string;
}