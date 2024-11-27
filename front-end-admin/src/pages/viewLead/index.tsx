/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { SetStateAction, useState, useRef } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PosApi } from '../../api'
import Button from '../../components/common/button'
import {
  FormSelect,
  FormInput,
  FormCheck,
  FormInfo,
} from '../../components/common/form-elements/components'
import {
  InputElement, SelectElement, DateElement, TextareaElement,
} from '../../components/common/form-elements'
import Toast from '../../utils/notification'
import SharedDataContainer from '../../containers/sharedData'
import { Icons, NotificationTypes } from '../..//constants'
import LoadingIcon from '../../components/common/loading-icon'
import { Tab, Menu } from '../../components/common/headless'
import Lucide from '../../components/common/lucide'
import PreviewImage from '../../assets/images/fakers/image-4.jpg'
import TomSelect from '../../components/common/tom-select'
import VariationTableElementDocs from './variationTableDocs-Elements'
import VariationTableElementContact from './variationTableContact-Elements'
import Pagination from '../../components/common/pagination'
import { Dialog } from '../../components/common/headless'
import UploadFilesElement from '../../components/common/form-elements/upload-files-element'
import ClassicEditorElement from '../../components/common/form-elements/classic-editor-element'
import Table from '../../components/common/table'
import { Litepicker } from '../../components/common/form-elements/components'
import SlideoverRegistry from './slideover-registry'
import ShortcutKey from '../../components/common/shortcut-key'
import SlideoverPanel from '../../components/slideover-panel'


interface FormContent {
  title: string
  component: JSX.Element
}


function ViewLead() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')

  const schema = yup
  .object({
    firstName: yup
      .string()
      .required(
        `${t(
          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.firstName.validationMessage'
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
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
  const deleteButtonRef = useRef(null)
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createCustomer(data)
  }
  const [select, setSelect] = useState('1')
  const [buttonModalPreview, setButtonModalPreview] = useState(false)

  const [buttonContactModalPreview, setContactButtonModalPreview] = useState(false)
  const [buttonDueModalPreview, setDueButtonModalPreview] = useState(false)

  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }
  const [editorDataDescription] = useState(
  )
  const [selectedOption, setSelectedOption] = useState('')
  const handleSelectChange = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setSelectedOption(event.target.value)
  }
  const [daterange, setDaterange] = useState('')
  const [date, setDate] = useState('')
  const options = [
    { id: 0, name: 'Cash' },
    { id: 1, name: 'Card' },
    { id: 2, name: 'Cheque' },
    { id: 3, name: 'Bank Transfer' },
    { id: 4, name: 'Other Payments' },
    { id: 5, name: 'Customer Payment' },
  ]

  // eslint-disable-next-line prettier/prettier

  const [sliderSize, setSliderSize] = useState('xl')

  const [sliderContent, setSliderContent] = useState({
    header: '',
    children: <div />,
    footer: <div />,
  })
  const handleClick = ({ title, component }: FormContent) => {
    handleSlider()
    setSliderContent({
      header: title,
      children: component,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const handleKeyUp = (keyName: string) => {
    if (keyName === 'alt+s') {
      handleClick(SlideoverRegistry.addCustomer)
    }
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y mt-4 flex flex-col items-center sm:flex-row">
        <h2 className="ml-2 mr-auto text-lg font-medium">
        View Lead
        </h2>
      </div>
      <div className="intro-y box mb-5 px-5 mt-5">
        <div className=" flex w-full justify-end py-3 sm:mt-0 sm:w-auto ">
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
        </div>{' '}
      </div>

      <Tab.Group className=" intro-y box overflow-hidden">
        <div className="intro-y box mb-5 px-5 ">
          <div className="flex justify-end ">
            <div className="mr-2 py-3 "></div>
          </div>

          <div className="-mx-5 flex flex-col border-b border-slate-200/60 pb-5 dark:border-darkmode-400 lg:flex-row">
            <div className="flex flex-1 items-center justify-center px-5 lg:justify-start">
              <div className="image-fit relative h-20 w-20 flex-none sm:h-24 sm:w-24 lg:h-32 lg:w-32">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="rounded-full"
                  src={PreviewImage}
                />
              </div>
              <div className="ml-5">
                <div className="w-24 truncate text-lg font-medium sm:w-40 sm:whitespace-normal">
                  Kasun Wakwella
                </div>
                <div className="text-slate-500">Supplier</div>
              
              </div>
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="flex text-center lg:mt-6 lg:text-left ">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium sm:w-auto">
                   Assigned To {' : '}
                  </div>
                  <div className=" sm:whitespace-normal">Lizas Closet</div>
                </div>
              </div>
              <div className="flex text-center lg:mt-3 lg:text-left">
                <div className="flex flex-wrap items-start">
                  <div className="mr-1 flex items-center truncate font-medium">
                    Mobile {' : '}
                  </div>
                  <div
                    className="sm:whitespace-normal"
                    style={{ maxWidth: '200px', wordWrap: 'break-word' }}
                  >
                    0713 456 7889
                  </div>
                </div>
              </div>
              <div className="flex text-center lg:mt-3 lg:text-left">
                <div className="flex flex-wrap items-start ">
                  <div className="mr-1 flex items-center truncate font-medium">
                    Tax Number {' : '}
                  </div>
                  <div
                    className="sm:whitespace-normal"
                    style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                  >
                    132442
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex-1 border-l border-r border-t border-slate-200/60 px-5 pt-5 dark:border-darkmode-400 lg:mt-0 lg:border-t-0 lg:pt-0">
              <div className="text-center font-medium lg:mt-6 lg:text-left">
                Address {' : '}
              </div>
              <div
                className="mt-3 items-center truncate sm:whitespace-normal"
                style={{ maxWidth: '300px', wordWrap: 'break-word' }}
              >
                No 6. Boralasgamuwa, Nittambuwa, Bambalapitiya, Pannipitya,
                Homagama we
              </div>
            </div>
          </div>
          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="mr-2 flex cursor-pointer items-center py-4">
               Follow Up
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="mr-2 flex cursor-pointer items-center py-4">
              Documents & Notes
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="mr-2 flex cursor-pointer items-center py-4">
             Contact Persons
              </Tab.Button>
            </Tab>
            
          </Tab.List>
        </div>
        <Tab.Panels className="mt-5">
        <Tab.Panel>
            <div className="intro-y  mb-5 mt-5 px-5  ">
              <div className="mt- intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                <div className=" items-center sm:mr-4 sm:flex ">
                  Page Size
                  <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </FormSelect>
                </div>

                <div className="mx-auto items-center md:flex">
                  <Button
                    className="mr-2 flex items-center"
 
                  >
                    <Lucide icon="Eye" className="mr-2 h-4 w-4" /> Column
                    Visibility
                  </Button>

                  <Menu>
                    <Menu.Button
                      as={Button}
                      className="flex items-center"
                      size="sm"
                    >
                      Export As{' '}
                      <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        CSV
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        Excel
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Print
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Export to PDF
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>

                <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-auto">
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
                <Button
                  variant="primary"
                  className=" shadow-md sm:w-auto"
                  onClick={() => handleClick(SlideoverRegistry.addFollowUp)}
                >
                  Add Follow Up
                </Button>
                <Dialog
                  size="xl"
                  open={buttonContactModalPreview}
                  onClose={() => {
                    setContactButtonModalPreview(false)
                  }}
                >
                  <Dialog.Panel className="overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.title'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setContactButtonModalPreview(false)
                      }}
                      className="absolute right-0 top-0 mr-3 mt-3"
                      href="#"
                    >
                      <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                    </a>

                    <Dialog.Description className="grid gap-7 md:grid-cols-2">
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.prefix.label'
                        )}`}
                        register={register}
                        name="prefix"
                        id="prefix"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.firstName.label'
                        )}`}
                        register={register}
                        name="firstName"
                        id="firstName"
                        required
                        error={errors.firstName}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.lastName.label'
                        )}`}
                        register={register}
                        name="lastName"
                        id="lastName"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.email.label'
                        )}`}
                        register={register}
                        name="email"
                        id="email"
                        required
                        error={errors.email}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.contactNo.label'
                        )}`}
                        register={register}
                        name="contactNo"
                        id="contactNo"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.alternateContactNumber.label'
                        )}`}
                        register={register}
                        name="alternateContactNumber"
                        id="alternateContactNumber"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langContactNumber.label'
                        )}`}
                        register={register}
                        name="langContactNumber"
                        id="langContactNumber"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langDepartment.label'
                        )}`}
                        register={register}
                        name="langDepartment"
                        id="langDepartment"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langDesignation.label'
                        )}`}
                        register={register}
                        name="langDesignation"
                        id="langDesignation"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.username.label'
                        )}`}
                        register={register}
                        name="username"
                        id="username"
                        required
                        error={errors.username}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.password.label'
                        )}`}
                        register={register}
                        name="password"
                        id="password"
                        required
                        error={errors.password}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.confirmPassword.label'
                        )}`}
                        register={register}
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        error={errors.confirmPassword}
                      />
                                    <FormCheck className="">
                              <div className="mr-2 font-medium">{`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.isActive.label'
                              )}`}</div>

                              <FormCheck.Input
                                id="vertical-form-3"
                                type="checkbox"
                                value=""
                                onChange={handleChange}
                              />
                              <FormCheck.Label
                                className="mr-2"
                                htmlFor="vertical-form-3"
                              >
                                <div className="mx-1 -ml-1 flex">
                                  <FormInfo
                                    toolagrisync={`${t(
                                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.isActive.toolagrisync'
                                    )}`}
                                  />
                                </div>
                              </FormCheck.Label>
                            </FormCheck>
                    </Dialog.Description>

                    <div className="flex justify-end px-3 pb-4 text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        className="mb-2 mr-1 w-24"
                        
                      >
                        {`${t('common.button.save')}`}
                        {isLoading ? (
                          <LoadingIcon
                            icon="oval"
                            color="white"
                            className="ml-2 h-4 w-4"
                          />
                        ) : (
                          ''
                        )}
                      </Button>
                 <Button type="button" variant="outline-secondary" onClick={()=> {
                setContactButtonModalPreview(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog>
              </div>
            
              <div className="overflow-y-auto overflow-x-scroll mb-3 py-3">
      <Table bordered className="">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Action
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            Title
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
             Status
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
             Follow Up Type
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            Start Date & Time
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            End Date & Time
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            Assigned To
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td> <div className="items-left flex border-t border-slate-200/60 dark:border-darkmode-400 lg:justify-start">
                <Button variant="primary" size="sm" className="mb-2  mr-2 " 
                  onClick={() => handleClick(SlideoverRegistry.editFollowUp)} >
                  <a className=" flex items-center" href="#">
                    <Lucide icon="Edit" className="h-4 w-4 " /> 
                  </a>
                </Button>
               
                <Button variant="linkedin" size="sm" className="mb-2 mr-2 ">
                <a className="flex items-center" href="#">
                  <Lucide icon="Eye" className="h-4 w-4 " /> 
                </a>
                </Button>
                <Button variant="danger" size="sm" className="mb-2 flex items-center"
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-4 h-4 " /> 
                    
                </Button>
                
              </div></Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
            <Table.Td className="!px-2">nanda@gmail.com</Table.Td>
            <Table.Td className="!px-4">2023.04.05 14:12P.M</Table.Td>
            <Table.Td className="!px-4">2023.04.05 14:12P.M</Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
          </Table.Tr>
         
         
        </Table.Tbody>
      </Table>
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
    </div>
            

              <div className="intro-y col-span-10 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
                <div className="mr-auto  font-medium">
                  Showing 1 to 10 of 150 entries
                </div>
                <div className="font-medium">
                  <Pagination className="w-full sm:mr-auto sm:w-auto">
                    <Pagination.Link>
                      <Lucide icon="ChevronsLeft" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronLeft" className="h-4 w-4" />
                    </Pagination.Link>

                    <Pagination.Link>1</Pagination.Link>
                    <Pagination.Link active>2</Pagination.Link>
                    <Pagination.Link>3</Pagination.Link>

                    <Pagination.Link>
                      <Lucide icon="ChevronRight" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronsRight" className="h-4 w-4" />
                    </Pagination.Link>
                  </Pagination>
                </div>
              </div>
            </div>
          </Tab.Panel>
         
          {/* Docs */}
          <Tab.Panel>
            <div className="intro-y  mb-5 mt-5 px-5  ">
            
                  <Dialog
                    size="xl"
                    open={buttonModalPreview}
                    onClose={() => {
                      setButtonModalPreview(false)
                    }}
                  >
                    <Dialog.Panel className="max-h-screen overflow-y-auto">
                    <Dialog.Title>
                  <h2 className="mr-auto text-base font-medium">{`${t(
                    'Add Notes'
                  )}`}</h2>
                </Dialog.Title>
                      <a
                        onClick={(event: React.MouseEvent) => {
                          event.preventDefault()
                          setButtonModalPreview(false)
                        }}
                        className="absolute right-0 top-0 mr-3 mt-3"
                        href="#"
                      >
                        <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                      </a>
                      <div className="p-7 text-center font-medium mb-5">
                       
                        <div className="overflow-x-auto p-3">
                          <div className="grid grid-cols-1 gap-7 md:grid-cols-1">
                            <InputElement
                              label={`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.heading.label'
                              )}`}
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
                                  'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.description.label'
                                )}`}
                                register={register}
                                value={editorDataDescription}
                              />
                            </div>
                            <UploadFilesElement
                              id="attach_document"
                              name="attach_document"
                              register={register}
                              label={`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.documents.label'
                              )}`}
                              variant="primary"
                              btnLabel={`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.documents.btnPlaceolder'
                              )}`}
                            />

                            <FormCheck className="">
                              <div className="mr-2 font-medium">{`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.activeStatus.label'
                              )}`}</div>

                              <FormCheck.Input
                                id="vertical-form-3"
                                type="checkbox"
                                value=""
                                onChange={handleChange}
                              />
                              <FormCheck.Label
                                className="mr-2"
                                htmlFor="vertical-form-3"
                              >
                                <div className="mx-1 -ml-1 flex">
                                  <FormInfo
                                    toolagrisync={`${t(
                                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.viewNotes.fields.activeStatus.toolagrisync'
                                    )}`}
                                  />
                                </div>
                              </FormCheck.Label>
                            </FormCheck>
                          </div>
                        </div>
                        <div className="flex justify-end px-3 pb-4 text-center">
                          <Button
                            type="submit"
                            variant="primary"
                            className="mb-2 mr-1 w-24"
                          >
                            {`${t('common.button.save')}`}
                            {isLoading ? (
                              <LoadingIcon
                                icon="oval"
                                color="white"
                                className="ml-2 h-4 w-4"
                              />
                            ) : (
                              ''
                            )}
                          </Button>
                          <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => {
                      setButtonModalPreview(false)
                    }}
                    className="mb-2 mr-1 w-24"
                  >
                    Cancel
                  </Button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Dialog>

                 
   
              <div className="mt- intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                <div className="items-center sm:mr-4 sm:flex ">
                  Page Size
                  <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </FormSelect>
                </div>

                <div className="mx-auto items-center md:flex">
                  <Button

                    className="mr-2 flex items-center"

                  >
                    <Lucide icon="Eye" className="mr-2 h-4 w-4" /> Column
                    Visibility
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
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        CSV
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        Excel
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Print
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Export to PDF
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>

                <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-auto">
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
                <Button
                  variant="primary"
                  className=" shadow-md sm:w-auto"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault()
                    setButtonModalPreview(true)
                  }}
                >
                  Add Note
                </Button>
              </div>
              {/* <VariationTableElement register={register} /> */}
              <div className=" mb-3 py-3" style={{ overflowY: 'auto' }}>
                <VariationTableElementDocs register={register} />
              </div>

              <div className="intro-y col-span-10 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
                <div className="mr-auto  font-medium">
                  Showing 1 to 10 of 150 entries
                </div>
                <div className="font-medium">
                  <Pagination className="w-full sm:mr-auto sm:w-auto">
                    <Pagination.Link>
                      <Lucide icon="ChevronsLeft" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronLeft" className="h-4 w-4" />
                    </Pagination.Link>

                    <Pagination.Link>1</Pagination.Link>
                    <Pagination.Link active>2</Pagination.Link>
                    <Pagination.Link>3</Pagination.Link>

                    <Pagination.Link>
                      <Lucide icon="ChevronRight" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronsRight" className="h-4 w-4" />
                    </Pagination.Link>
                  </Pagination>
                </div>
              </div>
            </div>
          </Tab.Panel>
     
          
          {/* Contact */}
          <Tab.Panel>
            <div className="intro-y  mb-5 mt-5 px-5  ">
              <div className="mt- intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                <div className=" items-center sm:mr-4 sm:flex ">
                  Page Size
                  <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </FormSelect>
                </div>

                <div className="mx-auto items-center md:flex">
                  <Button
                    className="mr-2 flex items-center"
                  >
                    <Lucide icon="Eye" className="mr-2 h-4 w-4" /> Column
                    Visibility
                  </Button>

                  <Menu>
                    <Menu.Button
                      as={Button}
                      className="flex items-center"
                      size="sm"
                    >
                      Export As{' '}
                      <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        CSV
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" /> As
                        Excel
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Print
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                        Export to PDF
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>

                <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-auto">
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
                <Button
                  variant="primary"
                  className=" shadow-md sm:w-auto"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault()
                    setContactButtonModalPreview(true)
                  }}
                >
                  Add Login
                </Button>
                <Dialog
                  size="xl"
                  open={buttonContactModalPreview}
                  onClose={() => {
                    setContactButtonModalPreview(false)
                  }}
                >
                  <Dialog.Panel className="overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.title'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setContactButtonModalPreview(false)
                      }}
                      className="absolute right-0 top-0 mr-3 mt-3"
                      href="#"
                    >
                      <Lucide icon="X" className="h-8 w-8 text-slate-400" />
                    </a>

                    <Dialog.Description className="grid gap-7 md:grid-cols-2">
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.prefix.label'
                        )}`}
                        register={register}
                        name="prefix"
                        id="prefix"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.firstName.label'
                        )}`}
                        register={register}
                        name="firstName"
                        id="firstName"
                        required
                        error={errors.firstName}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.lastName.label'
                        )}`}
                        register={register}
                        name="lastName"
                        id="lastName"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.email.label'
                        )}`}
                        register={register}
                        name="email"
                        id="email"
                        required
                        error={errors.email}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.contactNo.label'
                        )}`}
                        register={register}
                        name="contactNo"
                        id="contactNo"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.alternateContactNumber.label'
                        )}`}
                        register={register}
                        name="alternateContactNumber"
                        id="alternateContactNumber"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langContactNumber.label'
                        )}`}
                        register={register}
                        name="langContactNumber"
                        id="langContactNumber"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langDepartment.label'
                        )}`}
                        register={register}
                        name="langDepartment"
                        id="langDepartment"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.langDesignation.label'
                        )}`}
                        register={register}
                        name="langDesignation"
                        id="langDesignation"
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.username.label'
                        )}`}
                        register={register}
                        name="username"
                        id="username"
                        required
                        error={errors.username}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.password.label'
                        )}`}
                        register={register}
                        name="password"
                        id="password"
                        required
                        error={errors.password}
                      />
                      <InputElement
                        label={`${t(
                          'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.confirmPassword.label'
                        )}`}
                        register={register}
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        error={errors.confirmPassword}
                      />
                                    <FormCheck className="">
                              <div className="mr-2 font-medium">{`${t(
                                'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.isActive.label'
                              )}`}</div>

                              <FormCheck.Input
                                id="vertical-form-3"
                                type="checkbox"
                                value=""
                                onChange={handleChange}
                              />
                              <FormCheck.Label
                                className="mr-2"
                                htmlFor="vertical-form-3"
                              >
                                <div className="mx-1 -ml-1 flex">
                                  <FormInfo
                                    toolagrisync={`${t(
                                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.addLogin.fields.isActive.toolagrisync'
                                    )}`}
                                  />
                                </div>
                              </FormCheck.Label>
                            </FormCheck>
                    </Dialog.Description>

                    <div className="flex justify-end px-3 pb-4 text-center">
                      <Button
                        type="submit"
                        variant="primary"
                        className="mb-2 mr-1 w-24"
                        
                      >
                        {`${t('common.button.save')}`}
                        {isLoading ? (
                          <LoadingIcon
                            icon="oval"
                            color="white"
                            className="ml-2 h-4 w-4"
                          />
                        ) : (
                          ''
                        )}
                      </Button>
                 <Button type="button" variant="outline-secondary" onClick={()=> {
                setContactButtonModalPreview(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog>
              </div>
              <div className=" mb-3 py-3">
                <VariationTableElementContact register={register} />
              </div>

              <div className="intro-y col-span-10 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
                <div className="mr-auto  font-medium">
                  Showing 1 to 10 of 150 entries
                </div>
                <div className="font-medium">
                  <Pagination className="w-full sm:mr-auto sm:w-auto">
                    <Pagination.Link>
                      <Lucide icon="ChevronsLeft" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronLeft" className="h-4 w-4" />
                    </Pagination.Link>

                    <Pagination.Link>1</Pagination.Link>
                    <Pagination.Link active>2</Pagination.Link>
                    <Pagination.Link>3</Pagination.Link>

                    <Pagination.Link>
                      <Lucide icon="ChevronRight" className="h-4 w-4" />
                    </Pagination.Link>
                    <Pagination.Link>
                      <Lucide icon="ChevronsRight" className="h-4 w-4" />
                    </Pagination.Link>
                  </Pagination>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <ShortcutKey onKeyUp={handleKeyUp} />
      <SlideoverPanel
        close
        size={sliderSize}
        heading={sliderContent.header}
        footer={sliderContent.footer}
      >
        {sliderContent.children}
      </SlideoverPanel>
    </form>
  )
}

export default ViewLead
