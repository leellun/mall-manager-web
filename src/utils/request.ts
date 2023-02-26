import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import WebConfig from "@/config/defaultSettings";
import { message, Modal } from "ant-design-vue";
import type { RestResponse } from "@/api/types";
import JSONBig from "json-bigint";

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // api 的 base_url
  timeout: WebConfig.timeout, // 请求超时时间
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  transformResponse: [
    function (data) {
      // 对 data 进行任意转换处理
      try {
        return JSONBig.parse(data);
      } catch (err) {
        return data;
      }
    },
  ],
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken() && config.headers) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${getToken()}`); // 让每个请求携带自定义token 请根据实际情况自行修改
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    let responseData = response.data;
    if (response.request.responseType !== "blob") {
      if(responseData.code===401){
        const userStore = useUserStore();
        userStore.loginOut();
      }
      if (responseData.code != 200) {
        return Promise.reject(responseData.message);
      }
      return responseData;
    }
    return responseData;
  },
  (error) => {
    if (error.toString().indexOf("Error: timeout") !== -1) {
      return Promise.reject("网络请求超时");
    }
    console.log(error.response);
    if (error.response && error.response.data) {
      let data = error.response.data;
      if (data.code === 401) {
        Modal.confirm({
          title: "系统提示",
          content: "登录状态已过期，您可以继续留在该页面，或者重新登录",
          okText: "重新登录",
          cancelText: "取消",
          onOk: () => {
            const userStore = useUserStore();
            userStore
              .loginOut()
              .then((resolve) => {
                useRouter().push({ name: "login" });
              })
              .catch((err) => {
                location.reload();
              });
          },
        });
      } else {
        return Promise.reject(data.msg);
      }
    } else {
      return Promise.reject("接口请求失败");
    }
    return Promise.reject(error);
  }
);
const getToken = () => {
  const userStore = useUserStore();
  return userStore.token;
};
export const httpRequest = <R = AxiosResponse<any>, D = any>(
  config: AxiosRequestConfig<D>
) => {
  return service<any, RestResponse<R>>(config);
};
export const httpRequestWithMsg = <R = AxiosResponse<any>, D = any>(
  config: AxiosRequestConfig<D>
) => {
  return new Promise<RestResponse<R>>((resolve, reject) => {
    let promise = service<any, RestResponse<R>>(config);
    promise
      .then((res) => {
        message.success(res.message);
        resolve(res);
      })
      .catch((err) => {
        console.log(err)
        message.error(err);
        reject(err);
      })
  });
};
export default service;
