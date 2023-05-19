import { getRequest, createRequest } from './fetchHelper.js'
import { endpoint } from './endpoint.js'
const controller = 'receipt'
export async function getAllreceipt(objQueryString = {}) {
  const queryString = new URLSearchParams(objQueryString)
  return await getRequest(
    `${endpoint}${controller}/getAllReceipt?${queryString.toString()}`,
  )
}

export async function getOneReceipt(id) {
  return await getRequest(
    `${endpoint}${controller}/getOneReceipt?receiptId=${id}`,
  )
}

export async function createReceipt(data) {
  return await createRequest(`${endpoint}${controller}/createReceipt`, data)
}
export async function updateItem(data) {
  return await createRequest(`${endpoint}${controller}/updateItem`, data)
}
export async function deleteItem(itemId) {
  return await createRequest(`${endpoint}${controller}/deleteItem`, { itemId })
}
