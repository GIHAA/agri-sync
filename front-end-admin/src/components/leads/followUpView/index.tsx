/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { useState, useRef } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { PosApi } from '../../../api'
import Button from '../../common/button'
import { InputElement, SearchSelectElement, SelectElement, } from '../../common/form-elements'
import Toast from '../../../utils/notification'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import LoadingIcon from '../../common/loading-icon'
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
import Agrisyncpy from '../../common/agrisyncpy'
import Lucide from '../../common/lucide'
import {
  Menu,
  Tab,
  Dialog,
  Disclosure,
} from '../../common/headless'
import Table from '../../common/table'
import PreviewImage from '../../../assets/images/fakers/image-4.jpg'

function FollowUpView() {
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
      logType: yup
        .string()
        .required(
          `${t(
            'lead.fields.logType.validationMessage'
          )}`
        ),
        subject: yup
        .string()
        .required(
          `${t(
            'lead.fields.subject.validationMessage'
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
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
  const deleteButtonRef = useRef(null)
  const [editFollowModal, setEditFollowModal] = useState(false)
  const [editFollowLogModal, setEditFollowLogModal] = useState(false)
  const [addFollowModal, setAddFollowModal] = useState(false)
  const [packagePreview, setPackagePreview] = useState(false) 

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
           <div className="intro-y "> 
        <Tab.Group className=" box  overflow-y-auto">
          <Tab.List className="flex-col border-transparent bg-slate-200 dark:border-transparent dark:bg-darkmode-800 sm:flex-row">
            <Tab fullWidth={false}>
              {({ selected }) => (
                <Tab.Button
                  className={clsx([
                    'flex w-full items-center justify-center px-0 py-0 text-slate-500 sm:w-40',
                    !selected &&
                      'hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300',
                    selected &&
                      'border-transparent text-primary dark:border-transparent dark:bg-darkmode-600 dark:text-white',
                  ])}
                  as="button"
                >
                  <Agrisyncpy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Follow Up Info')}`}</div>
                  </Agrisyncpy>
                </Tab.Button>
              )}
            </Tab>
            <Tab fullWidth={false}>
              {({ selected }) => (
                <Tab.Button
                  className={clsx([
                    'flex w-full items-center justify-center px-0 py-0 text-slate-500 sm:w-40',
                    !selected &&
                      'hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300',
                    selected &&
                      'border-transparent text-primary dark:border-transparent dark:bg-darkmode-600 dark:text-white',
                  ])}
                  as="button"
                >
                  <Agrisyncpy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Follow Up Log')}`}</div>
                  </Agrisyncpy>
                </Tab.Button>
              )}
            </Tab>
            
            
            
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="">
              <div className="intro-y border-b  flex flex-col sm:flex-row items-center">
              <Button variant="primary" size="sm" className="mb-2 " 
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setEditFollowModal(true);
                        }}
                      >
                         <Lucide icon="Edit" className="h-4 w-4 " /> 
                    
                </Button>
              <Button variant="danger" size="sm" className="mb-2 ml-2 flex items-center"
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-4 h-4 " /> 
                    
                </Button>
  
</div>

<div className="-mx-5 flex  flex-col border-b border-slate-200/60 pb-5 dark:border-darkmode-400 lg:flex-row">
<div className="mt-6 flex-1   border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="flex text-center lg:mt-6 lg:text-left ">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium sm:w-auto">
                  Start Date & Time {' : '}
                  </div>
                  <div className=" sm:whitespace-normal">11/07/2023 10:51 AM</div>
                </div>
              </div>
              <div className="flex text-center lg:mt-3 lg:text-left">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium">
                  Start Date & Time {' : '}
                  </div>
                  <div
                    className="sm:whitespace-normal"
                   
                  >
                    11/07/2023 10:51 AM
                  </div>
                </div>
              </div>
              
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="flex text-center lg:mt-6 lg:text-left ">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium sm:w-auto">
                  Status {' : '}
                  </div>
                  <div className=" sm:whitespace-normal">Open</div>
                </div>
              </div>
              <div className="flex text-center lg:mt-3 lg:text-left">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium">
                  Follow Up Type {' : '}
                  </div>
                  <div
                    className="sm:whitespace-normal"
                   
                  >
                   SMS
                  </div>
                </div>
              </div>
              
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="text-center font-medium lg:mt-6 lg:text-left">
              Assigned To {' : '}
              </div>
              <div
                className="mt-3 items-center truncate sm:whitespace-normal"
                style={{ maxWidth: '300px', wordWrap: 'break-word' }}
              >
                Mr.Rimzi
              </div>
            </div>
          </div>

          <div className="-mx-5 mb-5 mt-5 flex  flex-col  pb-5 dark:border-darkmode-400 lg:flex-row">
<div className="mt-6 flex-1   px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="flex text-center lg:mt-6 lg:text-left ">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium sm:w-auto">
                  Customer {' : '}
                  </div>
                  <div className=" sm:whitespace-normal">Mr. Rimzi</div>
                </div>
              </div>
              <div className="flex text-center lg:mt-3 lg:text-left">
                <div className="flex flex-wrap items-start">
                  
                  
                </div>
              </div>
              
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="flex text-center lg:mt-6 lg:text-left ">
                <div className="flex flex-wrap items-start">
                <div className="mr-1 flex items-center truncate font-medium">
                  Address {' : '}
                  </div>
                  <div
                    className="sm:whitespace-normal"
                    style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                    >
                      No 6. Boralasgamuwa, Nittambuwa, Bambalapitiya, Pannipitya,
                      Homagama we
                  </div>
                </div>
              </div>
              
              
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="text-center font-medium lg:mt-6 lg:text-left">
              Mobile {' : '}
              </div>
              <div
                className="mt-3 items-center truncate sm:whitespace-normal"
                
              >
                071 345 67 89
              </div>
            </div>
          </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="">
              <div className="intro-y  flex flex-col sm:flex-row items-center">
              <div className="intro-y   flex flex-col sm:flex-row items-center">
              <Button variant="primary" size="sm" className="mb-2 " 
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setAddFollowModal(true);
                        }}
                      >
                         <Lucide icon="Plus" className="h-4 w-4 " /> 
                    
                </Button>
             
                </div>
</div>
<div className="col-span-12 mt-3 md:col-span-6 2xl:col-span-12 2xl:mt-6">
                
<div className="box mb-5">
              <div className="flex flex-col items-center p-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                <div className="w-24 h-24 lg:w-12 lg:h-12  lg:mr-1">
                <a
                
                    className="flex items-center justify-center w-12 h-12  bg-dark text-white rounded-full dark:bg-darkmode-300 "
                  >
                    <Lucide icon="MessageCircle" className="w-6 h-6" />
                  </a>
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a className="font-medium">
                  Hye123213
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                  Miss Nimasha Nayanamini
                  </div>
                </div>
                <div className="flex mt-3 -ml-2 text-xs lg:justify-end lg:mt-0">
                11/05/2023 02:57 PM ~ 11/09/2023 02:58 PM
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center p-5 lg:flex-nowrap">
                <div className="w-full mb-4 mr-auto lg:w-1/2 lg:mb-0">
                  <div className="flex text-xs text-slate-500">
                  <div className="p-2 mr-auto box bg-primary bg-opacity-80 text-white intro-x">11/07/2023 02:58 PM </div>
                   
                  </div>
                  
                </div>
                <Button variant="primary" size="sm" className="mb-2  mr-1 " 
                       onChange={handleChange}
                       onClick={(event: { preventDefault: () => void }) => {
                         event.preventDefault();
                         setEditFollowLogModal(true);
                       }}
                  >
                  <a className=" flex items-center" href="#">
                    <Lucide icon="Edit" className="h-3 w-3 " /> 
                  </a>
                </Button>
                      <Button variant="linkedin" size="sm" className="mb-2 mr-1" 
               onClick={(event: { preventDefault: () => void }) => {
                event.preventDefault();
                setPackagePreview(true);
              }}
                      >
                         <Lucide icon="Eye" className="h-3 w-3 " /> 
                    
                </Button>
                <Button variant="danger" size="sm" className="mb-2 flex items-center"
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-3 h-3 " /> 
                    
                </Button>
              </div>
            </div>

                <div className="box mb-5">
              <div className="flex flex-col items-center p-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                <div className="w-24 h-24 lg:w-12 lg:h-12  lg:mr-1">
                <a
                
                    className="flex items-center justify-center w-12 h-12  bg-dark  text-white rounded-full dark:bg-darkmode-300 "
                  >
                    <Lucide icon="Mail" className="w-6 h-6" />
                  </a>
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a className="font-medium">
                  Hye123213
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                  Miss Nimasha Nayanamini
                  </div>
                </div>
                <div className="flex mt-3 -ml-2 text-xs lg:justify-end lg:mt-0">
                11/05/2023 02:57 PM ~ 11/09/2023 02:58 PM
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center p-5 lg:flex-nowrap">
                <div className="w-full mb-4 mr-auto lg:w-1/2 lg:mb-0">
                  <div className="flex text-xs text-slate-500">
                  <div className="p-2 mr-auto box bg-primary bg-opacity-80 text-white intro-x">11/07/2023 02:58 PM </div>
                   
                  </div>
                  
                </div>
                <Button variant="primary" size="sm" className="mb-2  mr-1 " 
                       onChange={handleChange}
                       onClick={(event: { preventDefault: () => void }) => {
                         event.preventDefault();
                         setEditFollowLogModal(true);
                       }}
                  >
                  <a className=" flex items-center" href="#">
                    <Lucide icon="Edit" className="h-3 w-3 " /> 
                  </a>
                </Button>
                      <Button variant="linkedin" size="sm" className="mb-2 mr-1" 
               onClick={(event: { preventDefault: () => void }) => {
                event.preventDefault();
                setPackagePreview(true);
              }}
                      >
                         <Lucide icon="Eye" className="h-3 w-3 " /> 
                    
                </Button>
                <Button variant="danger" size="sm" className="mb-2 flex items-center"
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-3 h-3 " /> 
                    
                </Button>
              </div>
            </div>

              
              </div>

              </div>
            </Tab.Panel>
            <Dialog
                  size="xl"
                  open={editFollowModal}
                  onClose={() => {
                    setEditFollowModal(false)
                  }}
                >
                  <Dialog.Panel className="max-h-screen overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'Edit Follow Up'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setEditFollowModal(false)
                      }}
                      className="absolute right-0 top-0 mr-3 mt-3"
                      href="#"
                    >
                      <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                    </a>

                    <Dialog.Description >
                    <div className="intro-y ">
            
           
            <div className="grid grid-cols-1 mb-5 gap-7 md:grid-cols-2">
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
                  
                   <div className=" mt-5 mb-5 flex justify-end">
              <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
                {`${t('common.button.update')}`}
                {isLoading ? (
                  <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
                ) : (
                  ''
                )}
              </Button>
              <Button type="button" variant="outline-secondary" onClick={()=> {
                setEditFollowModal(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
            </div>
                    </Dialog.Description>

                   
                  </Dialog.Panel>
                </Dialog>
                <Dialog
                  size="xl"
                  open={addFollowModal}
                  onClose={() => {
                    setAddFollowModal(false)
                  }}
                >
                  <Dialog.Panel className="max-h-screen overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'Add Follow Up Log'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setAddFollowModal(false)
                      }}
                      className="absolute right-0 top-0 mr-3 mt-3"
                      href="#"
                    >
                      <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                    </a>

                    <Dialog.Description >
                    <div className="intro-y ">
            
           
            <div className="grid grid-cols-1 mb-5 gap-7 md:grid-cols-2">
            <InputElement
                label={`${t('lead.fields.subject.label')}`}
                register={register}
                name="subject"
                error={errors.subject}
                required
                id="subject"
              />
                 <SelectElement
                label={`${t('lead.fields.logType.label')}`}
                register={register}
                name="logType"
                id="logType"
                error={errors.logType}
                required
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
                  label={`${t('lead.fields.description.label')}`}
                  register={register}
                  required
                  value={editorData}
                  // onChange={setEditorData}
                />
                <div className="grid grid-cols-1 mt-7 mb-5 gap-7 md:grid-cols-2">
              <SelectElement
                label={`${t('lead.fields.followUpStatus.label')}`}
                register={register}
                name="followUpStatus"
                id="followUpStatus"

              />
             
                        
               </div>
                  </div>
                  
                   <div className=" mt-5 mb-5 flex justify-end">
              <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
                {`${t('common.button.save')}`}
                {isLoading ? (
                  <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
                ) : (
                  ''
                )}
              </Button>
              <Button type="button" variant="outline-secondary" onClick={()=> {
                setAddFollowModal(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
            </div>
                    </Dialog.Description>

                   
                  </Dialog.Panel>
                </Dialog>
                <Dialog
                  size="xl"
                  open={editFollowLogModal}
                  onClose={() => {
                    setEditFollowLogModal(false)
                  }}
                >
                  <Dialog.Panel className="max-h-screen overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'Edit Follow Up Log'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setEditFollowLogModal(false)
                      }}
                      className="absolute right-0 top-0 mr-3 mt-3"
                      href="#"
                    >
                      <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                    </a>

                    <Dialog.Description >
                    <div className="intro-y ">
            
           
            <div className="grid grid-cols-1 mb-5 gap-7 md:grid-cols-2">
            <InputElement
                label={`${t('lead.fields.subject.label')}`}
                register={register}
                name="subject"
                error={errors.subject}
                required
                id="subject"
              />
                 <SelectElement
                label={`${t('lead.fields.logType.label')}`}
                register={register}
                name="logType"
                id="logType"
                error={errors.logType}
                required
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
                  label={`${t('lead.fields.description.label')}`}
                  register={register}
                  required
                  value={editorData}
                  // onChange={setEditorData}
                />
                <div className="grid grid-cols-1 mt-7 mb-5 gap-7 md:grid-cols-2">
              <SelectElement
                label={`${t('lead.fields.followUpStatus.label')}`}
                register={register}
                name="followUpStatus"
                id="followUpStatus"

              />
             
                        
               </div>
                  </div>
                  
                   <div className=" mt-5 mb-5 flex justify-end">
              <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
                {`${t('common.button.update')}`}
                {isLoading ? (
                  <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
                ) : (
                  ''
                )}
              </Button>
              <Button type="button" variant="outline-secondary" onClick={()=> {
                setEditFollowLogModal(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
            </div>
                    </Dialog.Description>

                   
                  </Dialog.Panel>
                </Dialog>
            <Dialog
              open={deleteConfirmationModal}
              onClose={() => {
                setDeleteConfirmationModal(false)
              }}
              initialFocus={deleteButtonRef}
            >
              <Dialog.Panel >
                <div className="p-5 text-center">
                  <Lucide
                    icon="XCircle"
                    className="mx-auto mt-3 h-16 w-16 text-danger"
                  />
                  <div className="mt-5 text-3xl">Are you sure?</div>
                  <div className="mt-2 text-slate-500">
                    Do you really want to delete these records? <br />
                    This process cannot be undone.
                  </div>
                </div>
                <div className="px-5 pb-8 text-center">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => {
                      setDeleteConfirmationModal(false)
                    }}
                    className="mr-1 w-24"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    className="w-24"
                    ref={deleteButtonRef}
                  >
                    Delete
                  </Button>
                </div>
              </Dialog.Panel>
            </Dialog>   

            <Dialog
              size="lg"
              open={packagePreview}
              onClose={() => {
                setPackagePreview(false)
              }}
            >
              <Dialog.Panel className="max-h-screen overflow-y-auto">
                <Dialog.Title>
                  <h2 className="mr-auto text-base font-medium">{`${t(
                    'Hye123213'
                  )}`}</h2>
                </Dialog.Title>
                <a
                  onClick={() => {
                    setPackagePreview(false)
                  }}
                  className="absolute right-0 top-0 mr-3 mt-3"
                  href="#"
                >
                  <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                </a>

                <Dialog.Description className="grid gap-7 md:grid-cols-1">


{/* <div className="border-b  border-slate-200/60 dark:border-darkmode-400  " /> */}
<div className="flex-1 overflow-x-auto">
    <Table>
       
        <Table.Tbody>
            <Table.Tr>
                <Table.Td className='font-medium'>Start Date & Time</Table.Td>
                <Table.Td >	01/05/2022</Table.Td>
            </Table.Tr>
            <Table.Tr>
                <Table.Td className='font-medium'>End Date & Time</Table.Td>
                <Table.Td >01/05/2022</Table.Td>
            </Table.Tr>
           
        </Table.Tbody>
    </Table>
</div>
<div className=" flex-1 overflow-x-auto">
    
</div>

</Dialog.Description>


                <div className="flex justify-end px-4 pb-4 text-center  ">
                  
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                      setPackagePreview(false)
                    }}
                    className="mb-2 mr-1 w-24"
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Dialog>
          </Tab.Panels>
        </Tab.Group>
      </div>
    
               <div className=" mt-5 flex justify-end">
          
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

export default FollowUpView
