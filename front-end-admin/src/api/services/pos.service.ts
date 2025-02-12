/* eslint-disable class-methods-use-this */
import { EndpointPathId } from '../../interfaces'
import * as PosRequests from '../endpoints/pos.endpoint'

class PosApi {
  private static instance: PosApi

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static useAPI(): PosApi {
    if (PosApi.instance === undefined) {
      PosApi.instance = new PosApi()
    }
    return this.instance
  }

  /* TODO: Remove after define data type */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public createCustomer = async (data: any) => {
    try {
      const response = await PosRequests.createCustomer(data)
      return response
    } catch (error) {
      return false
    }
  }

  public updateCustomer = async (id: EndpointPathId) => {
    try {
      const response = await PosRequests.updateCustomer(id)
      return response
    } catch (error) {
      return false
    }
  }

  public createShipping = async (data: any) => {
    try {
      const response = await PosRequests.createCustomer(data)
      return response
    } catch (error) {
      return false
    }
  }

  public updateShipping = async (id: EndpointPathId) => {
    try {
      const response = await PosRequests.updateCustomer(id)
      return response
    } catch (error) {
      return false
    }
  }
}

export default PosApi
