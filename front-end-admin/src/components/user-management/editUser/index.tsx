/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { useState } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PosApi } from '../../../api'
import Button from '../../common/button'
import { InputElement, SelectElement } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import {
  TextareaElement,
  DateElement,
} from '../../common/form-elements'
import { FormInfo, FormCheck } from '../../common/form-elements/components'
import Lucide from '../../common/lucide'

function EditUser() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      first_name: yup
        .string()
        .required(`${t('userManagement.fields.firstName.validationMessage')}`),
      email: yup
        .string()
        .required(`${t('userManagement.fields.email.validationMessage')}`),
        password: yup
        .string()
        .required(`${t('userManagement.fields.rolesnPermission.fields.password.validationMessage')}`),
        confirmPassword: yup
        .string()
        .required(`${t('userManagement.fields.rolesnPermission.fields.confirmPassword.validationMessage')}`),
        role: yup
        .string()
        .required(`${t('userManagement.fields.rolesnPermission.fields.role.validationMessage')}`),
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sucessHandlerCreateCustomer = (customer: any, message: string) => {
    setNotification({
      title: '',
      message,
      icon: Icons.CHECKCIRCLE,
      type: NotificationTypes.SUCCESS,
    })
    Toast()
    setIsLoading(false)
    handleSlider()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorHandler = (error: any) => {
    Toast()
    setNotification({
      title: '',
      message: error || 'Something went wrong.',
      icon: Icons.XCIRCLE,
      type: NotificationTypes.ERROR,
    })
    setIsLoading(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createCustomer = async (customer: any) => {
    setIsLoading(true)
    /* TODO: Remove after after set customer type */
    // eslint-disable-next-line no-param-reassign
    customer.type = 'both'
    const res = await posApi.createCustomer(customer)
    if (res) {
      const { data } = res
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      const { message, data: customer } = data
      sucessHandlerCreateCustomer(customer, message)
    } else {
      errorHandler(null)
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createCustomer(data)
  }
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }

  const [allowSelectedPaymentAccounts, setAllowSelectedPaymentAccounts] =
    useState(false)
  const [allowFundTransferAccounts, setAllowFundTransferAccounts] =
    useState(false)

  const handleAllowSelectedPaymentAccountsChange = (event: { target: { checked: any } }) => {
    const { checked } = event.target
    setAllowSelectedPaymentAccounts(checked)
  }

  const handleAllowFundTransferAccountsChange = (event: { target: { checked: any } }) => {
    const { checked } = event.target
    setAllowFundTransferAccounts(checked)
  }
  const [date, setDate] = useState('')
  const [Prefixtype] = useState([{ id: 0, name: ' Mr.' }, { id: 2, name: 'Mrs.' }, { id: 3, name: 'Miss' }])
  const [Roletype] = useState([{ id: 0, name: ' Admin' }, { id: 2, name: 'Cashier 1' }, { id: 3, name: 'Cashier 2' },  { id: 3, name: 'Other' }])
  const [Gendertype] = useState([{ id: 0, name: ' Male' }, { id: 2, name: 'Female' }, { id: 3, name: 'Other' }])
  const [Maritaltype] = useState([{ id: 0, name: ' Married' }, { id: 2, name: 'Unmarried' }, { id: 3, name: 'Divorced' }])
  const [allLocationsChecked, setAllLocationsChecked] = useState(false)
  const [bunnyOutletChecked, setBunnyOutletChecked] = useState(false)
  const [testChecked, setTestChecked] = useState(false)

  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const handleMoreInfoClick = () => {
    setShowMoreInfo(!showMoreInfo);
  }

  const handleAllLocationsChange = () => {
    setAllLocationsChecked(!allLocationsChecked)
    setBunnyOutletChecked(!allLocationsChecked)
    setTestChecked(!allLocationsChecked)
  }

  const handleCheckboxChange = (checkboxName: string) => {
    if (checkboxName === 'bunnyOutlet') {
      setBunnyOutletChecked(!bunnyOutletChecked);
    } else if (checkboxName === 'test') {
      setTestChecked(!testChecked);
    }
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.title')}`}
                  </h2>
      </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mt-6">
          <SelectElement
            label={`${t('userManagement.fields.prefix.label')}`}
            register={register}
            options={Prefixtype}
            name="prefix"
            id="prefix"
          />
          </div><div className="grid grid-cols-1 gap-7 mt-7 md:grid-cols-2 mb-3">
          <InputElement
            label={`${t('userManagement.fields.firstName.label')}`}
            register={register}
            name="first_name"
            placeholder={`${t('userManagement.fields.firstName.placeolder')}`}
            id="first_name"
            error={errors.first_name}
            required
          />
          <InputElement
            label={`${t('userManagement.fields.lastName.label')}`}
            register={register}
            name="last_name"
            placeholder={`${t('userManagement.fields.lastName.placeolder')}`}
            id="last_name"
            error={errors.last_name}
          />
          <InputElement
            label={`${t('userManagement.fields.email.label')}`}
            register={register}
            name="email"
            placeholder={`${t('userManagement.fields.email.placeolder')}`}
            id="email"
            error={errors.email}
            type="email"
            required
          />
          <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.activeStatus.label'
            )}`}</div>

            <FormCheck.Input
              id="vertical-form-3"
              type="checkbox"
              value=""
              onChange={handleChange}
            />
            <FormCheck.Label className="mr-2" htmlFor="vertical-form-3">
              <div className="mx-1 -ml-1 flex">
                <FormInfo
                  toolagrisync={`${t('userManagement.fields.activeStatus.toolagrisync')}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
        </div>
      </div>
{/* Roles */}
<div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.rolesnPermission.title')}`}
                  </h2>
                  </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mt-6">
          <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.rolesnPermission.fields.allowLogin.label'
            )}`}</div>

            <FormCheck.Input
              id="vertical-form-3"
              type="checkbox"
              value=""
              onChange={handleChange}
            />
          </FormCheck>
          <InputElement
            label={`${t(
              'userManagement.fields.rolesnPermission.fields.userName.label'
            )}`}
            register={register}
            placeholder={`${t(
              'userManagement.fields.rolesnPermission.fields.userName.placeolder'
            )}`}
            name="userName"
            id="userName"
          />
        </div>

        <div className="grid grid-cols-1 gap-7 py-7  md:grid-cols-2">
          
          <InputElement
            label={`${t(
              'userManagement.fields.rolesnPermission.fields.password.label'
            )}`}
            register={register}
            name="password"
            placeholder={`${t(
              'userManagement.fields.rolesnPermission.fields.password.placeolder'
            )}`}
            id="password"
            error={errors.password}
            required
          />
          <InputElement
            label={`${t(
              'userManagement.fields.rolesnPermission.fields.confirmPassword.label'
            )}`}
            register={register}
            name="confirmPassword"
            placeholder={`${t(
              'userManagement.fields.rolesnPermission.fields.confirmPassword.placeolder'
            )}`}
            id="confirmPassword"
            error={errors.confirmPassword}
            required
          />

          <SelectElement
            label={`${t(
              'userManagement.fields.rolesnPermission.fields.role.label'
            )}`}
            options={Roletype}
            register={register}
            name="Role"
            id="Role"
            error={errors.role}
            required
            info={`${t(
              'userManagement.fields.rolesnPermission.fields.role.toolagrisync'
            )}`}
          />
        </div>

        <div className="grid grid-cols-1 gap-7 py-4 md:grid-cols-1">
          <FormCheck className="">
            <div className=" font-medium">
              {`${t(
                'userManagement.fields.rolesnPermission.fields.accessLocations.label'
              )}`}
            </div>
            <FormCheck.Label className="mr-5">
              <div className="flex">
                <FormInfo
                  toolagrisync={`${t(
                    'userManagement.fields.rolesnPermission.fields.accessLocations.toolagrisync'
                  )}`}
                />
              </div>
            </FormCheck.Label>
            
            <div className="mr-1 flex">All Locations</div>
      <FormCheck.Input
        className="mr-1 ml-1"
        type="checkbox"
        value=""
        onChange={handleAllLocationsChange}
        checked={allLocationsChecked}
      />
      <div className="flex">
              <FormInfo
                toolagrisync={`${t(
                  'userManagement.fields.rolesnPermission.fields.allLocations.toolagrisync'
                )}`}
              />
            </div>

      <div className="pl-6 font-medium">
        Bunny Outlet
        <FormCheck.Input
          className="ml-2 font-medium"
          type="checkbox"
          value=""
          onChange={() => handleCheckboxChange('bunnyOutlet')}
          checked={bunnyOutletChecked}
        />{' '}
      </div>
      
      <div className="pl-6 font-medium">
        Test
        <FormCheck.Input
          className="ml-2 font-medium"
          type="checkbox"
          value=""
          onChange={() => handleCheckboxChange('test')}
          checked={testChecked}
        />{' '}
            </div>
          </FormCheck>
        </div>
      </div>

<div className="item-center flex justify-center py-3">
                            <Button
                              variant="primary"
                              className="mx-auto mb-5 w-fit px-28"
                              onClick={handleMoreInfoClick}
                            >
                              <div className="mx-auto">
                                {`${t('common.button.moreInfo')}`}
                                <Lucide
                                  className="mx-auto -mt-1 h-4 w-4"
                                  icon={
                                    showMoreInfo
                                      ? Icons.UPARROW
                                      : Icons.DOWNARROW
                                  }
                                />
                              </div>
                            </Button>
                          </div>
                          {showMoreInfo && (
                            <>
{/* Sales */}
     <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.sales.title')}`}
                  </h2>
                  </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mb-3 mt-6">
          <InputElement
            label={`${t(
              'userManagement.fields.sales.fields.salesPercentage.label'
            )}`}
            register={register}
            name="prefix"
            placeholder={`${t(
              'userManagement.fields.sales.fields.salesPercentage.placeolder'
            )}`}
            type="number"
            id="prefix"
            info={`${t(
              'userManagement.fields.sales.fields.salesPercentage.toolagrisync'
            )}`}
          />
          <InputElement
            label={`${t(
              'userManagement.fields.sales.fields.maxSalesDiscountPecentage.label'
            )}`}
            type="number"
            register={register}
            name="first_name"
            placeholder={`${t(
              'userManagement.fields.sales.fields.maxSalesDiscountPecentage.placeolder'
            )}`}
            id="first_name"
            info={`${t(
              'userManagement.fields.sales.fields.maxSalesDiscountPecentage.toolagrisync'
            )}`}
          />

          <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.sales.fields.selectedContacts.label'
            )}`}</div>

            <FormCheck.Input
              id="vertical-form-3"
              type="checkbox"
              value=""
              onChange={handleChange}
            />
            <FormCheck.Label className="mr-2" htmlFor="vertical-form-3">
              <div className="mx-1 -ml-1 flex">
                <FormInfo
                  toolagrisync={`${t(
                    'userManagement.fields.sales.fields.selectedContacts.toolagrisync'
                  )}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
        </div>
      </div>
{/* Payment Accounts */}
<div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.paymentAccounts.title')}`}
                  </h2>
                  </div>
        <div className="grid grid-cols-1 gap-6 py-2 md:grid-cols-2 mt-6">
          <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.paymentAccounts.fields.allowFundTransferAccounts.label'
            )}`}</div>
            <FormCheck.Input
              id="allowFundTransferAccounts"
              type="checkbox"
              value=""
              onChange={handleAllowFundTransferAccountsChange}
            />
            <FormCheck.Label
              className="mr-2"
              htmlFor="allowFundTransferAccounts"
            >
              <div className="mx-1 -ml-1 flex">
                <FormInfo
                  toolagrisync={`${t(
                    'userManagement.fields.paymentAccounts.fields.allowFundTransferAccounts.toolagrisync'
                  )}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
          <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.paymentAccounts.fields.allowSelectedPaymentAccounts.label'
            )}`}</div>
            <FormCheck.Input
              id="allowSelectedPaymentAccounts"
              type="checkbox"
              value=""
              onChange={handleAllowSelectedPaymentAccountsChange}
            />
            <FormCheck.Label
              className="mr-2"
              htmlFor="allowSelectedPaymentAccounts"
            >
              <div className="mx-1 -ml-1 flex">
                <FormInfo
                  toolagrisync={`${t(
                    'userManagement.fields.paymentAccounts.fields.allowSelectedPaymentAccounts.toolagrisync'
                  )}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
         
        </div>

        <div className="grid grid-cols-1 gap-7 py-7 md:grid-cols-2">
        {allowFundTransferAccounts && (
            <div className="">
              <SelectElement
                label={`${t(
                  'userManagement.fields.paymentAccounts.fields.selectPaymentAccountsTwo.label'
                )}`}
                register={register}
                name="selectPaymentAccountsTwo"
                id="selectPaymentAccountsTwo"
              />
            </div>
          )}
          {allowSelectedPaymentAccounts && (
            <div className="">
              <SelectElement
                label={`${t(
                  'userManagement.fields.paymentAccounts.fields.selectPaymentAccountsOne.label'
                )}`}
                register={register}
                name="selectPaymentAccountsOne"
                id="selectPaymentAccountsOne"
              />
            </div>
          )}
        </div>
      </div>

 {/* Personal Details */}   
 <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.moreInformations.title')}`}
                  </h2>
                  </div>
        <div className=" grid grid-cols-1 gap-7 md:grid-cols-3 mt-6">
          <DateElement
            label={`${t('customerForm.fields.otherForm.fields.dob.label')}`}
            value={date}
            onChange={setDate}
            options={{
              autoApply: false,
              showWeekNumbers: true,
              dropdowns: {
                minYear: 1990,
                maxYear: null,
                months: true,
                years: true,
              },
            }}
            name="date_of_birth"
            id="date_of_birth"
          />

          <SelectElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.gender.label'
            )}`}
            register={register}
            name="gender"
            id="gender"
            options={Gendertype}
          />
          <SelectElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.maritalStatus.label'
            )}`}
            register={register}
            name="maritalStatus"
            id="maritalStatus"
            options={Maritaltype}
          />
          <InputElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.bloodGroup.label'
            )}`}
            register={register}
            name="bloodGroup"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.bloodGroup.placeolder'
            )}`}
            id="bloodGroup"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.contact.label'
            )}`}
            register={register}
            name="contact"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.contact.placeolder'
            )}`}
            id="contact"
          />
           </div><div className="grid grid-cols-1 gap-7 py-7 md:grid-cols-3 ">
              <InputElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.guardianName.label'
            )}`}
            register={register}
            name="guardianName"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.guardianName.placeolder'
            )}`}
            id="guardianName"
          />
          
          <InputElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.iDProofName.label'
            )}`}
            register={register}
            name="iDProofName"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.iDProofName.placeolder'
            )}`}
            id="iDProofName"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.iDProofNo.label'
            )}`}
            register={register}
            name="iDProofNo"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.iDProofNo.placeolder'
            )}`}
            id="iDProofNo"
          />
          </div><div className="mb-3 mt-7 grid grid-cols-1 gap-7  md:grid-cols-3 ">
          <TextareaElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.permanentAddress.label'
            )}`}
            register={register}
            name="special_remark"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.permanentAddress.placeolder'
            )}`}
            id="special_remark"
          />
          <TextareaElement
            label={`${t(
              'userManagement.fields.moreInformations.fields.currentAddress.label'
            )}`}
            register={register}
            name="special_remark"
            placeholder={`${t(
              'userManagement.fields.moreInformations.fields.currentAddress.placeolder'
            )}`}
            id="special_remark"
          />
          </div>
      </div>
 {/* bank Detail */}   
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.bankDetails.title')}`}
                  </h2>
                  </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mb-3 mt-6">
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.accountHolderName.label'
            )}`}
            register={register}
            name="accountHolderName"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.accountHolderName.placeolder'
            )}`}
            id="accountHolderName"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.accountNumber.label'
            )}`}
            register={register}
            name="accountNumber"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.accountNumber.placeolder'
            )}`}
            id="accountNumber"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.bankname.label'
            )}`}
            register={register}
            name="bankname"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.bankname.placeolder'
            )}`}
            id="bankname"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.bankIdCode.label'
            )}`}
            register={register}
            name="bankIdCode"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.bankIdCode.placeolder'
            )}`}
            id="bankIdCode"
            info={`${t(
              'userManagement.fields.bankDetails.fields.bankIdCode.toolagrisync'
            )}`}
          />
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.branch.label'
            )}`}
            register={register}
            name="branch"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.branch.placeolder'
            )}`}
            id="branch"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.bankDetails.fields.taxPayerID.label'
            )}`}
            register={register}
            name="taxPayerID"
            placeholder={`${t(
              'userManagement.fields.bankDetails.fields.taxPayerID.placeolder'
            )}`}
            id="taxPayerID"
            info={`${t(
              'userManagement.fields.bankDetails.fields.taxPayerID.toolagrisync'
            )}`}
          />
        </div>
      </div>
 {/* Socail Media */} 
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.socialMedia.title')}`}
                  </h2>
                  </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mb-3 mt-6">
        <InputElement
            label={`${t(
              'userManagement.fields.socialMedia.fields.facebook.label'
            )}`}
            register={register}
            name="facebook"
            placeholder={`${t(
              'userManagement.fields.socialMedia.fields.facebook.placeolder'
            )}`}
            id="facebook"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.socialMedia.fields.twitter.label'
            )}`}
            register={register}
            name="twitter"
            placeholder={`${t(
              'userManagement.fields.socialMedia.fields.twitter.placeolder'
            )}`}
            id="twitter"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia1.label'
            )}`}
            register={register}
            name="socialMedia1"
            placeholder={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia1.placeolder'
            )}`}
            id="socialMedia1"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia2.label'
            )}`}
            register={register}
            name="socialMedia2"
            placeholder={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia2.placeolder'
            )}`}
            id="socialMedia2"
          />

        </div>

        
      </div>
 {/* Custom Fields */} 
       <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.customFields.title')}`}
                  </h2>
                  </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 mb-3 mt-6">
        <InputElement
            label={`${t(
              'userManagement.fields.customFields.fields.customerField1.label'
            )}`}
            register={register}
            name="customerField1"
            placeholder={`${t(
              'userManagement.fields.customFields.fields.customerField1.placeolder'
            )}`}
            id="customerField1"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.customFields.fields.customerField2.label'
            )}`}
            register={register}
            name="customerField2"
            placeholder={`${t(
              'userManagement.fields.customFields.fields.customerField2.placeolder'
            )}`}
            id="customerField2"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.customFields.fields.customerField3.label'
            )}`}
            register={register}
            name="customerField3"
            placeholder={`${t(
              'userManagement.fields.customFields.fields.customerField3.placeolder'
            )}`}
            id="customerField3"
          />
          <InputElement
            label={`${t(
              'userManagement.fields.customFields.fields.customerField4.label'
            )}`}
            register={register}
            name="customerField4"
            placeholder={`${t(
              'userManagement.fields.customFields.fields.customerField4.placeolder'
            )}`}
            id="customerField4"
          />
        </div>    
      </div>
      
      </>
                          )}
       <div className="mt-9 flex justify-end">
          
          <Button
            variant="secondary"
            className="mb-2 mr-1 w-24"
            onClick={handleSlider}
          >
            {`${t('common.button.cancel')}`}
          </Button>
          <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('common.button.save')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button>
        </div>
    </form>
  )
}

export default EditUser
