import { httpRequest, httpRequestWithMsg } from "@/utils/request";
import { Page } from "../types";
export interface Dept {
  id: string;
  name: string;
  parentName: string;
  pid: string;
  deptSort: number;
  enabled: number;
  createTime: string;
  gmtModified: string;
  isLeaf: boolean;
  subCount: number;
  children: Array<Dept>;
}
export interface DeptSearch {
  pageNo: number;
  pageSize: number;
  name: string;
  enabled: number;
}
export const _getSubDepts = (pid: string) => {
  return httpRequest<Array<Dept>>({
    url: `/system/dept/sub/${pid}`,
    method: "get",
  });
};
export const _searchDepts = (name: string) => {
  return httpRequest<Array<Dept>>({
    url: `/system/dept/search`,
    method: "get",
    params: {
      name,
    },
  });
};
export const _getPageDepts = (data: DeptSearch) => {
  return httpRequest<Page<Dept>>({
    url: `/system/dept/list`,
    method: "post",
    data,
  });
};
export const _getDept = (id: string) => {
  return httpRequest< Dept>({
    url: `/system/dept/${id}`,
    method: "get",
  });
};
export const _addDept = (data: Dept) => {
  return httpRequestWithMsg({
    url: `/system/dept`,
    method: "post",
    data,
  });
};
export const _updateDept = (data: Dept) => {
  return httpRequestWithMsg({
    url: `/system/dept`,
    method: "put",
    data,
  });
};
export const _updateDeptSort = (id: string, deptSort: number) => {
  return httpRequest({
    url: `/system/dept/sort/${id}`,
    method: "put",
    params: { deptSort },
  });
};
export const _deleteDept = (data: string[]) => {
  return httpRequestWithMsg({
    url: `/system/dept`,
    method: "delete",
    data,
  });
};
export const _enableDept = (id: string, enable: number) => {
  return httpRequestWithMsg({
    url: `/system/dept/enable/${id}`,
    method: "put",
    params: { enable },
  });
};
