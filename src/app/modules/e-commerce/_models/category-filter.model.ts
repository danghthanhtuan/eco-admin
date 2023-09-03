import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface CategoryFilter extends BaseModel {
  id: number;
  categoryName: string;
  filterID: number;
  filterSearchKey: string;
  filterValueDisplayText: number;
  typeSearch: string;
  filterSortOrder: string;
  minPrice: number;
  maxPrice: number;
  filterDisplayText: string;
  isUse: boolean;
  filterValueID: number;
}