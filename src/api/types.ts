export interface RestResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface Page<T> {
  total:number;
  list: Array<T>;
  pageNum:number;
  pageSize:number;
  size:number;
  startRow:number;
  endRow:number;
  pages:number;
  prePage:number;
  nextPage:number;
  isFirstPage:boolean;
  isLastPage:boolean;
  hasPreviousPage:boolean;
  hasNextPage:boolean;
  navigatePages:number;
  navigatepageNums:Array<number>
}
export interface PageSearch{
  pageNo: number;
  pageSize: number;
}