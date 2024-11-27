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
import { InputElement, SelectElement} from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import {
  TextareaElement,
} from '../../common/form-elements'

import { FormInfo, FormCheck } from '../../common/form-elements/components'

function EditAgent() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      first_name: yup
        .string()
        .required(`${t('editAgent.fields.firstName.validationMessage')}`),
      contact: yup
        .string()
        .required(`${t('editAgent.fields.contact.validationMessage')}`),
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
  const [checked, setChecked] = useState(false);

  const handleChange = (event: { target: { id: any; checked: any } }) => {
    const { id, checked } = event.target;
    if (id === 'vertical-form-3') {
      setChecked(checked);
    } else if (id === 'vertical-form-2') {
      setChecked(false);
    }
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-10">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <FormCheck className="">
      <div className="mr-2 font-medium">{`${t('editAgent.fields.commissionAgent.label')}`}</div>
      <FormCheck.Input id="vertical-form-3" type="checkbox" value="" onChange={handleChange} />
      <FormCheck.Label className="mr-2" htmlFor="vertical-form-3">
        <div className="mx-1 -ml-1 flex">
          <FormInfo toolagrisync={`${t('editAgent.fields.commissionAgent.toolagrisync')}`} />
        </div>
      </FormCheck.Label>
    </FormCheck>

    <FormCheck className="">
      <div className="mr-2 font-medium">{`${t('editAgent.fields.serviceStaff.label')}`}</div>
      <FormCheck.Input id="vertical-form-2" type="checkbox" value="" onChange={handleChange} />
      <FormCheck.Label className="mr-2" htmlFor="vertical-form-2">
        <div className="mx-1 -ml-1 flex">
          <FormInfo toolagrisync={`${t('editAgent.fields.serviceStaff.toolagrisync')}`} />
        </div>
      </FormCheck.Label>
    </FormCheck>
          <InputElement
            label={`${t('editAgent.fields.prefix.label')}`}
            register={register}
            name="prefix"
            placeholder={`${t('editAgent.fields.prefix.placeolder')}`}
            id="prefix"
          />
          <InputElement
            label={`${t('editAgent.fields.firstName.label')}`}
            register={register}
            name="first_name"
            placeholder={`${t('editAgent.fields.firstName.placeolder')}`}
            id="first_name"
            error={errors.first_name}
            required
          />
          <InputElement
            label={`${t('editAgent.fields.lastName.label')}`}
            register={register}
            name="last_name"
            placeholder={`${t('editAgent.fields.lastName.placeolder')}`}
            id="last_name"
            error={errors.last_name}
          />
          </div>
          <div className=" py-7 grid grid-cols-1 gap-7 md:grid-cols-2">
        
          <InputElement
            label={`${t('editAgent.fields.email.label')}`}
            register={register}
            name="email"
            placeholder={`${t('editAgent.fields.email.placeolder')}`}
            id="email"
            type="email"
          />
          <InputElement
            label={`${t('editAgent.fields.contact.label')}`}
            register={register}
            name="contact"
            placeholder={`${t('editAgent.fields.contact.placeolder')}`}
            id="contact"
            error={errors.contact}
            required
          />
         
          <TextareaElement
              label={`${t('editAgent.fields.address.label')}`}
              register={register}
              name="address"
              placeholder={`${t(
                'editAgent.fields.address.placeolder'
              )}`}
              id="address"

            />
        </div>
        {checked && (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <InputElement
          label={`${t('editAgent.fields.salesCommissionPercentage.label')}`}
          register={register}
          name="salesCommissionPercentage"
          id="salesCommissionPercentage"
        />
        <InputElement
          label={`${t('editAgent.fields.commissionType.label')}`}
          register={register}
          name="commissionType"
          id="commissionType"
        />
        <SelectElement
          label={`${t('editAgent.fields.commissionVariation.label')}`}
          register={register}
          name="commissionVariation"
          id="commissionVariation"
        />
      </div>
        )}
        <div className="mt-9 flex justify-end">
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
      </div>
     
    </form>
  )
}

export default EditAgent
