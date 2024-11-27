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
import { InputElement, SelectElement } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import Button from '../../common/button'
import LoadingIcon from '../../common/loading-icon'

function EditCommision() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      name: yup
        .string()
        .required(`${t('fixedCommission.fields.editCommisionType.fields.name.validationMessage')}`),
        minimumInvoiceCount: yup
        .string()
        .required(`${t('fixedCommission.fields.editCommisionType.fields.minimumInvoiceCount.validationMessage')}`),
        maximumInvoiceCount: yup
        .string()
        .required(
          `${t(
            'fixedCommission.fields.editCommisionType.fields.maximumInvoiceCount.validationMessage'
          )}`
        ),
        fixedRate: yup
        .string()
        .required(
          `${t(
            'fixedCommission.fields.editCommisionType.fields.fixedRate.validationMessage'
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

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-10">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-1">
          <InputElement
            label={`${t(
              'fixedCommission.fields.editCommisionType.fields.name.label'
            )}`}
            register={register}
            name="name"
            placeholder={`${t(
              'fixedCommission.fields.editCommisionType.fields.name.placeolder'
            )}`}
            id="name"
            error={errors.name}
            required
          />
          <InputElement
            label={`${t(
              'fixedCommission.fields.editCommisionType.fields.minimumInvoiceCount.label'
            )}`}
            register={register}
            name="minimumInvoiceCount"
            placeholder={`${t(
              'fixedCommission.fields.editCommisionType.fields.minimumInvoiceCount.placeolder'
            )}`}
            id="minimumInvoiceCount"
            error={errors.minimumInvoiceCount}
            required
          />
          <InputElement
            label={`${t(
              'fixedCommission.fields.editCommisionType.fields.maximumInvoiceCount.label'
            )}`}
            register={register}
            name="maximumInvoiceCount"
            placeholder={`${t(
              'fixedCommission.fields.editCommisionType.fields.maximumInvoiceCount.placeolder'
            )}`}
            id="maximumInvoiceCount"
            required
            error={errors.maximumInvoiceCount}
          />

          <SelectElement
            label={`${t(
              'fixedCommission.fields.editCommisionType.fields.saleType.label'
            )}`}
            register={register}
            name="saleType"
            id="saleType"
            error={errors.saleType}
            required
          />
          <InputElement
            label={`${t(
              'fixedCommission.fields.editCommisionType.fields.fixedRate.label'
            )}`}
            register={register}
            name="fixedRate"
            placeholder={`${t(
              'fixedCommission.fields.editCommisionType.fields.fixedRate.placeolder'
            )}`}
            id="fixedRate"
            required
            error={errors.fixedRate}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('common.button.update')}`}
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

export default EditCommision
