import { $cookies } from "./api";

// App
const sidebarStatusKey = "apms-nuxt-sidebar-status";
export const getSidebarStatus = () => $cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) =>
  $cookies.set(sidebarStatusKey, sidebarStatus);

// User
const tokenKey = "ails-auth-token";
export const getToken = () => $cookies.get(tokenKey);
export const setToken = (token: string) => $cookies.set(tokenKey, token);
export const removeToken = () => $cookies.remove(tokenKey);

const userKey = "apms-nuxt-userinfo";
export const setCookie = (key: any, value: any) => $cookies.set(key, value);
export const getCookie = (key: any) => $cookies.get(key);
export const delCookie = (key: string) => $cookies.remove(key);

// 加密
export function compile(code: any) {
  let c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}

// 解密
export function uncompile(code: any) {
  code = unescape(code);
  let c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (let i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}
