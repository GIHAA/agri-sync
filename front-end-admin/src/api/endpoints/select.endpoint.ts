import { castToURLQueryParamsString } from '../api-util'
import axios from '../request-handler'

const getCustomer = async () => {
  const response = await axios.get('/testproject-contact-public/index')
  return response
}

const getCustomerType = async () => {
  const response = await axios.get('/testproject-contact-public/save')
  return response
}

/* TODO: Temp data type: Please update according to endpoint */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFilteredProducts = async (data: any) => {
  const params = castToURLQueryParamsString(data)
  const response = await axios.get(
    `/ims/product/list${params ? '?' : ''}${params}`
  )
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductCategories = async (params: any) => {
  const response = await axios.get('/ims/categories/list', {
    params,
  })
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductBrands = async (params: any) => {
  const response = await axios.get('/ims/categories/list', params)
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProductTypes = async (params: any) => {
  const response = await axios.get('/ims/categories/list', params)
  return response
}

export {
  getCustomer,
  getCustomerType,
  getFilteredProducts,
  getProductCategories,
  getProductBrands,
  getProductTypes,
}
