import { UseQueryResult, useQuery } from 'react-query'
import authFetch from './axiosinterceptor'

export interface PushNotificationType {
  NotificationID?: string
  RichText?: string
  UserID?: string
  Title?: string
  Message?: string
  NotificationDate?: string
  IsRead?: boolean
  TipperProfilePictureUrl?: string
  tipper: UserType
}

export interface UserType {
  id: number
  KeyCloakID: string
  Username: string
  FirstName: string
  LastName: string
  Address: string
  Country: string
  City: string
  VerificationCode: string | null
  Bio: string
  ProfilePictureURL: string
  DateOfBirth: string | null
  Role: string
  NotificationSettings: string | null
  BankDetails: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface GetPushNotificationType {
  items: PushNotificationType[]
  totalCount: number
  totalPages: number
}

export const useGetNotificationsList =
  (): UseQueryResult<GetPushNotificationType> => {
    return useQuery({
      queryKey: ['get_push_notification_list'],
      // queryFn: async () => {
      //   return await authFetch.get(``, {})
      // },
      // select(data) {
      //   return data?.data?.data || []
      // },
    })
  }
