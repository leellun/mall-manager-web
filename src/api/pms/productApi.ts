import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page,PageSearch } from "../types";
export interface Product{
    goodsId:any
    goodsName:string
    goodsIntro:string
    goodsCategoryId:any
    goodsCoverImg:string
    goodsCarousel:string
    tag:string
    originalPrice:number
    sellingPrice:number
    stockNum:number
    goodsSellStatus:number
    createTime:string
    updateTime:string
    goodsDetailContent:string
}
export interface ProductPageParam extends PageSearch{
    goodsName:string
    goodsSellStatus:number
}
export const _getProductsPage = (params: ProductPageParam) => {
    return httpRequest<Page<Product>>({
      url: `/pms/admin/product/list`,
      method: "get",
      params
    });
};
export const _addProduct = (data: Product) => {
    return httpRequestWithMsg({
      url: `/pms/admin/product/add`,
      method: "post",
      data
    });
};
export const _updateProduct = (data: Product) => {
    return httpRequestWithMsg({
      url: `/pms/admin/product/update`,
      method: "put",
      data
    });
};
export const _getProduct = (id: any) => {
    return httpRequest<Product>({
      url: `/pms/admin/product/detail/${id}`,
      method: "get"
    });
};
export const _updateProductStatus = (ids:Array<any>,sellStatus: any) => {
    return httpRequestWithMsg({
      url: `/pms/admin/product/updateStatus/${sellStatus}`,
      method: "put",
      data:{
        ids
      }
    });
};