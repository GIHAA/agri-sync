import axios from '../request-handler'

const login = async (data: any) => {
  return axios.post(`/login`, data)
}

// eslint-disable-next-line import/prefer-default-export
export { login }
