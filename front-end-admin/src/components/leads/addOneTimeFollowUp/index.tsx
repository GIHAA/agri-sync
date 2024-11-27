/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { useState, useRef } from 'react'
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
import { Menu, Dialog } from '../../common/headless'
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
import TomSelect from '../../common/tom-select'
import Table from '../../common/table'

function AddOneTimeFollowUp() {
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
  const [selectMulagrisyncleOne, setSelectMulagrisyncleOne] = useState<string>('0');
  const [selectOne, setSelectOne] = useState<string[]>([])
  const [selectOneCustomer, setSelectOneCustomer] = useState<string[]>([])
  const [showSecondTomSelect, setShowSecondTomSelect] = useState(false);
  const [showThirdTomSelect, setShowThirdTomSelect] = useState(false);
  const [showLastTomSelect, setShowLastTomSelect] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllCustomerChecked, setSelectAllCustomerChecked] = useState(false);
  const [deselectAllChecked, setDeselectAllChecked] = useState(false);
  const [deselectAllCustomerChecked, setDeselectAllCustomerChecked] = useState(false);

  const handleSelectMulagrisyncleOneChange = (newValue: string) => {
    setSelectMulagrisyncleOne(newValue);

    const isPaymentStatusSelected = ['1', '2', '3', '4'].includes(newValue);
    setShowSecondTomSelect(isPaymentStatusSelected);
  
    if (!isPaymentStatusSelected) {
      setSelectAllChecked(false);
      setDeselectAllChecked(false);
    }

    const isContactSelected = newValue.includes('8')
    setShowThirdTomSelect( isContactSelected);
  
    if ( !isContactSelected) {
      setSelectAllCustomerChecked(false);
      setDeselectAllCustomerChecked(false);
    }

    const isOrdersSelected = newValue.includes('6') || newValue.includes('7')
    setShowLastTomSelect( isOrdersSelected);
  
  }


  const handleSelectAll = () => {
    setSelectAllChecked(true);
    setDeselectAllChecked(false);
    setSelectOne(['1', '2', '3', '4']);
  }
  
  const handleDeselectAll = () => {
    setSelectAllChecked(false);
    setDeselectAllChecked(true);
    setSelectOne([]);
  }

  const handleCheckAll = (selectAll: boolean) => {
    if (selectAll) {
      handleSelectAll();
    } else {
      handleDeselectAll();
    }
  }  

  const handleSelectCustomerAll = () => {
    setSelectAllCustomerChecked(true);
    setDeselectAllCustomerChecked(false);
    setSelectOneCustomer(['5', '6', '7', '8']);
  }
  
  const handleDeselectCustomerAll = () => {
    setSelectAllCustomerChecked(false);
    setDeselectAllCustomerChecked(true);
    setSelectOneCustomer([]);
  }
  
  
  const handleCheckCustomerAll = (selectAll: boolean) => {
    if (selectAll) {
      handleSelectCustomerAll();
    } else {
      handleDeselectCustomerAll();
    }
  }  
 
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isBox2Visible, setIsBox2Visible] = useState(false);
  const [isBox3Visible, setIsBox3Visible] = useState(false);

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="mb-5 grid grid-cols-1 gap-5 px-5 pt-5 sm:grid-cols-2">
      <div className="relative font-medium sm:mt-0">
      <div  className="mb-4 "> <div className="mt-0.5 ">{`${t('Follow Up By')}`}</div></div> 
       <TomSelect
  value={selectMulagrisyncleOne}
  onChange={handleSelectMulagrisyncleOneChange}
  options={{
    placeholder: 'Select an option',
  }}
>
  <optgroup label="Payment Status">
    <option value="1">All</option>
    <option value="2">Due</option>
    <option value="3">Partial</option>
    <option value="4">Overdue</option>
  </optgroup>
  <optgroup label="Orders">
    <option value="6">Has Transaction</option>
    <option value="7">Has No Transaction</option>
  </optgroup>
  <optgroup label="Contact">
    <option value="8">Name</option>
  </optgroup>
</TomSelect>
      </div>

      {showSecondTomSelect && (
        <div className="relative font-medium sm:mt-0">
              <div className=" flex "> <div className=" flex mr-2 mt-2">{`${t('Invoices')}`}</div>
                <Button variant="primary" rounded size="sm" className=" flex ml-2  mr-2 mb-2" 
                onClick={() => handleCheckAll(true)}>Select All</Button>
                <Button variant="secondary" size="sm" rounded className=" flex mb-2" 
                onClick={() => handleCheckAll(false)}>Deselect All</Button>
              </div>
              <TomSelect
                value={selectOne}
                onChange={setSelectOne}
                options={{
                  placeholder: 'Please Select ',
                }}
                className="sm:w-auto"
                mulagrisyncle
              >
                <option value="1">0234 Partial(Mr.Rimzi)</option>
                <option value="2">4536 Partial(Mr.Shani)</option>
                <option value="3">0534 Partial(Mr.Timi)</option>
                <option value="4">0234 Partial(Mr.shara)</option>
              </TomSelect>
            </div>
            
        

      )}
      {showThirdTomSelect && (
            <div className="relative font-medium sm:mt-0">
            <div className=" flex "> <div className=" flex mr-2 mt-2">{`${t('Customer')}`}</div>
              <Button variant="primary" rounded size="sm" className=" flex ml-2  mr-2 mb-2" 
              onClick={() => handleCheckCustomerAll(true)}>Select All</Button>
              <Button variant="secondary" size="sm" rounded className=" flex mb-2" onClick={() => 
                handleCheckCustomerAll(false)}>Deselect All</Button>
            </div>
            <TomSelect
              value={selectOneCustomer}
              onChange={setSelectOneCustomer}
              options={{
                placeholder: 'Please Select ',
              }}
              className="sm:w-auto"
              mulagrisyncle
            >
              <option value="5">Walking Customer</option>
              <option value="6">Mr.Shani</option>
              <option value="7">Mr.Timi</option>
              <option value="8">Mr.shara</option>
            </TomSelect>
          </div>
      )}
      {showLastTomSelect && (
            <div className="relative font-medium sm:mt-0">
            <div className=" flex mr-2 mt-2">{`${t('In Days')}`}</div>
            <InputGroup className="mt-2">
                      <InputGroup.Text>
                        {' '}
                        <Lucide icon="Calendar" className="h-5 w-4" />
                      </InputGroup.Text>
                      <FormInput type="number" placeholder="" />
                      <InputGroup.Text>Days</InputGroup.Text>
                    </InputGroup>
           
          </div>
      )}
    </div>
<div className="  px-5 flex justify-end">
{showSecondTomSelect && (
    <Button
    type="submit"
    variant="primary"
    className="mb-2 mr-1 w-24"
    onClick={() => {
      setIsBoxVisible(true);
      setIsBox2Visible(false);
      setIsBox3Visible(false);
    }}
  
  >
    {`${t('Next')}`}
    {isLoading ? (
      <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
    ) : (
      ''
    )}
  </Button>
  )}
</div>
<div className="  px-5 flex justify-end">
  {showThirdTomSelect && (
    <Button
  type="submit"
  variant="primary"
  className="mb-2 mr-1 w-24"
  onClick={() => {
    setIsBoxVisible(false);
    setIsBox2Visible(true);
    setIsBox3Visible(false);
  }}
      >
        {`${t('Next')}`}
        {isLoading ? (
          <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
        ) : (
          ''
        )}
      </Button>
      )}
</div>
<div className="  px-5 flex justify-end">
  {showLastTomSelect && (
 <Button
 type="submit"
  variant="primary"
  className="mb-2 mr-1 w-24"
  onClick={() => {
    setIsBoxVisible(false);
    setIsBox2Visible(false);
    setIsBox3Visible(true);
  }}
>
 {`${t('Next')}`}
 {isLoading ? (
   <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
 ) : (
   ''
 )}
</Button>
  )}
</div>

      </div>
      {isBoxVisible && (
     <div className="intro-y box mb-5 px-5 py-5">
          <div className="overflow-y-auto overflow-x-scroll ">
            <Table bordered>
              <Table.Thead variant="default">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-slate-500 dark:bg-darkmode-800">
                    Customer
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-slate-500 dark:bg-darkmode-800">
                    Invoices
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap bg-slate-50 text-slate-500 dark:bg-darkmode-800">
                    Assgined to
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-center text-slate-500 dark:bg-darkmode-800">
                    <div className="flex justify-center items-center">
                      <a>
                        {' '}
                        <Lucide
                          icon="Trash2"
                          className=" h-4 w-4" />{' '}
                      </a>
                    </div>
                  </Table.Th>



                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="!px-4">Fathima </Table.Td>
                  <Table.Td className="!px-4">
                    77006
                  </Table.Td>
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="!px-4">Fathima </Table.Td>
                  <Table.Td className="!px-4">
                    77006
                  </Table.Td>
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
              </Table.Tbody>

            </Table>

           
          </div>
        </div>
       
      )}

{isBox2Visible && (
     <div className="intro-y box mb-5 px-5 py-5">
          <div className="overflow-y-auto overflow-x-scroll ">
            <Table bordered>
              <Table.Thead variant="default">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-slate-500 dark:bg-darkmode-800">
                    Customer
                  </Table.Th>
                  
                  <Table.Th className="whitespace-nowrap bg-slate-50 text-slate-500 dark:bg-darkmode-800">
                    Assgined to
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-center text-slate-500 dark:bg-darkmode-800">
                    <div className="flex justify-center items-center">
                      <a>
                        {' '}
                        <Lucide
                          icon="Trash2"
                          className=" h-4 w-4" />{' '}
                      </a>
                    </div>
                  </Table.Th>



                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="!px-4">Fathima </Table.Td>
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="!px-4">Fathima </Table.Td>
                 
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
              </Table.Tbody>

            </Table>

           
          </div>
        </div>
       
      )}
{isBox3Visible && (
     <div className="intro-y box mb-5 px-5 py-5">
          <div className="overflow-y-auto overflow-x-scroll ">
            <Table bordered>
              <Table.Thead variant="default">
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-slate-500 dark:bg-darkmode-800">
                    Customer
                  </Table.Th>
                  
                  <Table.Th className="whitespace-nowrap bg-slate-50 text-slate-500 dark:bg-darkmode-800">
                    Assgined to
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap bg-slate-50  text-center text-slate-500 dark:bg-darkmode-800">
                    <div className="flex justify-center items-center">
                      <a>
                        {' '}
                        <Lucide
                          icon="Trash2"
                          className=" h-4 w-4" />{' '}
                      </a>
                    </div>
                  </Table.Th>



                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="!px-4">Walking </Table.Td>
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="!px-4">Fathima </Table.Td>
                 
                  <Table.Td className="!px-2">
                    <SelectElement
                      register={register}
                      name="assignedTo"
                      id="assignedTo" /></Table.Td>

                  <Table.Td>
                    <div className='flex justify-center items-center text-slate-500'>
                      <a
                        href=""
                        onChange={handleChange}
                        onClick={(event: {
                          preventDefault: () => void
                        }) => {
                          event.preventDefault()
                          setDeleteConfirmationModal(true)
                        } }
                      >
                        <Lucide icon="Trash2" className="h-4 w-4" />
                      </a>
                    </div>

                  </Table.Td>

                </Table.Tr>
              </Table.Tbody>

            </Table>

           
          </div>
        </div>
       
      )}
 <Dialog
              open={deleteConfirmationModal}
              onClose={() => {
                setDeleteConfirmationModal(false)
              } }
              initialFocus={deleteButtonRef}
            >
              <Dialog.Panel>
                <div className="p-5 text-center">
                  <Lucide
                    icon="XCircle"
                    className="mx-auto mt-3 h-16 w-16 text-danger" />
                  <div className="mt-5 text-3xl">
                    Are you sure?
                  </div>
                  <div className="mt-2 text-slate-500">
                    Do you really want to delete these records?{' '}
                    <br />
                    This process cannot be undone.
                  </div>
                </div>
                <div className="px-5 pb-8 text-center">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => {
                      setDeleteConfirmationModal(false)
                    } }
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
<div className="intro-y box mb-5 px-5 py-5">
            <div className="mb-5 mt-5 grid grid-cols-1 gap-7 md:grid-cols-2">
              <InputElement
                label={`${t('lead.fields.title.label')}`}
                register={register}
                name="title"
                error={errors.title}
                required
                id="title" />
              <SelectElement
                label={`${t('lead.fields.status.label')}`}
                register={register}
                name="status"
                id="status" />
            </div>
            <div className="mb-5 mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
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
                required />

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
                required />
            </div>

            <ClassicEditorElement
              label={`${t('lead.fields.description.label')}`}
              register={register}
              required
              value={editorData} />
            <div className="mb-5 mt-7 grid grid-cols-1 gap-7 md:grid-cols-2">
              <SelectElement
                label={`${t('lead.fields.followUpType.label')}`}
                register={register}
                name="followUpType"
                id="followUpType"
                error={errors.followUpType}
                required />
              <SelectElement
                label={`${t('lead.fields.assignedTo.label')}`}
                register={register}
                name="assignedTo"
                id="assignedTo"
                error={errors.assignedTo}
                required />
              <FormCheck>
                <FormCheck.Input
                  id="vertical-form-3"
                  type="checkbox"
                  value=""
                  checked={isChecked}
                  onChange={handleCheckChange} />
                <FormCheck.Label className="" htmlFor="vertical-form-3">
                  <div className="ml-1 font-medium">
                    {`${t('lead.fields.sendNotification.label')}`}
                  </div>
                </FormCheck.Label>
                <div className="mx-1 mr-5 flex">
                  <FormInfo
                    toolagrisync={`${t('lead.fields.sendNotification.toolagrisync')}`} />
                </div>
              </FormCheck>
              {isChecked && (
                <>
                  <FormCheck>
                    <div className="mr-10 font-medium">
                      {`${t('lead.fields.notifyVia.label')}`}
                    </div>
                    <FormCheck.Input
                      id="vertical-form-3"
                      type="checkbox"
                      value="" />
                    <div className="ml-2 mr-2 font-medium">{`${t('SMS')}`}</div>
                    <FormCheck.Input
                      id="vertical-form-3"
                      type="checkbox"
                      value="" />
                    <div className="ml-2 font-medium">{`${t('Email')}`}</div>
                    <FormCheck.Label
                      className=""
                      htmlFor="vertical-form-3"
                    ></FormCheck.Label>
                  </FormCheck>
                  <FormCheck></FormCheck>

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
                        <FormInput></FormInput>
                        <FormSelect></FormSelect>
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

export default AddOneTimeFollowUp
function setSelectAllChecked(arg0: boolean) {
  throw new Error('Function not implemented.')
}

