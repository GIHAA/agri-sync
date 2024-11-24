import { EndpointPathId } from '../../interfaces'
import axios from '../request-handler'

const subPath = '/testproject-contact-public'

/* TODO: Remove after define data type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCustomer = async (data: any) => {
  const response = await axios.post(`${subPath}/save`, data)
  return response
}

const updateCustomer = async (id: EndpointPathId) => {
  const response = await axios.put(`${subPath}/edit/${id}`)
  return response
}

export { createCustomer, updateCustomer }
