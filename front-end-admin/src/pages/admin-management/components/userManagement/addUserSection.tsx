import { useEffect, useState } from 'react'
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
import { useAddUserDetails } from '../../../../api/admin-user-management'
import { Icons } from '../../../../constants'
import Toast from '../../../../utils/notification'
import SharedDataContainer from '../../../../containers/sharedData'
import SelectElement from '../../../../components/common/form-elements/select-element-secondary'
import { useUploadImage } from '../../../../api/auth-management'
import Separator from '../../../../components/common/separator/separator'

const schema = yup
  .object({
    FirstName: yup.string().required('First Name is required'),
    LastName: yup.string().required('Last Name is required'),
    Email: yup.string().email('Invalid email').required('Email is required'),
    Password: yup.string().required('Password is required'),
    Phone: yup.string().required('Phone Number is required'),
  })
  .required()

function AddUserSection(props: { roles: [] }) {
  const [loading, setLoading] = useState(false)
  const { roles } = props
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { mutate, isLoading, isSuccess, isError, error } = useAddUserDetails()

  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
  } = useUploadImage()

  const onSubmit = (data: any) => {
    setLoading(true)
    mutate({ ...data, ProfilePictureURL: uploadedImage || '' })
  }

  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    if (isSuccess) {
      setNotification({
        message: 'User added successfully',
        icon: Icons.CHECKCIRCLE,
        type: NotificationTypes.SUCCESS,
      })
      Toast()
      handleSlider()
      setLoading(false)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      setNotification({
        message: `${(error as any)?.response?.data.message}`,
        icon: Icons.CLOSE,
        type: NotificationTypes.ERROR,
      })
      Toast()
      setLoading(false)
    }
  }, [isError])

  useEffect(() => {
    if (fileUploadSuccess && uploadData) {
      setUploadedImage(uploadData.fileUrl)
    }
  }, [fileUploadSuccess, uploadData])

  const formatedRoles = Array.isArray(roles)
    ? roles.map((role: { name: string }, key) => ({
        id: key,
        value: role.name,
        name: role.name,
      }))
    : []

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
      className="relative rounded-lg bg-white  shadow-md"
    >
      <div className="mb-6 flex justify-start pl-6 pt-6 ">
        {uploadedImage ? (
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded profile"
              className="h-[100px] w-[100px] rounded-full object-cover"
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
            <Profile />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className=" absolute inset-0  cursor-pointer bg-black opacity-0"
            />
          </button>
        )}
      </div>

      <div className="mb-5">
        <Separator />
      </div>

      <div className="gap-4 p-6">
        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="firstName"
              label="First Name"
              name="FirstName"
              type="text"
              placeholder="First Name"
              register={register}
              required={true}
              error={errors.firstName}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="lastName"
              label="Last Name"
              name="LastName"
              type="text"
              placeholder="Last Name"
              register={register}
              required={true}
              error={errors.lastName}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>
        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="email"
              label="Email"
              name="Email"
              type="email"
              placeholder="Email"
              register={register}
              required={true}
              error={errors.email}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="password"
              label="Password"
              name="Password"
              type="password"
              placeholder="Password"
              register={register}
              required={true}
              error={errors.password}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>
        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="phoneNumber"
              label="Phone Number"
              name="Phone"
              type="number"
              placeholder="Phone Number"
              register={register}
              required={true}
              error={errors.phoneNumber}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="whatsapp"
              label="Whatsapp"
              name="Whatsapp"
              type="number"
              placeholder="Whatsapp"
              register={register}
              required={true}
              error={errors.whatsapp}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>
        <div className="max-w-[325px]">
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
            inputClassName="!mt-0"
          />
        </div>
      </div>

      <div className="absolute bottom-[-60px] right-0 mt-6 flex justify-end space-x-4">
        <Button
          onClick={() => {
            handleSlider()
          }}
          type="button"
          className=" min-w-[120px] bg-[#EDF2F6] px-10 py-2 "
        >
          Cancel
        </Button>
        {loading ? (
          <Button
            type="submit"
            className=" min-w-[120px] bg-slate-100 px-10 py-2 text-gray-500"
            disabled
          >
            Adding...
          </Button>
        ) : (
          <Button
            onClick={() => {
              console.log('Add button clicked')
            }}
            type="submit"
            className=" min-w-[120px] bg-black px-10 py-2 text-white"
          >
            Add
          </Button>
        )}
      </div>
    </form>
  )
}

export default AddUserSection
