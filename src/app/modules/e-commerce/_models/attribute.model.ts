import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Attribute extends BaseModel {
  id: number;
  attributeName: string;
  url: string;
}

export interface AttributeValue extends BaseModel {
  id: number;
  attributeId: number;
  name: string;
  url: string;
  nameExtra: string;
}
