import { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '../../../../components/common/button'
import InputElement from '../../../../components/common/form-elements/input-element-secondary'
import Profile from '../../../../components/common/profile/profile'
import { AlignmentTypes, NotificationTypes } from '../../../../constants/common-enums'
import { useAddUserDetails } from '../../../../api/admin-user-management'
import { Icons } from '../../../../constants'
import Toast from '../../../../utils/notification'
import SharedDataContainer from '../../../../containers/sharedData'
import SelectElement from '../../../../components/common/form-elements/select-element-secondary'
import { useUploadImage } from '../../../../api/auth-management'
import Separator from '../../../../components/common/separator/separator'

const schema = yup
  .object({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    age: yup.number().required('Age is required').positive('Age must be positive'),
    vision_problems: yup.boolean(),
    color_blindness: yup.boolean(),
    text_size: yup.string().required('Text size preference is required'),
    layout: yup.string().required('Layout preference is required'),
    color_friendly_scheme: yup.string().required('Color scheme preference is required'),
    use_symbols_with_colors: yup.boolean(),
    lat: yup.number().required('Latitude is required'),
    long: yup.number().required('Longitude is required')
  })
  .required()

function AddFarmerSection() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { mutate, isLoading, isSuccess, isError, error } = useAddUserDetails()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const {
    mutate: uploadFile,
    isSuccess: fileUploadSuccess,
    data: uploadData,
    isError: isUploadError,
  } = useUploadImage()

  const onSubmit = (data) => {
    setLoading(true)
    mutate({
      ...data,
      ProfilePictureURL: uploadedImage || '',
      vision_problems: Boolean(data.vision_problems),
      color_blindness: Boolean(data.color_blindness),
      use_symbols_with_colors: Boolean(data.use_symbols_with_colors),
    })
  }

  const textSizeOptions = [
    { id: 1, value: 'Small', name: 'Small' },
    { id: 2, value: 'Medium', name: 'Medium' },
    { id: 3, value: 'Large', name: 'Large' },
  ]

  const layoutOptions = [
    { id: 1, value: 'Simple', name: 'Simple' },
    { id: 2, value: 'Normal', name: 'Normal' },
    { id: 3, value: 'Complex', name: 'Complex' },
  ]

  const colorSchemeOptions = [
    { id: 1, value: 'Standard', name: 'Standard' },
    { id: 2, value: 'Red-Green Safe', name: 'Red-Green Safe' },
    { id: 3, value: 'High Contrast', name: 'High Contrast' },
  ]

  useEffect(() => {
    if (isSuccess) {
      setNotification({
        message: 'Farmer added successfully',
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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative rounded-lg bg-white shadow-md">
      <div className="mb-6 flex justify-start pl-6 pt-6">
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
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        ) : (
          <button type="button" className="relative flex flex-col items-center justify-center gap-[10px]">
            <Profile />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </button>
        )}
      </div>

      <div className="mb-5">
        <Separator />
      </div>

      <div className="gap-4 p-6">
        {/* Basic Information */}
        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="username"
              label="Username"
              name="username"
              type="text"
              placeholder="Username"
              register={register}
              required={true}
              error={errors.username as FieldError}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="email"
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              register={register}
              required={true}
              error={errors.email as FieldError}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>

        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="password"
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
              register={register}
              required={true}
              error={errors.password as FieldError}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="age"
              label="Age"
              name="age"
              type="number"
              placeholder="Age"
              register={register}
              required={true}
              error={errors.age as FieldError }
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex-cols mb-6 flex w-full gap-24">
          <div className="w-1/2">
            <InputElement
              id="lat"
              label="Latitude"
              name="lat"
              type="number"

              placeholder="Latitude"
              register={register}
              required={true}
              error={errors.lat as FieldError}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
          <div className="w-1/2">
            <InputElement
              id="long"
              label="Longitude"
              name="long"
              type="number"
    
              placeholder="Longitude"
              register={register}
              required={true}
              error={errors.long as FieldError}
              labelAlignment={AlignmentTypes.BLOCK}
            />
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold">Accessibility Settings</h3>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('vision_problems')} />
              <span>Vision Problems</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('color_blindness')} />
              <span>Color Blindness</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('use_symbols_with_colors')} />
              <span>Use Symbols with Colors</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <SelectElement
              id="textSize"
              label="Text Size"
              name="text_size"
              register={register}
              required={true}
              error={errors.text_size}
              labelAlignment={AlignmentTypes.BLOCK}
              onChange={(e) => setValue('text_size', e.target.value)}
              options={textSizeOptions}
              inputClassName="!mt-0"
            />

            <SelectElement
              id="layout"
              label="Layout"
              name="layout"
              register={register}
              required={true}
              error={errors.layout}
              labelAlignment={AlignmentTypes.BLOCK}
              onChange={(e) => setValue('layout', e.target.value)}
              options={layoutOptions}
              inputClassName="!mt-0"
            />

            <SelectElement
              id="colorScheme"
              label="Color Scheme"
              name="color_friendly_scheme"
              register={register}
              required={true}
              error={errors.color_friendly_scheme}
              labelAlignment={AlignmentTypes.BLOCK}
              onChange={(e) => setValue('color_friendly_scheme', e.target.value)}
              options={colorSchemeOptions}
              inputClassName="!mt-0"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[-60px] right-0 mt-6 flex justify-end space-x-4">
        <Button
          onClick={handleSlider}
          type="button"
          className="min-w-[120px] bg-[#EDF2F6] px-10 py-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="min-w-[120px] bg-black px-10 py-2 text-white"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Farmer'}
        </Button>
      </div>
    </form>
  )
}

export default AddFarmerSection
