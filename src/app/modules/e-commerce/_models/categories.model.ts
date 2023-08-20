import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Categories extends BaseModel {
  id: number;
  categoryName: string;
  //urlSlug: string;
  status: number;
  categoryParent: number;
  sortOrder: number;
  seoDescription: string;
  seoTitle: string;
  seoKeyword: string;
  categoryTags: string;
  imageUrl: string;
  content: string;

}