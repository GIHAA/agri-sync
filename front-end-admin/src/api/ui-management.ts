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


export const useGetRedemptionAnalytics = (
): UseQueryResult<GetUserDetailsResponse> => {
  return useQuery({
    queryKey: ['get_redemption_analytics'],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetUserDetailsResponse>(
          `/rewards-service/redemption-analytics`
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


export const useGetClickTrend = (
): UseQueryResult<GetUserDetailsResponse> => {
  return useQuery({
    queryKey: ['get_click_trend'],
    queryFn: async () => {
      try {
        const response = await authFetch.get<GetUserDetailsResponse>(
          `/user-interaction-service/api/miss-click-rate-by-button`
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


export const useGetMissClickRateByButton = () => {
    return useQuery({
      queryKey: ['miss_click_rate_by_button'],
      queryFn: async () => {
        const response = await authFetch.get('/user-interaction-service/api/miss-click-rate-by-button');
        return response.data;
      },
      onSuccess: (data) => {
        console.log('Miss Click Rate Data:', data);
      },
      onError: (error) => {
        console.error('Error fetching miss click rate by button:', error);
      },
    });
  };

  export const useGetPreisionGraph = () => {
    return useQuery({
      queryKey: ['presision_graph'],
      queryFn: async () => {
        const response = await authFetch.get('/user-interaction-service/api/precision-graph');
        return response.data;
      },
      onSuccess: (data) => {
        console.log('Miss Click Rate Data:', data);
      },
      onError: (error) => {
        console.error('Error fetching miss click rate by button:', error);
      },
    });
  };

export const useGetMissClickRate = () => {
    return useQuery({
      queryKey: ['miss_click_rate'],
      queryFn: async () => {
        const response = await authFetch.get<{ missClickRate: string }>(
          '/user-interaction-service/api/miss-click-rate'
        )
        return response.data
      },
      onSuccess: (data) => {
        console.log('Miss Click Rate:', data.missClickRate)
      },
      onError: (error) => {
        console.error('Error fetching miss click rate:', error)
      },
    })
  }

  export const useGetSucessfullClickRate = () => {
    return useQuery({
      queryKey: ['sucsess_click_rate'],
      queryFn: async () => {
        const response = await authFetch.get<{ successRate: string }>(
          '/user-interaction-service/api/successful-clicks-rate'
        )
        return response.data
      },
      onSuccess: (data) => {
        console.log('Miss Click Rate:', data.successRate)
      },
      onError: (error) => {
        console.error('Error fetching miss click rate:', error)
      },
    })
  }




