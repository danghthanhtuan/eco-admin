import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Banners extends BaseModel {
  id: number;
  productId: Number;
  nameBanner: string;
  position: string;
  pathImage: string;
  status: Number;
  urlTarget: string;
  page : string;
}