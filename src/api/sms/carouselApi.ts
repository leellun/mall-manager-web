import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import type { Page,PageSearch } from "../types";
export interface Carousel {
    carouselId:any
    carouselUrl:string
    redirectUrl:string
    carouselRank:number
    createTime:string
    updateTime:string
}

export const _getCarouselPage = (params: PageSearch) => {
    return httpRequest<Page<Carousel>>({
      url: `/sms/admin/carousel/list`,
      method: "get",
      params
    });
};
export const _addCarousel = (data: Carousel) => {
    return httpRequestWithMsg({
      url: `/sms/admin/carousel/add`,
      method: "post",
      data
    });
};
export const _updateCarousel = (data: Carousel) => {
    return httpRequestWithMsg({
      url: `/sms/admin/carousel/update`,
      method: "put",
      data
    });
};
export const _getCarousel = (id: any) => {
    return httpRequest<Carousel>({
      url: `/sms/admin/carousel/detail/${id}`,
      method: "get",
    });
};
export const _deleteCarouselBatch = (ids: Array<any>) => {
    return httpRequestWithMsg({
      url: `/sms/admin/carousel/batchDelete`,
      method: "delete",
      data: { ids },
    });
  };