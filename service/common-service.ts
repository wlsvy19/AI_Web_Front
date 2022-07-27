import { $axios } from "~/utils/api";
import {
  IPageInfoModel,
  ISearchCodeModel,
  ICodeModel,
} from "@/models/common-model";
import { IMenuModel } from "@/models/menus-model";
import { IBaseResponseModel } from "@/models/common-model";
import dayjs from "dayjs";

class CommonService {
  deleteDataset() {
    localStorage.removeItem("dataset");
  }
  getDataset() {
    const dataset = localStorage.getItem("dataset");
    const param = JSON.parse(dataset);
    return param;
  }
  getPageInitInfo = () => {
    const page: IPageInfoModel = {
      pageNo: 1,
      totalCount: 0,
      pageSize: 10,
    };
    return page;
  };

  //table index
  getPageIndex(pageInfo: IPageInfoModel, index: number) {
    return (pageInfo.pageNo - 1) * pageInfo.pageSize + index + 1;
  }

  // date short
  parseDate(dateStr: any) {
    if (!dateStr) return dateStr;
    if (dateStr.length < 10) return dateStr;
    return dateStr.substring(0, 10);
  }

  async request(param: any, url) {
    const result = await $axios.request<IBaseResponseModel<any>>({
      url: url,
      method: "post",
      data: param,
    });
    return result.data.data;
  }

  // 메뉴가져오기
  async getSiteMenus() {
    const menuList = await this.request("", "/api/common/menu/list");
    return menuList;
  }

  // routes path로 active하기
  async getCurrentMenu(path: string) {
    const menus = await this.getSiteMenus();
    // console.log('=====aaabbbcc', menus)
    const url = path;
    let currentMenu: IMenuModel = {};
    for (const v of menus) {
      if (url.includes(v.menuUrl || "-")) {
        currentMenu = v;
        if ((v.list || []).length > 0) {
          for (const vv of v.list || []) {
            const surl = (v.MENU_PATH || "-") + (vv.MENU_PATH || "-");
            // console.log('surl', surl)
            if (url.indexOf(surl) === 0) {
              // console.log(1)
              currentMenu.subMenu = vv;
              break;
            }
          }
        }
        break;
      }
    }

    return currentMenu;
  }

  // routes path로 active하기
  async menuActives(path: string) {
    const menuList = await this.request("", "/api/common/menu/list");
    const url = path;
    let currentMenu: any = {};
    const menusNew = menuList.map((v) => {
      // console.log('v.url', v.url)
      if (url.includes(v.MENU_PATH || "-")) {
        currentMenu = v;
        let list = v.list;
        if ((v.list || []).length > 0) {
          list = (v.list || []).map((vv) => {
            const surl = vv.MENU_PATH || "-";
            // console.log('surl', surl)
            if (url.indexOf(surl) === 0) {
              // console.log(1)
              currentMenu.subMenu = vv;
              return { ...vv, active: false };
            }
            return vv;
          });
        }
        return { ...v, list, active: false, opened: false };
      }
      return v;
    });
    return { menuList: menusNew, currentMenu };
  }

  async getAuthCheck(path: string) {
    const params = new URLSearchParams();
    params.append("path", path);
    const result = await $axios.request<IBaseResponseModel<any>>({
      url: "/api/common/authcheck",
      method: "post",
      data: params,
    });
    return result.data.data;
  }

  dateFormat(date: any, format: string) {
    return dayjs(date).format(format);
  }
}

export default new CommonService();
