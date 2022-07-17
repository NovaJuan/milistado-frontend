import { Item } from '../items/types'

export interface Store {
  id: string
  fullname: string
  nickname: string
  userId: string
  createdAt: number
  updatedAt: number
  items?: Item[]
}
