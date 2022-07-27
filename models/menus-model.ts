export interface IMenuModel {
  id?: number
  pid?: number
  name?: string
  url?: string
  list?: IMenuModel[]
  visible?: boolean
  active?: boolean
  opened?: boolean
  subMenu?: IMenuModel
}
