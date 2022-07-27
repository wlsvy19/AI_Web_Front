import { Module, Mutation, Action, VuexModule } from "vuex-module-decorators";
// import { Notification } from 'element-ui'
import { notification } from "@/utils/common";
import { getToken, setToken, removeToken } from "@/utils/cookies";

import service from "@/service/common-service";

import { IBaseResponseModel } from "~/models/common-model";
import loginService from "@/service/login-service";
import config from "../nuxt.config";
export const state = () => ({
  server: config.proxy["/v1"].target,
  token: "",
  userInfo: {},
  currentMenu: {},
  menuList: [],
  showChatDialog: false,
  isProd: process.env.NODE_ENV === "production",
  siteNm: "ails",
});
export const getters = {
  isGuest: (state) => state.userInfo.authCd === "30",
  isAdmin: (state) => state.userInfo.authCd === "90",
  token: (state) => state.token,
  hasBtnAuth: (state) => (cdV) => {
    console.log("=======state.btnlist", state.btnList);
    return state.btnList.filter((v) => v.btnNo + "" === cdV + "").length > 0;
  },
};
export const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload;
    setToken(payload);
  },
  set_preview(state, payload) {
    state.file = payload;
  },
  SET_CURRENTMENU(state, payload) {
    state.currentMenu = payload;
  },
  SET_USERINFO(state, payload) {
    state.userInfo = payload;
  },
  SET_MENU_LIST(state, payload) {
    state.menuList = payload;
  },
};
export const actions = {
  setToken({ commit }, payload) {
    commit("SET_TOKEN", payload);
  },
  setCurrentMenu({ commit }, payload) {
    commit("SET_CURRENTMENU", payload);
  },
  setMenus({ commit }, payload) {
    commit("SET_MENU_LIST", payload);
  },
  resetToken({ commit }, payload) {
    commit("SET_TOKEN", "");
    removeToken();
  },
  async setMenuList({ commit }, payload) {
    const body = await service.menuActives(payload);
    commit("SET_MENU_LIST", body.menuList);
    commit("SET_CURRENTMENU", body.currentMenu);
  },
  setUserInfo({ commit }, payload) {
    commit("SET_TOKEN", payload.accessToken);
    commit("SET_USERINFO", payload);
  },
  async GetUserInfo({ commit }, payload) {
    try {
      const result: IBaseResponseModel = await loginService.userInfo();
      if (result.isok) {
        const data = result.data;
        commit("SET_USERINFO", data);
      } else {
        notification("GetUserInfo", "실패");
      }
    } catch (e) {
      console.log(e);
    }
  },
  async LogOut({ commit }, showNoti = true) {
    try {
      if (showNoti) notification("로그아웃 성공", "성공"), removeToken();
      commit("SET_TOKEN", "");
      commit("SET_USERINFO", "");
    } catch (e) {}
  },
};
