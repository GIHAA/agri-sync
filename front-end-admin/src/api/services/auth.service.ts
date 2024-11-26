import * as AuthRequests from '../endpoints/auth.endpoint'

class AuthApi {
  private static instance: AuthApi

  public static useAPI(): AuthApi {
    if (AuthApi.instance === undefined) {
      AuthApi.instance = new AuthApi()
    }
    return this.instance
  }

  /* TODO: Remove after define data type */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,class-methods-use-this
  public UserLogin = async (data: any) => {
    try {
      // const response = await AuthRequests.login(data)
      // localStorage.setItem('jwtToken', response.data.success.token)
      // localStorage.setItem('xTenant', response.data.success.xTenant)
      // return response
      return true
    } catch (error) {
      return false
    }
  }
}

export default AuthApi
