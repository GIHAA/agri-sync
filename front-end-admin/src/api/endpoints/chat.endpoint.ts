/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointPathId } from '../../interfaces'
import axios from '../request-handler'

const subPath = '/chat'

/* TODO: Define data types for requests and responses */

const sendMessage = async (data: any) => {
  try {
    const response = await axios.post(`${subPath}/send`, data)
    return response
  } catch (error) {
    return false
  }
}

const getMessages = async (id: EndpointPathId) => {
  try {
    const response = await axios.get(`${subPath}/messages/${id}`)
    return response
  } catch (error) {
    return false
  }
}

export { sendMessage, getMessages }
