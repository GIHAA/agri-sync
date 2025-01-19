/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { TextareaElement, DateElement } from '../../common/form-elements'
import { FormInfo, FormCheck } from '../../common/form-elements/components'
import Lucide from '../../common/lucide'

function AddUser() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      firstName: yup
        .string()
        .required(`${t('userManagement.fields.firstName.validationMessage')}`),
      email: yup
        .string()
        .required(`${t('userManagement.fields.email.validationMessage')}`),
      password: yup
        .string()
        .required(
          `${t(
            'userManagement.fields.rolesnPermission.fields.password.validationMessage'
          )}`
        ),
      confirmPassword: yup
        .string()
        .required(
          `${t(
            'userManagement.fields.rolesnPermission.fields.confirmPassword.validationMessage'
          )}`
        ),
      role: yup
        .string()
        .required(
          `${t(
            'userManagement.fields.rolesnPermission.fields.role.validationMessage'
          )}`
        ),
      otherwise: yup.string().notRequired(),

      prefix: yup.string().when('_', {
        is: () => 'tooltip',
        then: yup
          .string()
          .required(`${t('customerForm.fields.prefix.tooltip')}`),
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

  const handleAllowSelectedPaymentAccountsChange = (event: {
    target: { checked: any }
  }) => {
    const { checked } = event.target
    setAllowSelectedPaymentAccounts(checked)
  }

  const handleAllowFundTransferAccountsChange = (event: {
    target: { checked: any }
  }) => {
    const { checked } = event.target
    setAllowFundTransferAccounts(checked)
  }
  const [date, setDate] = useState('')
  const [Prefixtype] = useState([
    { id: 0, name: 'Please Select' },
    { id: 1, name: ' Mr.' },
    { id: 2, name: 'Mrs.' },
    { id: 3, name: 'Miss' },
  ])
  const [Roletype] = useState([
    { id: 0, name: 'Please Select' },
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Cashier 1' },
    { id: 3, name: 'Cashier 2' },
    { id: 4, name: 'Other' },
  ])

  const [Gendertype] = useState([
    { id: 0, name: 'Please Select' },
    { id: 1, name: ' Male' },
    { id: 2, name: 'Female' },
    { id: 3, name: 'Other' },
  ])
  const [Maritaltype] = useState([
    { id: 0, name: 'Please Select' },
    { id: 1, name: ' Married' },
    { id: 2, name: 'Unmarried' },
    { id: 3, name: 'Divorced' },
  ])
  const [allLocationsChecked, setAllLocationsChecked] = useState(false)
  const [bunnyOutletChecked, setBunnyOutletChecked] = useState(false)
  const [testChecked, setTestChecked] = useState(false)

  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const handleMoreInfoClick = () => {
    setShowMoreInfo(!showMoreInfo)
  }

  const handleAllLocationsChange = () => {
    setAllLocationsChecked(!allLocationsChecked)
    setBunnyOutletChecked(!allLocationsChecked)
    setTestChecked(!allLocationsChecked)
  }

  const handleCheckboxChange = (checkboxName: string) => {
    if (checkboxName === 'bunnyOutlet') {
      setBunnyOutletChecked(!bunnyOutletChecked)
    } else if (checkboxName === 'test') {
      setTestChecked(!testChecked)
    }
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box px-5 py-5">
        <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
          <h2 className="mb-4 mr-auto text-base font-medium">
            {`${t('userManagement.fields.title')}`}
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
          <SelectElement
            label={`${t('userManagement.fields.prefix.label')}`}
            register={register}
            options={Prefixtype}
            name="prefix"
            id="prefix"
          />
        </div>
        <div className="mb-3 mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
          <InputElement
            label={`${t('userManagement.fields.firstName.label')}`}
            register={register}
            name="firstName"
            id="firstName"
            error={errors.firstName}
            required
          />
          <InputElement
            label={`${t('userManagement.fields.lastName.label')}`}
            register={register}
            name="last_name"
            id="last_name"
            error={errors.last_name}
          />
          <InputElement
            label={`${t('userManagement.fields.email.label')}`}
            register={register}
            name="email"
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
                  tooltip={`${t('userManagement.fields.activeStatus.tooltip')}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
        </div>
      </div>
      <div className="intro-y box mb-5 px-5 py-5">
        <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
          <h2 className="mb-4 mr-auto text-base font-medium">
            {`${t('userManagement.fields.rolesnPermission.title')}`}
          </h2>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
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

        <div className="grid grid-cols-1 gap-7 border-b py-7 md:grid-cols-2">
          <InputElement
            label={`${t(
              'userManagement.fields.rolesnPermission.fields.password.label'
            )}`}
            register={register}
            name="password"
            type="password"
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
            type="password"
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
              'userManagement.fields.rolesnPermission.fields.role.tooltip'
            )}`}
          />

          <FormCheck>
            <div className="mr-2 font-medium">{`${t(
              'userManagement.fields.rolesnPermission.fields.allowLogin.label'
            )}`}</div>

            <FormCheck.Input
              id="vertical-form-3"
              type="checkbox"
              value=""
              onChange={handleChange}
              className="ml-4"
            />
            <FormCheck.Label className="mr-2" htmlFor="vertical-form-3">
              <div className="mx-1 -ml-1 flex">
                <FormInfo
                  tooltip={`${t('userManagement.fields.activeStatus.tooltip')}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
        </div>

        <div className="mb-5 mt-9 grid grid-cols-1 gap-7 md:grid-cols-1">
          <FormCheck className="">
            <div className=" font-medium">
              {`${t(
                'userManagement.fields.rolesnPermission.fields.accessLocations.label'
              )}`}
            </div>
            <FormCheck.Label className="mr-5">
              <div className="flex">
                <FormInfo
                  tooltip={`${t(
                    'userManagement.fields.rolesnPermission.fields.accessLocations.tooltip'
                  )}`}
                />
              </div>
            </FormCheck.Label>

            <div className="mr-1 flex font-medium">All Locations</div>
            <FormCheck.Input
              className="ml-1 mr-1"
              type="checkbox"
              value=""
              onChange={handleAllLocationsChange}
              checked={allLocationsChecked}
            />
            <div className="flex">
              <FormInfo
                tooltip={`${t(
                  'userManagement.fields.rolesnPermission.fields.allLocations.tooltip'
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
          variant="secondary"
          className="mx-auto mb-5 w-fit px-10"
          onClick={handleMoreInfoClick}
        >
          <div className="mx-auto flex">
            More
            <Lucide
              className="mx-auto ml-1 mt-0.5 h-4 w-4"
              icon={showMoreInfo ? Icons.UPARROW : Icons.DOWNARROW}
            />
          </div>
        </Button>
      </div>
      {showMoreInfo && (
        <>
          {/* Sales */}
          <div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.sales.title')}`}
              </h2>
            </div>
            <div className="mb-3 mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
              <InputElement
                label={`${t(
                  'userManagement.fields.sales.fields.salesPercentage.label'
                )}`}
                register={register}
                name="prefix"
                type="number"
                id="prefix"
                info={`${t(
                  'userManagement.fields.sales.fields.salesPercentage.tooltip'
                )}`}
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.sales.fields.maxSalesDiscountPecentage.label'
                )}`}
                type="number"
                register={register}
                name="first_name"
                id="first_name"
                info={`${t(
                  'userManagement.fields.sales.fields.maxSalesDiscountPecentage.tooltip'
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
                      tooltip={`${t(
                        'userManagement.fields.sales.fields.selectedContacts.tooltip'
                      )}`}
                    />
                  </div>
                </FormCheck.Label>
              </FormCheck>
            </div>
          </div>
          {/* Payment Accounts */}
          <div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.paymentAccounts.title')}`}
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 py-2 md:grid-cols-2">
              <FormCheck className="mt-3">
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
                      tooltip={`${t(
                        'userManagement.fields.paymentAccounts.fields.allowFundTransferAccounts.tooltip'
                      )}`}
                    />
                  </div>
                </FormCheck.Label>
              </FormCheck>
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
            </div>

            <div className="mb-5 mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
              <FormCheck className="mt-3">
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
                      tooltip={`${t(
                        'userManagement.fields.paymentAccounts.fields.allowSelectedPaymentAccounts.tooltip'
                      )}`}
                    />
                  </div>
                </FormCheck.Label>
              </FormCheck>
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
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.moreInformations.title')}`}
              </h2>
            </div>
            <div className=" mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
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
                id="bloodGroup"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.contact.label'
                )}`}
                register={register}
                name="contact"
                type="number"
                id="contact"
              />
            </div>
            <div className="grid grid-cols-1 gap-7 py-7 md:grid-cols-2 ">
              <InputElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.guardianName.label'
                )}`}
                register={register}
                name="guardianName"
                id="guardianName"
              />

              <InputElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.iDProofName.label'
                )}`}
                register={register}
                name="iDProofName"
                id="iDProofName"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.iDProofNo.label'
                )}`}
                register={register}
                name="iDProofNo"
                type="number"
                id="iDProofNo"
              />
            </div>
            <div className="mb-3  grid grid-cols-1 gap-7  md:grid-cols-2 ">
              <TextareaElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.permanentAddress.label'
                )}`}
                register={register}
                name="special_remark"
                id="special_remark"
              />
              <TextareaElement
                label={`${t(
                  'userManagement.fields.moreInformations.fields.currentAddress.label'
                )}`}
                register={register}
                name="special_remark"
                id="special_remark"
              />
            </div>
          </div>
          {/* bank Detail */}
          <div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.bankDetails.title')}`}
              </h2>
            </div>
            <div className="mb-3 mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.accountHolderName.label'
                )}`}
                register={register}
                name="accountHolderName"
                id="accountHolderName"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.accountNumber.label'
                )}`}
                register={register}
                name="accountNumber"
                id="accountNumber"
                type="number"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.bankname.label'
                )}`}
                register={register}
                name="bankname"
                id="bankname"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.bankIdCode.label'
                )}`}
                register={register}
                name="bankIdCode"
                id="bankIdCode"
                info={`${t(
                  'userManagement.fields.bankDetails.fields.bankIdCode.tooltip'
                )}`}
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.branch.label'
                )}`}
                register={register}
                name="branch"
                id="branch"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.bankDetails.fields.taxPayerID.label'
                )}`}
                register={register}
                name="taxPayerID"
                id="taxPayerID"
                info={`${t(
                  'userManagement.fields.bankDetails.fields.taxPayerID.tooltip'
                )}`}
              />
            </div>
          </div>
          {/* Socail Media */}
          <div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.socialMedia.title')}`}
              </h2>
            </div>

            <div className="mb-3 mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
              <InputElement
                label={`${t(
                  'userManagement.fields.socialMedia.fields.facebook.label'
                )}`}
                register={register}
                name="facebook"
                id="facebook"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.socialMedia.fields.twitter.label'
                )}`}
                register={register}
                name="twitter"
                id="twitter"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.socialMedia.fields.socialMedia1.label'
                )}`}
                register={register}
                name="socialMedia1"
                id="socialMedia1"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.socialMedia.fields.socialMedia2.label'
                )}`}
                register={register}
                name="socialMedia2"
                id="socialMedia2"
              />
            </div>
          </div>
          <div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-4 flex flex-col border-b border-slate-200/100 text-base font-medium dark:border-darkmode-400">
              <h2 className="mb-4 mr-auto text-base font-medium">
                {`${t('userManagement.fields.customFields.title')}`}
              </h2>
            </div>
            <div className="mb-3 mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
              <InputElement
                label={`${t(
                  'userManagement.fields.customFields.fields.customerField1.label'
                )}`}
                register={register}
                name="customerField1"
                id="customerField1"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.customFields.fields.customerField2.label'
                )}`}
                register={register}
                name="customerField2"
                id="customerField2"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.customFields.fields.customerField3.label'
                )}`}
                register={register}
                name="customerField3"
                id="customerField3"
              />
              <InputElement
                label={`${t(
                  'userManagement.fields.customFields.fields.customerField4.label'
                )}`}
                register={register}
                name="customerField4"
                id="customerField4"
              />
            </div>
          </div>
        </>
      )}
      <div className=" flex justify-end">
        <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
          {`${t('common.button.save')}`}
          {isLoading ? (
            <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
          ) : (
            ''
          )}
        </Button>
        <Button
          variant="secondary"
          className="mb-2 mr-1 w-24"
          onClick={handleSlider}
        >
          {`${t('common.button.cancel')}`}
        </Button>
      </div>
    </form>
  )
}

export default AddUser
