import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Filter extends BaseModel {
  id: number;
  displayText: string;
  typeSearch: number;
}

export interface FilterValue extends BaseModel {
  id: number;
  attributeId: number;
  name: string;
  url: string;
  nameExtra: string;
}


