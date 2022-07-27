import { Plugin } from "@nuxt/types";
import { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { initializeAxios, initializeCookies } from "@/utils/api";

const hideLoading = () => {
  if (!process.client) return;
  const warperid = document.getElementById("loader-wrapper");
  if (warperid) {
    warperid.style.display = "none";
  }
};
const showLoading = () => {
  if (!process.client) return;
  const warperid = document.getElementById("loader-wrapper");
  if (warperid) {
    warperid.style.display = "";
  }
};

const accessor: Plugin = ({
  error,
  app: { $axios, $cookies, $router, $store },
}) => {
  initializeAxios($axios);
  initializeCookies($cookies);

  $axios.onRequest((config: AxiosRequestConfig) => {
    showLoading();
    return config;
  });
  $axios.onError((error: any) => {
    hideLoading();
    // console.log('onError', error)
    if (error.response === undefined) {
      throw error;
    }
    throw error;
  });
  $axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      hideLoading();
      const res = response;
      if (res.status === 200) {
        return res;
      } else {
        alert(res.status);
        error({ statusCode: res.status, message: res.data.msg });
        return Promise.reject(res);
      }
    },
    (err: any) => {
      const res = err.response;
      // console.log('====>', res)
      if (res.status === 401) {
        // window.$nuxt.$alert(res.data.message)
        window.location.href = "/login";
      } else {
        window.$nuxt.$alert(res.data.message || "서버 에러 발생");
      }
      hideLoading();
      return Promise.reject(err);
    }
  );

  $axios.onResponseError((err: any) => {
    const code = parseInt(err.response && err.response.status);
    // console.log('onResponseError', err)
    return Promise.reject(err);
  });
};

7;

export default accessor;
