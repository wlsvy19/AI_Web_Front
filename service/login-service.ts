import { $axios } from "~/utils/api";
import { IBaseResponseModel } from "@/models/common-model";
import {
  ILoginSearchModel,
  ILoginResultModel,
  IFindIdModel,
  IFindPwModel,
} from "@/models/login-model";

class LoginService {
  async login(param: ILoginSearchModel) {
    const result = await $axios.request<IBaseResponseModel<ILoginResultModel>>({
      url: "/api/user/login",
      method: "post",
      data: param,
    });
    return result.data;
  }

  async userInfo() {
    const result = await $axios.request<IBaseResponseModel<ILoginResultModel>>({
      url: "api/user/info",
      method: "post",
      data: {},
    });
    return result.data;
  }
  async findId(param: IFindIdModel) {
    const result = await $axios.request<IBaseResponseModel<any>>({
      url: "api/user/findId",
      method: "post",
      data: param,
    });
    return result.data;
  }
  async findPw(param: IFindPwModel) {
    const result = await $axios.request<IBaseResponseModel<any>>({
      url: "/api/user/findPw",
      method: "post",
      data: param,
    });
    return result.data;
  }
}

export default new LoginService();
