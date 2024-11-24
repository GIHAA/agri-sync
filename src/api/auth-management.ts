import { UseMutationResult , useMutation , useQueryClient } from 'react-query'
import authFetch from './axiosinterceptor'
import { AxiosResponse } from 'axios'


interface UploadResponse {
  fileUrl: string;
  message: string;
}

export const useLogin = (): UseMutationResult<any> => {
  

  return useMutation({
    mutationFn: async (data : any) => {
      try {
        const response = await authFetch.post('/auth/login', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error: any) => {
      console.error('Mutation error:', error)
      console.log(error.response.data)
    },
  })
}


export const useUploadImage = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data: FormData) => {
      const response: AxiosResponse<UploadResponse> = await authFetch.post(
        "/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
   
    onError: (error) => {
      console.error(
        "Image upload error:",
        error.response?.data?.message || error.message
      );
    },
  });
};