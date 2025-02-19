import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from 'react-query'
import authFetch from './axiosinterceptor'
import { GetUserDetailsResponse } from '../types/adminUserTypes'



export const useUpdateRewardSettings = (): UseMutationResult<any> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: 'update_reward_settings',
    mutationFn: async (data: any) => {
      try {
        const response = await authFetch.put(`/rewards-service-settings` , data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries(['get_reward_settings'])
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      console.log(error.response.data)
    },
  })
}

export const useGetRewardSettings = (
): UseQueryResult<GetUserDetailsResponse> => {
  return useQuery({
    queryKey: ['get_reward_settings'],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetUserDetailsResponse>(
          `/rewards-service-settings`
        )
        console.log(response.data)
        return response?.data.data
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
