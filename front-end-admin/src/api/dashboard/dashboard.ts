import { useQuery, UseQueryResult } from "react-query"
import authFetch from "../axiosinterceptor"

export const GetNewSPCountByMonth =(): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_new_sp_count_by_month'],
    queryFn: async () => {
      return await authFetch.get('/user-details/stats/new-sp-by-month')
    },
    select(data: { data: any }) {
      return data?.data;
    },
  })
}
export const GetNewTPCountByMonth = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_new_tp_count_by_month'],
    queryFn: async () => {
      return await authFetch.get('/user-details/stats/new-tp-by-month')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}
export const GetNewBothCountByMonth = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_new_both_count_by_month'],
    queryFn: async () => {
      return await authFetch.get('/user-details/stats/new-both-by-month')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetWeeklyTotalAndDifferenceTips = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_weekly_total_and_difference_tips'],
    queryFn: async () => {
      return await authFetch.get(
        '/tip-management/stats/weekly-total-and-difference'
      )
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetWeeklyTotalAndDifferenceWD = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_weekly_total_and_difference_wd'],
    queryFn: async () => {
      return await authFetch.get(
        '/invoices/stats/weekly-total-and-difference'
      )
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetTopTippersThisWeek = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_top-tippers'],
    queryFn: async () => {
      return await authFetch.get('/tip-management/stats/top-tippers')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetTopServiceProviders = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_top_service_providers'],
    queryFn: async () => {
      return await authFetch.get(
        '/tip-management/stats/top-rated-service-providers'
      )
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetUsersCountByType = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_user_count_by_type'],
    queryFn: async () => {
      return await authFetch.get('/user-details/stats/counts-by-status')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetWithdrawalsPerMonth = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_withdrawals_per_month'],
    queryFn: async () => {
      return await authFetch.get('/invoices/stats/total-withdrawal-by-month')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetTipsPerMonth = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_tips_per_month'],
    queryFn: async () => {
      return await authFetch.get('/tip-management/stats/total-tips-by-month')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

export const GetAgeByRole = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['get_age_by_role'],
    queryFn: async () => {
      return await authFetch.get('/user-details/stats/age-distribution-by-role')
    },
    select(data: { data: any }) {
      return data?.data
    },
  })
}

