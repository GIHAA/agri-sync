/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
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
import {
  FormInline,
  FormSelect,
  FormInput,
  FormCheck,
  FormInfo,
} from '../../../components/common/form-elements/components'
import {
  InputElement
} from '../../../components/common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
import { Tab,Menu } from '../../common/headless'
import Lucide from '../../common/lucide'
import PreviewImage from '../../../assets/images/fakers/image-4.jpg'
import TomSelect from '../../../components/common/tom-select'
import VariationTableElement from './variationTable-Elements'
import Pagination from '../../common/pagination'
import { Dialog } from '../../../components/common/headless'
import UploadFilesElement from '../../common/form-elements/upload-files-element'
import ClassicEditorElement from '../../common/form-elements/classic-editor-element'

function ViewUser() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
    .object({
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
  const [select, setSelect] = useState('1')
  const [buttonModalPreview, setButtonModalPreview] = useState(false);

  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }
  const [editorDataDescription] = useState(
    `<p>${t('viewUserManagementNotes.fields.description.placeolder')}.</p>`
  )

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
       <div className="intro-y box mb-5 px-5 ">
     <div className=" py-3 flex w-full sm:mt-0 sm:w-auto justify-end ">
  <TomSelect
    id="update-profile-form-3"
    value={select}
    onChange={setSelect}
    className="w-80"
  >
    <option value="1">Kasun Bandara</option>
    <option value="2">Gayan Perera</option>
    <option value="3">Jayan Bandara</option>
    <option value="4">N.r.j Kasun</option>
  </TomSelect>
</div> </div>

      <Tab.Group className=" intro-y box overflow-hidden">    
        <div className="intro-y box mb-5 px-5 ">
          
          <div className="flex justify-end ">
            
            <div className="mr-2 py-3 ">
            
            </div>
          </div>

          <div className="-mx-5 flex flex-col border-b border-slate-200/60 pb-5 dark:border-darkmode-400 lg:flex-row">
            <div className="flex  flex-1 items-center justify-center px-5 lg:justify-start">
              <div className="image-fit relative h-20 w-20 flex-none sm:h-24 sm:w-24 lg:h-32 lg:w-32">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="rounded-full"
                  src={PreviewImage}
                />
              </div>
              <div className="ml-8">
                <div className="w-24 truncate  text-lg font-medium sm:w-60 sm:whitespace-normal">
                  Kasun Bandara
                </div>
                <div className="mt-1 flex items-center truncate ">
                  <div className="flex items-center truncate text-slate-500">
                    {' '}
                    Username :{' '}
                  </div>
                  <div className="ml-2 sm:whitespace-normal">kasunxty67</div>
                </div>
              </div>
              {/* <a className=" flex items-center" href="#">
                <Lucide icon="Edit" className="h-4 w-4 " />
              </a> */}
            </div>
            <div className="mt-6 flex-1  border-l border-r border-t border-slate-200/60 px-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 ">
              <div className="flex flex-1 items-center justify-center px-5 lg:justify-start">
                <div className="ml-8 pt-9 ">
                  <div className="mt-1 flex items-center truncate ">
                    <div className="flex items-center truncate text-slate-500">
                      {' '}
                      Email :{' '}
                    </div>
                    <div className="ml-2 sm:whitespace-normal">
                      kasunxty67@gmail.com
                    </div>
                  </div>
                  <div className="mt-2 flex items-center truncate text-slate-500">
                    Status :
                    <div className="ml-2 text-slate-500">
                      <div className="cursor-pointer rounded bg-success px-2 py-1 text-xs font-medium text-white">
                        Active
                      </div>
                    </div>
                  </div>

                  {/* <Button
                        as="a"
                        variant="primary"
                        className=" h-8 w-20 mt-2"
                      >
                        Edit
                      </Button> */}
                </div>
              </div>
            </div>
          </div>

          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="flex cursor-pointer items-center py-4">
                <Lucide icon="User" className="mr-2 h-4 w-4" /> User
                Informations
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="flex cursor-pointer items-center py-4">
                <Lucide icon="FileText" className="mr-2 h-4 w-4" /> Document &
                Notes
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels className="mt-5">
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6"></div>
            {/* END: New Authors */}
            <div className="flex items-center border-b border-slate-200 px-5 py-5 dark:border-darkmode-400 sm:py-3">
              <FormInline className="mt-5 flex-col items-start pt-2 first:mt-0 first:pt-0 xl:flex-row">
                <div className="xl:!mr-10 xl:w-96">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-medium">
                        Sales Commission Percentage (%):
                      </div>{' '}
                      5.00%
                    </div>
                  </div>
                </div>
                <div className="xl:!mr-10 xl:w-96">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-medium">Allowed Contacts:</div> All
                    </div>
                  </div>
                </div>
              </FormInline>
            </div>
            <div className="flex items-center  px-5 py-5 pt-5 ">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2 ">
    <div className="font-medium text-lg ">
    More Informations :
                      </div> 
    </div>
  </FormInline>
</div>
            {/* END: New Authors */}
            <div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Date of Birth</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Facebook Link</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
           Refund product & postage for the seller and buyer in case of damage / loss during shipping.
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Custom field 1</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
        
        </div>
      </div>
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Gender</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
         Male
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Twitter Link</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
          Refund product & postage for 
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Custom field 2</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
          Refund product & postage for the seller.
         
        
        </div>
      </div>
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Marital Status</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
        
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Social Media 1</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Custom field 3</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
  </FormInline>
</div>      
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Blood Group</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
        
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Social Media 2</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Custom field 4</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Contact No</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
        
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">ID Proof Name</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">ID Proof Number</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Permanent Address</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
         Refund product & postage for the seller and buyer in case of damage / loss during shipping.
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Current Address</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
           Refund product & postage for the seller and buyer in case of damage / loss during shipping.
          Refund product & postage for the seller and buyer in case of damage / loss during shipping.
        </div>
      </div>
    </div>
    
  </FormInline>
</div>
<div className="flex items-center  px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2 ">
    <div className="font-medium text-lg ">
    Bank Details :
                      </div> 
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Account Holders Name</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
        
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Bank Name</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Branch</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
  </FormInline>
</div>
<div className="flex items-center border-b border-slate-200/60 px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
  <FormInline className="flex-col items-start xl:flex-row">
    <div className="xl:w-64 xl:!mr-2">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Account Number</div>
        </div>
        <div
          className="text-small mt-3 leading-relaxed text-slate-500"
          style={{ maxWidth: '300px', wordWrap: 'break-word' }}
        >
        
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Bank Identifier Code</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
        </div>
      </div>
    </div>
    <div className="xl:w-64 xl:!mr-3">
      <div className="text-left">
        <div className="flex items-center">
          <div className="">Tax Payer ID</div>
        </div>
        <div
          className="mt-3 text-small leading-relaxed text-slate-500"
          style={{ maxWidth: '250px', wordWrap: 'break-word' }}
        >
          Refund product & postage for the seller and buye
        </div>
      </div>
    </div>
  </FormInline>
</div>
{/* Documentn Notes */}
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6"></div>
            {/* END: New Authors */}
            <div className="flex items-center border-b border-slate-200 px-5 py-5 dark:border-darkmode-400 sm:py-3">
              <FormInline className="mt-5 flex-col items-start pt-2 first:mt-0 first:pt-0 xl:flex-row">
              <div className="intro-y  mb-5  px-5 ">
       
              <div className="mt-4 flex w-full sm:mt-0 sm:w-auto justify-end" >
  <Button variant="primary" className="sm:w-auto mr-2 shadow-md"  onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setButtonModalPreview(true);
                }}>
    Add Note
  </Button>

  <Button variant="primary" className="px-2 mr-2"  onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setButtonModalPreview(true);
                }}>
    <span className="flex items-center justify-center w-5 h-5" >
      <Lucide icon="Plus" className="w-4 h-4" />
    </span>
  </Button>

  <Dialog
    size="xl"
    open={buttonModalPreview}
    onClose={() => {
      setButtonModalPreview(false);
    }}
  >
    <Dialog.Panel className="overflow-y-auto">
                  <a onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setButtonModalPreview(false);
                  }}
                    className="absolute top-0 right-0 mt-3 mr-3"
                    href="#"
                  >
                    <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                  </a>
                  <div className="p-7 text-center font-medium">
                  <div className="font-medium text-lg ">
    Add Notes
                      </div> 
                    <div className="overflow-x-auto p-3">
                      <div className="grid grid-cols-1 gap-7 md:grid-cols-1">
                      <InputElement
            label={`${t('viewUserManagementNotes.fields.heading.label')}`}
            register={register}
            name="heading"
            id="heading"
            error={errors.heading}
            type="text"
            required
          />
           <div className="pt-2">
            <ClassicEditorElement
              id="description"
              name="description"
              label={`${t(
                'viewUserManagementNotes.fields.description.label'
              )}`}
              register={register}
              value={editorDataDescription}
            />
          </div>
         <UploadFilesElement
              id="attach_document"
              name="attach_document"
              register={register}
              label={`${t('viewUserManagementNotes.fields.documents.label')}`}
              variant="primary"
              btnLabel={`${t(
                'viewUserManagementNotes.fields.documents.btnPlaceolder'
              )}`}
            />
            
         <FormCheck className="">
            <div className="mr-2 font-medium">{`${t(
              'viewUserManagementNotes.fields.activeStatus.label'
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
                  tooltip={`${t('viewUserManagementNotes.fields.activeStatus.tooltip')}`}
                />
              </div>
            </FormCheck.Label>
          </FormCheck>
         
          </div> 
                        
                    </div>
                    <div className="px-3 pb-4 text-center flex justify-end">
              
              <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
                {`${t('common.button.save')}`}
                {isLoading ? (
                  <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
                ) : (
                  ''
                )}
              </Button>
             
            </div>
                  </div>
                  
                  
                </Dialog.Panel>
              </Dialog>
</div>

         
              <div className="mt- intro-y flex flex-col items-center sm:flex-row xl:mt-4">
            <div className="mt-2 items-center sm:mr-4 sm:flex ">
              Page Size
              <FormSelect className="w-15 !box ">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </FormSelect>
            </div>

            <div className="mx-auto items-center  md:flex">
            <Button
               variant="linkedin"
                className="mr-2 flex items-center"
                size="sm"
              >
                <Lucide icon="Eye" className="mr-2 h-4 w-4" /> Column Visibility
              </Button>
             
              <Menu>
                <Menu.Button
                  as={Button}
                  variant="facebook"
                  className="flex items-center"
                  size="sm"
                >
                  Export As{' '}
                  <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                </Menu.Button>
                <Menu.Items className="w-40">
                  <Menu.Item>
                    <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As CSV
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As Excel
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="mr-2 h-4 w-4" /> Print
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="mr-2 h-4 w-4" /> Export
                    to PDF
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>

            <div className="relative mr-2 flex sm:mt-0 sm:w-64">
              <FormInput
                type="text"
                className="box custom-input"
                placeholder="Search here"
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
              />
            </div>
          </div>
<VariationTableElement
    register={register}
/>
<div className="flex flex-wrap items-center col-span-10 intro-y sm:flex-row sm:flex-nowrap mt-5 ">
<div className="mr-auto  font-medium">
Showing 1 to 10 of 150 entries
</div>
<div className="font-medium">
<Pagination className="w-full sm:w-auto sm:mr-auto">
<Pagination.Link>
  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
</Pagination.Link>
<Pagination.Link>
  <Lucide icon="ChevronLeft" className="w-4 h-4" />
</Pagination.Link>

<Pagination.Link>1</Pagination.Link>
<Pagination.Link active>2</Pagination.Link>
<Pagination.Link>3</Pagination.Link>

<Pagination.Link>
  <Lucide icon="ChevronRight" className="w-4 h-4" />
</Pagination.Link>
<Pagination.Link>
  <Lucide icon="ChevronsRight" className="w-4 h-4" />
</Pagination.Link>
</Pagination>
</div> </div> </div>

              </FormInline>
            </div>
            

          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </form>
  )
}

export default ViewUser
