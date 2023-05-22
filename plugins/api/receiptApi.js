import { getRequest, createRequest } from './fetchHelper.js'
import { endpoint } from './endpoint.js'
const controller = 'receipt'
export async function getAllreceipt(start = '', end = '') {
  const queryString = new URLSearchParams({ startDate: start, endDate: end })
  return await getRequest(
    `${endpoint}${controller}/getAllReceipt?${queryString.toString()}`,
  )
}

export async function getPrefix() {
  return await getRequest(`${endpoint}${controller}/getPrefix`)
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
