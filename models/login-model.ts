import { IBaseModel } from "./common-model";

export interface ILoginSearchModel {
  loginId: string;
  loginPwd: string;
}

export interface ILoginResultModel extends IBaseModel {
  userNo?: string;
  userNm?: string;
  loginId?: string;
  authCd?: string;
  statCd?: string;
  email?: string;
  birDt?: string;
  sexCd?: string;
  cellNo?: string;
  telNo?: string;
  accessToken?: string;
  roles?: string;
}

export interface IFindIdModel {
  email: string;
  userNm: string;
}

export interface IFindPwModel {
  email: string;
  loginId: string;
  userNm: string;
}
