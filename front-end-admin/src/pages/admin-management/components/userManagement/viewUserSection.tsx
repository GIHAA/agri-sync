/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { UseQueryResult } from 'react-query'
import { Tab } from '@headlessui/react'
import { PosApi } from '../../../../api'
import { useGetUserById, useActivateUser, useDeactivateUser } from '../../../../api/admin-user-management'
import Button from '../../../../components/common/button'
import { FormInline } from '../../../../components/common/form-elements/components'
import { Icons, NotificationTypes } from '../../../../constants'
import { AgrisyncItem } from '../../../../types/tpandsptype'
import Toast from '../../../../utils/notification'
import PreviewImage from '../../../../assets/images/profile.svg'
import SharedDataContainer from '../../../../containers/sharedData'
import permissionChecker from '../../../../hooks/permissonChecker'
import Separator from '../../../../components/common/separator/separator'


interface ViewUserProps {
  userId: string
}
function ViewUserSection(props: ViewUserProps) {
  const posApi = PosApi.useAPI()
  const [isloading, setIsLoading] = useState<boolean>(false)
  const [useridparam, setuseridparame] = useState('')
  const [userStatus, setuserStatus] = useState('')
  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
  }: UseQueryResult<AgrisyncItem> = useGetUserById(props.userId)
  // const {
  //   data: userData,
  //   isLoading: isFetchingUserData,
  //   isError: isFetchingUserError,
  // } = useDeactiveUserAndActive(useridparam, userStatus)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      prefix: yup.string().when('_', {
        is: () => 'toolagrisync',
        then: yup
          .string()
          .required(`${t('customerForm.fields.prefix.toolagrisync')}`),
        otherwise: yup.string().notRequired(),
      }),
    })
    .required()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const { mutate : ActivateUser } = useActivateUser();
  const { mutate : DeactivateUser } = useDeactivateUser();


  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data)
  }

  const handleDeactivate = () => {
    
    if(data?.id) DeactivateUser(data?.KeyCloakID.toString());
  };
  
  const handleActivate = () => {;
    if(data?.id) ActivateUser(data?.KeyCloakID.toString());
  };
  

  const { handleSlider } = SharedDataContainer.useContainer()


  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <Tab.Group>
        <div className="intro-y  rounded-t-lg bg-white p-[12px] px-5 ">
          <div className="-mx-5 mb-[2px] flex flex-col  content-center md:flex-row">
            <div className="b flex flex-1 content-center items-center justify-center px-5 lg:justify-start">
              <div className="ml-2 mt-4 flex-none content-center sm:mt-0 sm:h-24 sm:w-24 ">
                <img
                  alt="profile page"
                  className=" h-[85px] w-[85px] rounded-full"
                  src={
                    data?.ProfilePictureURL
                      ? data.ProfilePictureURL
                      : PreviewImage
                  }
                />
              </div>
              <div>
                <div className="ml-1  w-24 truncate text-lg font-medium sm:ml-0 sm:w-60 sm:whitespace-normal">
                  {data?.FirstName ? data?.FirstName : 'name'}{' '}
                  {data?.LastName ? data?.LastName : ' provide'}
                </div>
              </div>
            </div>

            {/* <div className="mx-0  mt-6 content-center sm:mx-0  md:mx-2 lg:mt-1 lg:border-t-0">
              <div className="flex content-center  items-center justify-center sm:mr-[70px] lg:justify-start">
                <div className="flex items-center truncate text-slate-500">
                  {permissionChecker(
                    <>
                      {data?.Status === 'active' ? (
                        <Button
                          className=" w-40 bg-red-500 px-6 py-2"
                          onClick={handleDeactivate}
                        >
                          <span className="text-white sm:block">
                            Deactivate
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className="w-40 bg-green-500 px-6 py-2"
                          onClick={handleActivate}
                        >
                          <span className="text-white sm:block">Activate</span>
                        </Button>
                      )}
                    </>,
                    'user_management.deactivate'
                  )}
                </div>
              </div>
            </div> */}
            <div className="mt-6     px-5 lg:mt-0 lg:border-t-0 ">
              <div className="flex items-center  justify-end px-5 lg:justify-start">
                <div className="ml-8 pt-5 ">
                  <div className="mt-2 flex items-center truncate  ">
                    {permissionChecker(
                      <>
                        {data?.Status === 'active' ? (
                          <Button
                            className=" w-40 bg-red-500 px-6 py-2"
                            onClick={handleDeactivate}
                          >
                            <span className="text-white sm:block">
                              Deactivate
                            </span>
                          </Button>
                        ) : (
                          <Button
                            className="w-40 bg-green-500 px-6 py-2"
                            onClick={handleActivate}
                          >
                            <span className="text-white sm:block">
                              Activate
                            </span>
                          </Button>
                        )}
                      </>,
                      'user_management.deactivate'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <div className="rounded-b-lg bg-white py-[12px]">
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6"></div>
            <div className="flex items-center  px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
              {/* <FormInline className="flex-col items-start xl:flex-row">
                <div className="xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Email</div>
                    </div>
                    <div
                      className="text-small mt-3 leading-relaxed text-slate-500"
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Email ? data.Email : 'No'}
                    </div>
                  </div>
                </div>
                <div className="xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Phone</div>
                    </div>
                    <div
                      className="text-small mt-3 leading-relaxed text-slate-500"
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Phone ? data?.Phone : 'No'}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center">
                    <div className="">Whatsapp</div>
                  </div>
                  <div
                    className="text-small mt-3 leading-relaxed text-slate-500"
                    style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                  >
                    {data?.Whatsapp ? data.Whatsapp : 'No'}
                  </div>
                </div>
              </FormInline> */}
              <FormInline className="ml-4 flex-col  items-start xl:flex-row">
                <div className="xl:!mr-2 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Email</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.Email ? 'text-[#000000]' : ' text-[#D5D5D5]'
                      }`}
                      style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                    >
                      {data?.Email ? data.Email : 'Not Provided Yet'}
                    </div>
                  </div>
                </div>
                <div className="lg:ml-5 xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Phone</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.Phone ? 'text-[#000000]' : ' text-[#D5D5D5]'
                      }`}
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Phone ? data?.Phone : 'Not Provided Yet'}
                    </div>
                  </div>
                </div>
                <div className="lg:ml-2 xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Whatsapp</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.Whatsapp ? 'text-[#000000]' : ' text-[#D5D5D5]'
                      }`}
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Whatsapp ? data?.Whatsapp : 'Not Provided Yet'}
                    </div>
                  </div>
                </div>
              </FormInline>
            </div>
            <div className="flex items-center px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
              <FormInline className="ml-4 flex-col items-start xl:flex-row">
                <div className=" xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Role</div>
                    </div>
                    <div
                      className="text-small mt-3 leading-relaxed text-slate-500"
                      style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                    >
                      {data?.role ? data.role.name : 'N/A'}
                    </div>
                  </div>
                </div>
              </FormInline>
            </div>
            <div className="flex items-center px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3"></div>
          </Tab.Panel>
        </div>
      </Tab.Group>
      <div className=" mt-3 flex justify-end">
        <Button
          className=" min-w-[120px] bg-[#EDF2F6] px-10 py-2 "
          onClick={() => {
            handleSlider()
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ViewUserSection
