import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Filter extends BaseModel {
  id: number;
  displayText: string;
  typeSearch: string;
  sortOrder: number;
}

export interface FilterValue extends BaseModel {
  filterValueId: number;
  filterId: number;
  filterValueDisplayText: string;
  filterSearchKey: string;
  minPrice: number;
  maxPrice: number;
  sortOrder: number;
}


