/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { InputElement, SearchSelectElement, SelectElement, } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import Lucide from '../../common/lucide'
import { ImageUploadElement,DateElement } from '../../common/form-elements'
import {
  FormInput,
  FormSelect,
  FormInfo,
  FormCheck,
  FormLabel,
  FormInline,
  InputGroup,
  Litepicker,
} from '../../common/form-elements/components'
import productPlaceholder from '../../../assets/images/fakers/image-placeholder-1.png'
import ClassicEditorElement from '../../common/form-elements/classic-editor-element'

function AddFollowUp() {
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
      title: yup
        .string()
        .required(
          `${t(
            'lead.fields.title.validationMessage'
          )}`
        ),
        customerLead: yup
        .string()
        .required(
          `${t(
            'lead.fields.customerLead.validationMessage'
          )}`
        ),
        startDate: yup
        .string()
        .required(
          `${t(
            'lead.fields.startDate.validationMessage'
          )}`
        ),
        endDate: yup
        .string()
        .required(
          `${t(
            'lead.fields.endDate.validationMessage'
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
  const [editorData] = useState(
    `<p>${t('productForm.fields.productDescription.placeolder')}.</p>`
  )

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createCustomer(data)
  }

  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const handleChange = () => {
    setShowMoreInfo(!showMoreInfo)
  }
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
            
           
        <div className="grid grid-cols-1 mt-5 mb-5 gap-7 md:grid-cols-2">
        <InputElement
            label={`${t('lead.fields.title.label')}`}
            register={register}
            name="title"
            error={errors.title}
            required
            id="title"
          />
          <SearchSelectElement
            label={`${t('lead.fields.customerLead.label')}`}
            register={register}
            name="customerLead"
            error={errors.customerLead}
            required
            id="customerLead" 
            onChange={handleChange}      
             />
             <SelectElement
            label={`${t('lead.fields.status.label')}`}
            register={register}
            name="status"
            id="status"
          />
             </div>
             <div className="grid grid-cols-1 mt-7 mb-5 gap-7 md:grid-cols-2">
           <DateElement
            label={`${t('lead.fields.startDate.label')}`}
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
            name="startDate"
            id="startDate"
            error={errors.startDate}
            required
          />
        
           <DateElement
            label={`${t('lead.fields.endDate.label')}`}
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
            name="endDate"
            id="endDate"
            error={errors.endDate}
            required
          />
          </div>
          
          <ClassicEditorElement
              label={`${t('productManagement.fields.productDescription.label')}`}
              register={register}
              required
              value={editorData}
              // onChange={setEditorData}
            />
            <div className="grid grid-cols-1 mt-7 mb-5 gap-7 md:grid-cols-2">
          <SelectElement
            label={`${t('lead.fields.followUpType.label')}`}
            register={register}
            name="followUpType"
            id="followUpType"
            error={errors.followUpType}
            required
          />
          <SelectElement
            label={`${t('lead.fields.assignedTo.label')}`}
            register={register}
            name="assignedTo"
            id="assignedTo"
            error={errors.assignedTo}
            required
          />
                    <FormCheck>
            <FormCheck.Input
              id="vertical-form-3"
              type="checkbox"
              value=""
              checked={isChecked}
              onChange={handleCheckChange}
            />
            <FormCheck.Label className="" htmlFor="vertical-form-3">
              <div className="ml-1 font-medium">
                {`${t(
                'lead.fields.sendNotification.label'
                )}`}
              </div>
            </FormCheck.Label>
            <div className="mx-1 mr-5 flex">
              <FormInfo
                toolagrisync={`${t(
                  'lead.fields.sendNotification.toolagrisync'
                )}`}
              />
            </div>
          </FormCheck>
          {isChecked && (
            
            <>
            <FormCheck>
              <div className="mr-10 font-medium">
                {`${t(
                  'lead.fields.notifyVia.label'
                )}`}
              </div>
              <FormCheck.Input
                id="vertical-form-3"
                type="checkbox"
                value="" />
              <div className="ml-2 mr-2 font-medium">
                {`${t(
                  'SMS'
                )}`}
              </div>
              <FormCheck.Input
                id="vertical-form-3"
                type="checkbox"
                value="" />
              <div className="ml-2 font-medium">
                {`${t(
                  'Email'
                )}`}
              </div>
              <FormCheck.Label className="" htmlFor="vertical-form-3">
              </FormCheck.Label>
            </FormCheck>
            <FormCheck>

            </FormCheck>
           
                <FormInline className="flex-col items-start  first:mt-0 first:pt-0 xl:flex-row">
                  <FormLabel className="">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">{`${t(
                    'lead.fields.notifyBefore.label'
                  )}`}</div>
                      </div>
                    </div>
                  </FormLabel>
                  <div className=" mt-3 w-full flex-1 xl:mt-0">
                    <div className="grid-cols-2 gap-2 sm:grid">
                      <FormInput>
                      
                      </FormInput>
                      <FormSelect>
                        
                      </FormSelect>
                    </div>
                  </div>
                </FormInline>
           </>
          )}
           </div>
              </div>
              
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

export default AddFollowUp
