import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import authFetch from './axiosinterceptor'
import { GetRolesResponse } from '../types/adminUserTypes'


export const useAddRole = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'add_role_details',
    mutationFn: async (data : any) => {
      try {
        const response = await authFetch.post('/role-management', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      console.log(error.response.data)
    },
  })
}

export const useUpdateRoles = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'update_user_details',
    mutationFn: async (data: any) => {
      try {
        const response = await authFetch.put(`/role-management/${data.roleId}`, data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['get_all_users_and_search_users'])
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      console.log(error.response.data)
    },
  })
}

export const useGetRoles = (
  searchdata: string,
  page: number, pageSize : number
): UseQueryResult<GetRolesResponse> => {
  return useQuery({
    queryKey: ['get_all_users_and_search_users', searchdata, page, pageSize],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetRolesResponse>(
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

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: 'get_all_roles',
    queryFn: async () => {
      try {
        const response = await authFetch.get('/role-management/no-pagination')
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

export const useGetRoleById = (roleId: number): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_user_by_id', roleId],
    queryFn: async () => {
      try {
        const response = await authFetch.get(
          `/role-management/${roleId}`
        )
        return response.data
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

export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: 'delete_user',
    mutationFn: async (userid: string) => {
      try {
        const response = await authFetch.delete(`/role-management/${userid}`)
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
