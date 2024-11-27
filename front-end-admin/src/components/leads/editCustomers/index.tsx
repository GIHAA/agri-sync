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
import { InputElement, SelectElement, } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import Lucide from '../../common/lucide'
import { ImageUploadElement,DateElement } from '../../common/form-elements'
import { FormLabel } from '../../common/form-elements/components'
import productPlaceholder from '../../../assets/images/fakers/image-placeholder-1.png'

function EditCustomers() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [type] = useState([
    { id: 0, name: ' Supplier' },
    { id: 2, name: 'Customer' },
    { id: 3, name: 'Other' },
  ])
  const [group] = useState([
    { id: 0, name: ' Please Select' },
    { id: 2, name: 'Months' },
    { id: 3, name: 'Dates' },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')
  const [date, setDate] = useState('')

  const schema = yup
    .object({
      first_name: yup
        .string()
        .required(
          `${t(
            'contactManagement.fields.customers.fields.firstName.validationMessage'
          )}`
        ),
      contactNo: yup
        .string()
        .required(
          `${t(
            'contactManagement.fields.customers.fields.contactNo.validationMessage'
          )}`
        ),
      contactType: yup
        .string()
        .required(
          `${t(
            'contactManagement.fields.customers.fields.contactType.validationMessage'
          )}`
        ),
        assignedTo: yup
        .string()
        .required(
          `${t(
            'lead.fields.assignedTo.validationMessage'
          )}`
        ),
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
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const handleChange = () => {
    setShowMoreInfo(!showMoreInfo)
  }
  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
     
      <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('userManagement.fields.title')}`}
                  </h2>
      </div>
          <div className="grid grid-cols-1 gap-7 mb-5 md:grid-cols-2">
        
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.prefix.label')}`}
            register={register}
            name="prefix"
            placeholder={`${t('contactManagement.fields.customers.fields.prefix.placeolder')}`}
            id="prefix"
            // info={`${t('customerForm.fields.prefix.tooltip')}`}
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.firstName.label')}`}
            register={register}
            name="first_name"
            placeholder={`${t('contactManagement.fields.customers.fields.firstName.placeolder')}`}
            id="first_name"
            error={errors.first_name}
            required
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.middleName.label')}`}
            register={register}
            name="middle_name"
            placeholder={`${t('contactManagement.fields.customers.fields.middleName.placeolder')}`}
            id="middle_name"
            error={errors.middle_name}
         
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.lastName.label')}`}
            register={register}
            name="last_name"
            placeholder={`${t('contactManagement.fields.customers.fields.lastName.placeolder')}`}
            id="last_name"
            error={errors.last_name}
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.contactNo.label')}`}
            register={register}
            name="contactNo"
            placeholder={`${t('contactManagement.fields.customers.fields.contactNo.placeolder')}`}
            id="contactNo"
            info={`${t('contactManagement.fields.customers.fields.contactNo.tooltip')}`}
            error={errors.contactNo}
            required
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.email.label')}`}
            register={register}
            name="email"
            placeholder={`${t('contactManagement.fields.customers.fields.email.placeolder')}`}
            id="email"
            error={errors.email}
            type="email"
          />     
        </div>
      </div>
      <div className="intro-y box mb-5 px-5 py-10">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <SelectElement
              label={`${t('lead.fields.source.label')}`}
              register={register}
              name="source"
              id="source"
            />
              <SelectElement
              label={`${t('lead.fields.lifeStage.label')}`}
              register={register}
              name="lifeStage"
              id="lifeStage"
            />
          <SelectElement
              label={`${t('lead.fields.assignedTo.label')}`}
              register={register}
              name="assignedTo"
              id="assignedTo"
              error={errors.email}
              required
            />
          </div>
        </div>
      <div className="item-center flex justify-center py-3">
                            <Button
                              variant="secondary"
                              className="mx-auto mb-5 w-fit px-10"
                              onClick={handleChange}
                            >
                              <div className="mx-auto flex">
                                More
                                <Lucide
                                  className="mx-auto ml-1 mt-0.5 h-4 w-4"
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
        <div className="intro-y box mb-5 px-5 py-10">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            <SelectElement
              label={`${t('contactManagement.fields.customers.fields.contactType.label')}`}
              register={register}
              options={type}
              name="type"
              id="type"
              error={errors.type}
              required
            />
            <InputElement
              label={`${t('contactManagement.fields.customers.fields.contactId.label')}`}
              register={register}
              name="contact_id"
              placeholder={`${t('contactManagement.fields.customers.fields.contactId.placeolder')}`}
              id="contact_id"
              error={errors.contact_id}
              type="number"

            />
            <SelectElement
              label={`${t('contactManagement.fields.customers.fields.customerGroup.label')}`}
              register={register}
              options={group}
              name="customer_group_id"
              id="customer_group_id"
              error={errors.customer_group_id}
            />
            <InputElement
              label={`${t('contactManagement.fields.customers.fields.businessName.label')}`}
              register={register}
              name="supplier_business_name"
              placeholder={`${t('contactManagement.fields.customers.fields.businessName.placeolder')}`}
              id="supplier_business_name"
              error={errors.supplier_business_name}
            />
            <InputElement
              label={`${t('contactManagement.fields.customers.fields.landLine.label')}`}
              register={register}
              name="landline"
              placeholder={`${t('contactManagement.fields.customers.fields.landLine.placeolder')}`}
              id="landline"
              error={errors.landline}
            />

            <InputElement
              label={`${t('contactManagement.fields.customers.fields.alternativeNo.label')}`}
              register={register}
              name="alternate_number"
              placeholder={`${t('contactManagement.fields.customers.fields.alternativeNo.placeolder')}`}
              id="alternate_number"
              error={errors.alternate_number}
            />
          
          </div>
        </div>
     
        <div className="intro-y box mb-5 px-5 py-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-1 md:pl-10">
            <div className="intro-x flex items-center">
              <FormLabel>{`${t(
                'contactManagement.fields.customers.fields.customerImage.label'
              )}`}</FormLabel>
              <div className="ml-3 mb-2 flex text-slate-600 dark:text-slate-500">
                <Lucide icon="Image" className="mr-1 h-4 w-4" />
                {`${t('contactManagement.fields.customers.fields.customerImage.placeolder')}`}
              </div>
            </div>
            <div className="justify-start">
              <ImageUploadElement
                image={productPlaceholder}
                alt={`${t('contactManagement.fields.customers.fields.CustomerImage.imageAlt')}`}
                removeImageContent="Remove this profile photo?"
                buttonLabel="Upload a Photo"
              />
            </div>
          </div>
              </div>
            </div>
            
            <div className="intro-y box mb-5 px-5 py-5">
            <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('contactManagement.fields.customers.fields.financeForm.title')}`}
                  </h2>
      </div>
           
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.financeForm.fields.openingBalance.label')}`}
            register={register}
            name="openingBalance"
            placeholder={`${t('contactManagement.fields.customers.fields.financeForm.fields.openingBalance.label')}`}
            id="openingBalance"
           
        
          />
              <InputElement
            label={`${t('contactManagement.fields.customers.fields.financeForm.fields.payTerm.label')}`}
            register={register}
            name="payTerm"
            placeholder={`${t('contactManagement.fields.customers.fields.financeForm.fields.payTerm.placeolder')}`}
            id="payTerm"
            info={`${t('contactManagement.fields.customers.fields.financeForm.fields.payTerm.tooltip')}`}
            
           
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.financeForm.fields.creditLimit.label')}`}
            register={register}
            name="creditLimit"
            placeholder={`${t('contactManagement.fields.customers.fields.financeForm.fields.creditLimit.placeolder')}`}
            id="creditLimit"
           
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.financeForm.fields.taxNumber.label')}`}
            register={register}
            name="taxNumber"
            placeholder={`${t('contactManagement.fields.customers.fields.financeForm.fields.taxNumber.placeolder')}`}
            id="taxNumber"

          />
              </div>
            </div>
            
            <div className="intro-y box mb-5 px-5 py-5">
            <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('contactManagement.fields.customers.fields.postalForm.title')}`}
                  </h2>
      </div>
           
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.addressLine1.label')}`}
            register={register}
            name="addressLine1"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.addressLine1.placeolder')}`}
            id="addressLine1"
         
        
          />
              <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.addressLine2.label')}`}
            register={register}
            name="addressLine2"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.addressLine2.placeolder')}`}
            id="addressLine2"
         
           
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.city.label')}`}
            register={register}
            name="city"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.city.placeolder')}`}
            id="city"
           
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.state.label')}`}
            register={register}
            name="state"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.state.placeolder')}`}
            id="state"
          />
             <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.country.label')}`}
            register={register}
            name="country"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.country.placeolder')}`}
            id="country"
          />
             <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.zipCode.label')}`}
            register={register}
            name="zipCode"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.zipCode.placeolder')}`}
            id="zipCode"
          />
               <InputElement
            label={`${t('contactManagement.fields.customers.fields.postalForm.fields.deliveryAddress.label')}`}
            register={register}
            name="deliveryAddress"
            placeholder={`${t('contactManagement.fields.customers.fields.postalForm.fields.deliveryAddress.placeolder')}`}
            id="deliveryAddress"
          />
              </div>
            </div>

            <div className="intro-y box mb-5 px-5 py-5">
            <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('contactManagement.fields.customers.fields.otherForm.title')}`}
                  </h2>
      </div>
           
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
           <DateElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.dob.label')}`}
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
          </div>
          <br></br>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField1.label')}`}
            register={register}
            name="customerField1"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField1.placeolder')}`}
            id="customerField1"
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField2.label')}`}
            register={register}
            name="customerField2"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField2.placeolder')}`}
            id="customerField2"
           
          />
          <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField3.label')}`}
            register={register}
            name="customerField3"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField3.placeolder')}`}
            id="customerField3"
          />
             <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField4.label')}`}
            register={register}
            name="customerField4"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField4.placeolder')}`}
            id="customerField4"
          />
             <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField5.label')}`}
            register={register}
            name="customerField5"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField5.placeolder')}`}
            id="customerField5"
          />
               <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField6.label')}`}
            register={register}
            name="customerField6"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField6.placeolder')}`}
            id="customerField6"
          />
                <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField7.label')}`}
            register={register}
            name="customerField7"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField7.placeolder')}`}
            id="customerField7"
          />
               <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField8.label')}`}
            register={register}
            name="customerField8"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField8.placeolder')}`}
            id="customerField8"
          />
                <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField9.label')}`}
            register={register}
            name="customerField9"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField9.placeolder')}`}
            id="customerField9"
          />
             <InputElement
            label={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField10.label')}`}
            register={register}
            name="customerField10"
            placeholder={`${t('contactManagement.fields.customers.fields.otherForm.fields.customerField10.placeolder')}`}
            id="customerField10"
          />
 </div>
              </div>
              </>
      )}
               <div className=" mt-5 flex justify-end">
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

export default EditCustomers
