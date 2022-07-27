import Vue from "vue";
import * as common from "@/utils/common";
import commonService from "@/service/common-service";
interface test {
  promiseTest: Function;
}
interface apis {
  test: test;
}
declare module "vue/types/vue" {
  interface VueConstructor {
    $myGlobal: string;
  }
  interface Vue {
    $myProperty: string;
    $api: apis;
    $util: typeof common;
    $common: typeof commonService; // 1.
  }
}
