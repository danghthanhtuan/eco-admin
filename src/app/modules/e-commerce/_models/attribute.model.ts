import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Attribute extends BaseModel {
  id: number;
  attributeName: string;
  url: string;
}
