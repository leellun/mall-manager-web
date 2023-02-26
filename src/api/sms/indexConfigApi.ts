import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page,PageSearch } from "../types";
export interface IndexConfig {
    configId:any
    configName:string
    configType:number
    goodsId:any
    redirectUrl:string
    configRank:number
    isDeleted:number
    createTime:string
    updateTime:string
}
export interface IndexConfigParamDTO{
    configId:any
    configName:string
    redirectUrl:string
    configType:number
    goodsId:any
    configRank:number
}
export interface IndexConfigSearchParam extends PageSearch{
    configType:number
}
export const _getIndexConfigPage = (params: IndexConfigSearchParam) => {
    return httpRequest<Page<IndexConfig>>({
      url: `/sms/admin/indexConfig/list`,
      method: "get",
      params
    });
};
export const _addIndexConfig = (data: IndexConfigParamDTO) => {
    return httpRequest<Page<IndexConfig>>({
      url: `/sms/admin/indexConfig/add`,
      method: "post",
      data
    });
};
export const _updateIndexConfig = (data: IndexConfigParamDTO) => {
    return httpRequest<Page<IndexConfig>>({
      url: `/sms/admin/indexConfig/update`,
      method: "put",
      data
    });
};
export const _getIndexConfig = (id: any) => {
    return httpRequest<Page<IndexConfig>>({
      url: `/sms/admin/indexConfig/detail/${id}`,
      method: "get",
    });
};
export const _deleteIndexConfigBatch = (ids: Array<any>) => {
    return httpRequestWithMsg({
      url: `/sms/admin/indexConfig/batchDelete`,
      method: "delete",
      data: { ids },
    });
  };
