import { getRequest, createRequest } from './fetchHelper.js'
import { endpoint } from './endpoint.js'
const controller = 'item'
export async function getItem() {
  return await getRequest(`${endpoint}${controller}/getItems`)
}
export async function createItem(data) {
  return await createRequest(`${endpoint}${controller}/createItem`, data)
}
export async function updateItem(data) {
  return await createRequest(`${endpoint}${controller}/updateItem`, data)
}
export async function deleteItem(itemId) {
  return await createRequest(`${endpoint}${controller}/deleteItem`, { itemId })
}
