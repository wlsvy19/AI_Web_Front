import Vue from "vue";
import * as util from "@/utils/common";
import common from "@/service/common-service"; // 2.
Vue.prototype.$api = {
  test: {
    promiseTest: () => {
      console.log("dddddddddd");
    },
  },
};

Vue.prototype.$util = util;
Vue.prototype.$common = common;

import VueHtml2Canvas from "vue-html2canvas";
Vue.use(VueHtml2Canvas);
