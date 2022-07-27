import { Middleware } from "@nuxt/types";
import { getToken, setToken, removeToken } from "@/utils/cookies";
import { Notification } from "element-ui";
import { Router } from "express";
const auth: Middleware = async ({ route, redirect, store, $cookies, app }) => {
  try {
    if (route.path === "/login") return;
    if (getToken()) {
      if (
        !route.path.startsWith("/api/") &&
        route.path !== "/login" &&
        route.path !== "/"
      ) {
        // const isok = await service.getAuthCheck(route.path);
        // if (route.path === "/esm/view") {
        // } else if (!isok) return redirect("/login");
      }
      await store.dispatch("setMenuList", route.path);
      await store.dispatch("GetUserInfo", "");
    } else if (route.path !== "/login") {
      return redirect({
        path: "/login",
      });
    }
  } catch (e) {
    // console.log("error===>", e);
    return redirect({
      path: "/login",
    });
  }
};

export default auth;
