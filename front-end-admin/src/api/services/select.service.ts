/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable class-methods-use-this */
import * as SelectRequests from '../endpoints/select.endpoint'

class SelectApi {
  static getFilteredProducts(arg0: { location_id: number; page: number }) {
    throw new Error('Method not implemented.')
  }
  private static instance: SelectApi

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static useAPI(): SelectApi {
    if (SelectApi.instance === undefined) {
      SelectApi.instance = new SelectApi()
    }
    return this.instance
  }

  public getcustomer = async () => {
    try {
      const response = await SelectRequests.getCustomer()
      return response
    } catch (error) {
      return false
    }
  }

  public getcustomerType = async () => {
    try {
      const response = await SelectRequests.getCustomerType()
      return response
    } catch (error) {
      return false
    }
  }

  /* TODO: Temp data type: Please update according to endpoint */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getFilteredProducts = async (data: any) => {
    try {
      const response = await SelectRequests.getFilteredProducts(data)
      return response
    } catch (error) {
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProductCategories = async (params: any) => {
    try {
      const response = await SelectRequests.getProductCategories(params)
      return response
    } catch (error) {
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProductBrands = async (params: any) => {
    try {
      const response = await SelectRequests.getProductBrands(params)
      return response
    } catch (error) {
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProductTypes = async (params: any) => {
    try {
      const response = await SelectRequests.getProductTypes(params)
      return response
    } catch (error) {
      return false
    }
  }
}

export default SelectApi
