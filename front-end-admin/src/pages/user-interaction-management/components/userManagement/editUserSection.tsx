import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '../../../../components/common/button'
import InputElement from '../../../../components/common/form-elements/input-element'
import Profile from '../../../../components/common/profile/profile'
import {
  AlignmentTypes,
  NotificationTypes,
} from '../../../../constants/common-enums'
import { Icons } from '../../../../constants'
import Toast from '../../../../utils/notification'
import SharedDataContainer from '../../../../containers/sharedData'
import {
  useGetUserById,
  useUpdateUserDetails,
} from '../../../../api/admin-user-management'
import SelectElement from '../../../../components/common/form-elements/select-element-secondary'
import { useUploadImage } from '../../../../api/auth-management'
import Separator from '../../../../components/common/separator/separator'

const schema = yup
  .object({
    FirstName: yup.string().required('First Name is required'),
    LastName: yup.string().required('Last Name is required'),
    Email: yup.string().email('Invalid email').required('Email is required'),
    Phone: yup.string().required('Phone Number is required'),
  })
  .required()

function EditUserSection({ userId, roles }: { userId: string; roles: [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
  } = useUploadImage()

  const {
    mutate: updateUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useUpdateUserDetails()

  const { data } = useGetUserById(userId)

  const onSubmit = (data: any) => {
    console.log(data)
    updateUser({
      userId,
      ...data,
      ProfilePictureURL: uploadedImage ? uploadedImage : data.ProfilePictureURL,
    })
  }

  const { setNotification, handleSlider } = SharedDataContainer.useContainer()

  useEffect(() => {
    if (isSuccess) {
      setNotification({
        message: 'User updated successfully',
        icon: Icons.CHECKCIRCLE,
        type: NotificationTypes.SUCCESS,
      })
      Toast()
      handleSlider()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      setNotification({
        message: 'User update failed',
        icon: Icons.CLOSE,
        type: NotificationTypes.ERROR,
      })
      Toast()
    }
  }, [isError])

  useEffect(() => {
    async function fetchUserData() {
      const userData = data
      setValue('FirstName', userData.FirstName)
      setValue('LastName', userData.LastName)
      setValue('Email', userData.Email)
      setValue('Phone', userData.Phone)
      setValue('Role', userData.role.name)
      setValue('Whatsapp', userData.Whatsapp)
    }

    fetchUserData()
  }, [userId, setValue, data])

  const formatedRoles = Array.isArray(roles)
    ? roles.map((role: { name: string }, key) => ({
        id: key,
        value: role.name,
        name: role.name,
      }))
    : []

  useEffect(() => {
    if (fileUploadSuccess && uploadData) {
      setUploadedImage(uploadData.fileUrl)
    }
  }, [fileUploadSuccess, uploadData])

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = async () => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          await uploadFile(formData)
        } catch (error) {
          console.error('Image upload error:', error)
        }
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative rounded-lg bg-white shadow-md"
    >
      <div className="mb-6 flex justify-start pl-6 pt-6 ">
        {uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded profile"
              className="h-[100px] w-[100px] object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className=" absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        ) : (
          <button
            type="button"
            className="relative flex flex-col items-center justify-center gap-[10px]"
          >
            {data?.ProfilePictureURL ? (
              <img
                src={data.ProfilePictureURL}
                alt="Uploaded profile"
                className="h-[100px] w-[100px] rounded-full object-cover"
              />
            ) : (
              <Profile />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className=" absolute inset-0  cursor-pointer bg-black opacity-0"
            />
          </button>
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 p-6">
        <InputElement
          id="firstName"
          label="First Name"
          name="FirstName"
          type="text"
          placeholder="First Name"
          register={register}
          required={true}
          error={errors.FirstName}
          labelAlignment={AlignmentTypes.BLOCK}
        />
        <InputElement
          id="lastName"
          label="Last Name"
          name="LastName"
          type="text"
          placeholder="Last Name"
          register={register}
          required={true}
          error={errors.LastName}
          labelAlignment={AlignmentTypes.BLOCK}
        />
        <InputElement
          id="email"
          label="Email"
          name="Email"
          type="email"
          placeholder="Email"
          register={register}
          required={true}
          error={errors.Email}
          labelAlignment={AlignmentTypes.BLOCK}
        />
        <InputElement
          id="whatsapp"
          label="Whatsapp"
          name="Whatsapp"
          type="text"
          placeholder="Whatsapp"
          register={register}
          required={true}
          error={errors.Whatsapp}
          labelAlignment={AlignmentTypes.BLOCK}
        />
        <InputElement
          id="phoneNumber"
          label="Phone Number"
          name="Phone"
          type="text"
          placeholder="Phone Number"
          register={register}
          required={true}
          error={errors.Phone}
          labelAlignment={AlignmentTypes.BLOCK}
        />
        <SelectElement
          id="role"
          label="Role"
          name="Role"
          register={register}
          required={true}
          error={errors.Role}
          labelAlignment={AlignmentTypes.BLOCK}
          onChange={(e) => {
            setValue('Role', e.target.value)
          }}
          options={formatedRoles}
          value={data?.role?.name}
          inputClassName="!mt-0"
        />
      </div>

      <div className="absolute bottom-[-60px] right-0 mt-6 flex justify-end space-x-4">
        <Button
          onClick={handleSlider}
          type="button"
          className=" min-w-[120px] bg-[#EDF2F6] px-10 py-2 "
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className=" min-w-[120px] bg-black px-10 py-2 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  )
}

export default EditUserSection
