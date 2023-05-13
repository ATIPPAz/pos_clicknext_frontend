import { getRequest, createRequest } from './fetchHelper.js'
import { endpoint } from './endpoint.js'
const controller = 'receipt'
export async function getAllreceipt(objQueryString = {}) {
  let queryString = '?'
  for (const key in objQueryString) {
    queryString += `${key}=${objQueryString[key]}&`
  }
  queryString = queryString.slice(0, -1)
  return await getRequest(
    `${endpoint}${controller}/getAllReceipt${queryString}`,
  )
}

export async function getOneReceipt(id) {
  return await getRequest(
    `${endpoint}${controller}/getOneReceipt?receiptId=${id}`,
  )
}

export async function createItem(data) {
  return await createRequest(`${endpoint}${controller}/getItem`, data)
}
export async function updateItem(data) {
  return await createRequest(`${endpoint}${controller}/updateItem`, data)
}
export async function deleteItem(itemId) {
  return await createRequest(`${endpoint}${controller}/deleteItem`, { itemId })
}
