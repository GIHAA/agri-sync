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
import { InputElement, SelectElement, } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import Lucide from '../../common/lucide'
import { ImageUploadElement,DateElement } from '../../common/form-elements'
import { FormLabel } from '../../common/form-elements/components'
import productPlaceholder from '../../../assets/images/fakers/image-placeholder-1.png'
import ClassicEditorElement from '../../common/form-elements/classic-editor-element'
import UploadFilesElement from '../../common/form-elements/upload-files-element'
import Table from '../../common/table'

function ViewProposalTemplate() {
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
        sendTo: yup
        .string()
        .required(
          `${t(
            'lead.fields.sendTo.validationMessage'
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
  const [editorData] = useState(
    `<p>${t('productForm.fields.productDescription.placeolder')}.</p>`
  )
  const [editorDataExpensesNote, setEditorDataExpensesNote] = useState(
    `<p>${t(
      ''
    )}.</p>`
  )
  
  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="flex-1 overflow-x-auto">
    <Table>
       
        <Table.Tbody>
            <Table.Tr>
                <Table.Td className='font-medium'>Subject</Table.Td>
                <Table.Td >	SMS</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td className='font-medium'>Email Body</Table.Td>
                <Table.Td >description</Table.Td>
            </Table.Tr>
            
        </Table.Tbody>
    </Table>
</div>
               
              </div>
        
              <div className="intro-y box px-5 py-5">
        <div className="flex flex-col border-b mb-4 font-medium text-base border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('Attachments')}`}</h2>
                  </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="col-span-2 ">
          <div className="intro-y flex justify-between">
  <div className="justify-start">
    <ImageUploadElement
      image={productPlaceholder}
      alt={`${t('contactManagement.fields.customers.fields.CustomerImage.imageAlt')}`}
      removeImageContent="Remove this Document?"
      buttonLabel="Change Document"
    />
  </div>

  <div className="justify-end">
    <Button
      variant="success"
      className="text-white"
      onClick={handleSlider}
    >
      {`${t('Download File')}`}
    </Button>
  </div>
</div>
           
          </div>
          
              </div>
            
            </div>
          
               <div className=" mt-5 flex justify-end">
          {/* <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('Edit')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button>
          <Button type="submit" variant="twitter" className="mb-2 mr-1 w-24">
            {`${t('Send')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button> */}
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

export default  ViewProposalTemplate
