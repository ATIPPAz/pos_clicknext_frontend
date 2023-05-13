import { getRequest, createRequest } from './fetchHelper.js'
import { endpoint } from './endpoint.js'
const controller = 'unit'
export async function getUnit() {
  return await getRequest(`${endpoint}${controller}/getUnits`)
}
export async function createUnit(data) {
  return await createRequest(`${endpoint}${controller}/getUnit`, data)
}
export async function updateUnit(data) {
  return await createRequest(`${endpoint}${controller}/updateUnit`, data)
}
export async function deleteUnit(unitId) {
  return await createRequest(`${endpoint}${controller}/deleteUnit`, { unitId })
}
