/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { InputElement } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import { FormCheck } from '../../common/form-elements/components'
import ClassicEditorElement from '../../common/form-elements/classic-editor-element'

function AddReceiptLayout() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
      layoutName: yup
        .string()
        .required(`${t('settings.fields.layoutName.validationMessage')}`),
      city: yup
        .string()
        .required(`${t('settings.fields.city.validationMessage')}`),

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
  const [editorDataExpensesNote, setEditorDataExpensesNote] = useState(
    `<p>${t(
      ''
    )}.</p>`
  )
  const [checked, setChecked] = useState(false)
  const handleChange = () => {
    setChecked(!checked)
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box  px-5 py-10">
        <div className="mb-7 grid grid-cols-1 gap-7 md:grid-cols-2">
          <InputElement
            label={`${t('settings.fields.layoutName.label')}`}
            register={register}
            required
            name="layoutName"
            id="layoutName"
            error={errors.layoutName}
          />
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <ClassicEditorElement
                    id="headerText"
                    name="headerText"
                    label={`${t(
                      'settings.fields.headerText.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
          
          </div>
          <div className="flex">
                  <FormCheck className="mt-7">
                    <FormCheck.Input
                      id="vertical-form-4"
                      type="checkbox"
                      value=""
                      onChange={handleChange}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                        'settings.fields.setdefault.label'
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-7">
                    <FormCheck.Input
                      id="vertical-form-4"
                      type="checkbox"
                      value=""
                      onChange={handleChange}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                      'settings.fields.customerSignatureLabel.label'
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                  
                </div>
       
              
        <div className="mt-9 flex justify-end">
          <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('common.button.update')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button>
          
        </div>
      </div>
    </form>
  )
}

export default AddReceiptLayout
