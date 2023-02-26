import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page, PageSearch } from "../types";

export interface Order {
  orderId: any;
  userId: any;
  orderNo: string;
  totalPrice: number;
  payStatus: number;
  payType: number;
  orderStatus: number;
  payTime: string;
  extraInfo: string;
  createTime: string;
  updateTime: string;
}
export interface OrderDetailVO {
  orderNo: string;
  payTypeString: string;
  totalPrice: number;
  payStatus: number;
  payType: number;
  payTime: string;
  orderStatusString: string;
  orderStatus: number;
  createTime: string;
  orderItemVOS: Array<OrderItemVO>;
}
export interface OrderItemVO {
  goodsId: any;
  goodsCount: number;
  sellingPrice: number;
  goodsName: string;
  goodsCoverImg: string;
}
export interface OrderSearchParam extends PageSearch {
  orderNo: string;
  orderStatus: number;
}
export const _getOrderPage = (params: OrderSearchParam) => {
  return httpRequest<Page<Order>>({
    url: `/oms/admin/order/list`,
    method: "get",
    params,
  });
};
export const _getOrderDetail = (id: any) => {
  return httpRequest<OrderDetailVO>({
    url: `/oms/admin/order/detail/${id}`,
    method: "get",
  });
};
export const _checkDone = (ids: Array<any>) => {
  return httpRequestWithMsg({
    url: `/oms/admin/order/checkDone`,
    method: "put",
    data: { ids },
  });
};
export const _checkOut = (ids: Array<any>) => {
  return httpRequestWithMsg({
    url: `/oms/admin/order/checkOut`,
    method: "put",
    data: { ids },
  });
};
export const _close = (ids: Array<any>) => {
  return httpRequestWithMsg({
    url: `/oms/admin/order/close`,
    method: "put",
    data: { ids },
  });
};
