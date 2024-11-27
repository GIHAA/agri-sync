import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import authFetch from './axiosinterceptor'
import { GetUserDetailsResponse } from '../types/adminUserTypes'


export const useAddUserDetails = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'add_user_details',
    mutationFn: async (data : any) => {
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

export const useUpdateUserDetails = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'update_user_details',
    mutationFn: async (data: any) => {
      try {
        const response = await authFetch.patch(`/auth/update/${data.userId}`, data)
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

export const useGetUserDetails = (
  searchdata: string,
  roletype: string,
  roleid: number,
  active: string,
  page: number, pageSize : number
): UseQueryResult<GetUserDetailsResponse> => {
  return useQuery({
    queryKey: ['get_all_users_and_search_users', searchdata, roletype, page, pageSize],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetUserDetailsResponse>(
          `/user-details?status=${active}&roleid=${roleid}&limit=${pageSize}&page=${page}&role=${roletype}${
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
          `/user-details/${userparameid}`
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

export const useActivateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: 'activate_user',
    mutationFn: async (userid: string) => {
      try {
        const response = await authFetch.post(`/auth/activate/${userid}`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
      queryClient.invalidateQueries(['get_user_by_id'])
    },
    onError: (error: any) => {
      console.error('Fetch error:', error)
      console.log(error.response.data)
    },
  })
}


export const useDeactivateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: 'deactivate_user',
    mutationFn: async (userid: string) => {
      try {
        const response = await authFetch.post(`/auth/deactivate/${userid}`)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
      queryClient.invalidateQueries(['get_user_by_id'])
    },
    onError: (error: any) => {
      console.error('Fetch error:', error)
      console.log(error.response.data)
    },
  })
}


export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: 'delete_user',
    mutationFn: async (userid: string) => {
      try {
        const response = await authFetch.delete(`/auth/delete-admin-users/${userid}`)
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
      console.error('Fetch error:', error)
      console.log(error.response.data)
    },
  })
}
