export interface IPageInfoModel {
  pageNo: number
  totalCount: number
  pageSize: number
  totalPages?: number
}

export interface IBaseModel {
  wrPerNo?: string
  wrDtm?: string
  updtPerNo?: string
  updtDtm?: string
}

export interface IBaseResponseModel<T = any> {
  code?: number
  data: T
  isok?: boolean
  message?: string
}

export type IResultModel<T> = {
  page: IPageInfoModel
  list: T
}

export interface ICodeModel {
  cdV?: string
  cdNm?: string
  chked?: boolean
}

export interface ISearchCodeModel {
  code?: string
}
