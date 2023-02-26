import { defineStore } from "pinia";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./mutation-types";
import storage from "@/utils/Storage";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      set token(value: string) {
        storage.set(ACCESS_TOKEN, value);
      },
      get token(): string {
        const value = storage.get(ACCESS_TOKEN);
        return value ? value : "";
      },
      set refreshToken(value: string) {
        storage.set(REFRESH_TOKEN, value);
      },
      get refreshToken(): string {
        const value = storage.get(REFRESH_TOKEN);
        return value ? value : "";
      },
      showLogin: false,
    };
  },
  getters: {
    isLogin: (state) => {
      return state.token && state.token != "";
    },
  },
  actions: {
    setToken(accessToken: string, refreshToken: string) {
      this.token = accessToken;
      this.refreshToken = refreshToken;
    },
    loginOut() {
      this.setToken("", "");
      return new Promise((resolve, rej) => {
        resolve("");
      });
    },
  },
});
