import { useQuery } from 'react-query'
import authFetch from './axiosinterceptor'


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




