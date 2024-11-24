import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import authFetch from './axiosinterceptor'
import { GetTpAndspiResponse} from '../types/tpandsptype'


export const AddRole = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'add_user_details',
    mutationFn: async (data : any) => {
      console.log(data)
      try {
        const response = await authFetch.post('/auth/register-admin-users', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      console.log(error.response.data)
    },
  })
}

export const getRoles = (
  searchdata: string,
  roletype: string,
  page: number, pageSize : number
): UseQueryResult<GetTpAndspiResponse> => {
  return useQuery({
    queryKey: ['get_all_users_and_search_users', searchdata, roletype, page],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetTpAndspiResponse>(
          `/user-details?limit=${pageSize}&page=${page}&role=${roletype}${
            searchdata ? `&search=${searchdata}` : ''
          }`
        )
        return response?.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.error('Fetch error:', error)
    },
  })
}

export const getAllRoles = (
  searchdata: string,
  roletype: string,
  page: number, pageSize : number
): UseQueryResult<GetTpAndspiResponse> => {
  return useQuery({
    queryKey: ['get_all_roles', searchdata, roletype, page],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetTpAndspiResponse>(
          `/role-management?limit=${pageSize}&page=${page}${
            searchdata ? `&search=${searchdata}` : ''
          }`
        )
        return response?.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.error('Fetch error:', error)
    },
  })
}

export const useGetUserById = (userparameid: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_user_by_id', userparameid],
    queryFn: async () => {
      try {
        const response = await authFetch.get(
          `/user-details/keycloak-test/${userparameid}`
        )
        return response.data.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error: any) => {
      console.error('Fetch error:', error)
      console.log(error.response.data)
    },
  })
}

export const useDeactiveUserAndActive = (userid: string, satustype: string) => {
  console.log(satustype)
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: ['get_user_deactive', userid, satustype],
    queryFn: async () => {
      try {
        let response

        if (satustype === 'active') {
          response = await authFetch.post(`/auth/deactivate/${userid}`)
        } else if (satustype === 'banned' || satustype === 'new') {
          response = await authFetch.post(`/auth/activate/${userid}`)
        } else {
          throw new Error('Invalid status type')
        }

        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries(['get_user_by_id'])
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
    },
    onError: (error: any) => {
      console.error('Fetch error:', error)
      console.log(error.response.data)
    },
  })
}
