import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch } from "../types";

export interface ProductCategory {
  categoryId: any;
  categoryLevel: number;
  parentId: any;
  categoryName: string;
  categoryRank: number;
  isDeleted: number;
  createTime: string;
  updateTime: string;
  parent: ProductCategory;
}
export interface ProductCateSelectItem extends ProductCategory {
  children: Array<ProductCateSelectItem>;
}
export interface ProductCategoryParamDTO {
  categoryId: any;
  categoryLevel: number;
  parentId: any;
  categoryName: string;
  categoryRank: number;
}
export interface ProductCategoryPageParam extends PageSearch {
  categoryLevel: number;
  parentId: any;
}
export interface ProductCateSelectListVO {
  secondLevelCategories: Array<ProductCategory>;
  thirdLevelCategories: Array<ProductCategory>;
}
export const _getProductCategorysPage = (params: ProductCategoryPageParam) => {
  return httpRequest<Page<ProductCategory>>({
    url: `/pms/admin/productCategory/list`,
    method: "get",
    params,
  });
};
export const _getProductCategorySelect = (categoryId: any) => {
  return httpRequest<ProductCateSelectListVO>({
    url: `/pms/admin/productCategory/list4Select`,
    method: "get",
    params: {
      categoryId,
    },
  });
};
export const _getAllProductCategorySelect = () => {
  return httpRequest<Array<ProductCateSelectItem>>({
    url: `/pms/admin/productCategory/listAllSelect`,
    method: "get",
  });
};
export const _getProductCategoryDetail = (categoryId: any) => {
  return httpRequest<ProductCategory>({
    url: `/pms/admin/productCategory/detail/${categoryId}`,
    method: "get",
  });
};
export const _addProductCategory = (data: ProductCategoryParamDTO) => {
  return httpRequestWithMsg({
    url: `/pms/admin/productCategory/add`,
    method: "post",
    data,
  });
};
export const _updateProductCategory = (data: ProductCategoryParamDTO) => {
  return httpRequestWithMsg({
    url: `/pms/admin/productCategory/update`,
    method: "put",
    data,
  });
};
export const _deleteProductCategoryBatch = (ids: Array<any>) => {
  return httpRequestWithMsg({
    url: `/pms/admin/productCategory/batchDelete`,
    method: "delete",
    data: { ids },
  });
};
