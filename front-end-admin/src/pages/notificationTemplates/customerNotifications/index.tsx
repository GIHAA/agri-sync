/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import _ from 'lodash'
import Table from '../../../components/common/table'
import { SetStateAction, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../../../components/common/button'
import Tippy from '../../../components/common/tippy'
import Lucide from '../../../components/common/lucide'
import {
  Menu,
  Tab,
  Dialog,
  Disclosure,
} from '../../../components/common/headless'
import Pagination from '../../../components/common/pagination'
import {
  FormInput,
  FormSelect,
  FormInfo,
  FormCheck,
  FormLabel,
  FormInline,
  InputGroup,
  Litepicker,
} from '../../../components/common/form-elements/components'
import {
  SearchSelectElement,
  DateElement,
  SelectElement,
  TextareaElement,
  InputElement,
} from '../../../components/common/form-elements'
import SharedDataContainer from '../../../containers/sharedData'
import ShortcutKey from '../../../components/common/shortcut-key'
import SlideoverPanel from '../../../components/slideover-panel'
import { useTranslation } from 'react-i18next'
import PreviewImage from '../../../../assets/images/fakers/image2.jpg'
import { Icons, NotificationTypes } from '../../../constants'
import Alert from '../../../base-components/Alert'
import { AlignmentTypes } from '../../../constants/common-enums'
import LoadingIcon from '../../../components/common/loading-icon'
import clsx from 'clsx'
import ClassicEditorElement from '../../../components/common/form-elements/classic-editor-element'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Toast from '../../../utils/notification'
import { PosApi } from '../../../api'

interface FormContent {
  title: string
  component: JSX.Element
}

interface Props {
  setSliderContent: React.Dispatch<React.SetStateAction<any>>
}

function Main() {
  const posApi = PosApi.useAPI()
  const { handleSlider } = SharedDataContainer.useContainer()
  // eslint-disable-next-line prettier/prettier
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sliderSize, setSliderSize] = useState('xl')
  const { t } = useTranslation('pos')
  const schema = yup
    .object({
      status: yup
        .string()
        .required(
          `${t('repair.fields.jobsheet.fields.status.validationMessage')}`
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
  const { setNotification } = SharedDataContainer.useContainer()

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
  const [date, setDate] = useState('')
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
  const deleteButtonRef = useRef(null)

  const [tooltipContent2] = useState(
    'Stock transfer will not be editable if status is completed'
  )
  const [checked, setChecked] = useState(false)
  const [purchaseDetailsPreview, setPurchaseDetailsPreview] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
  }

  const [statusPreview, setStatusPreview] = useState(false)
  const [editorDataExpensesNote, setEditorDataExpensesNote] = useState(
    `<p>${t(
      'Dear {contact_name}, Thank you for shopping with us. {business_name}'
    )}.</p>`
  )
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const handleChangeHide = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) }
  }) => {
    setIsCheckboxChecked(event.target.checked)
  }

  return (
    <div>
      <div className="intro-y mt-4 flex flex-col items-center sm:flex-row">
        <h2 className="ml-2 mr-auto text-lg font-medium">
          {`Notification Templates `}
        </h2>
      </div>

      <div className="intro-y box mb-5 mt-5 px-5 py-5 ">
        <div className="flex flex-col border-b  text-base font-medium  dark:border-darkmode-400">
          <h2 className="mb-4 mr-auto text-base font-medium">
            {`${t('Details ')}`}
          </h2>
        </div>
        <Tab.Group className=" box mt-5 overflow-y-auto">
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Send Ledger')}`}</div>
                  </Tippy>
                </Tab.Button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {balance_due}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Email Subject')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="intro-y box mb-5 mt-5 px-5 py-5 ">
        <div className="flex flex-col border-b  text-base font-medium  dark:border-darkmode-400">
          <h2 className="mb-4 mr-auto text-base font-medium">
            {`${t('Customer Notifications ')}`}
          </h2>
        </div>
        <Tab.Group className=" box mt-5 overflow-y-auto">
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('New Sale')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Reminder')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Payment Received')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Payment Reminder')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('New Booking')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('New Quotation')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('New Final')}`}</div>
                  </Tippy>
                </Tab.Button>
              )}
            </Tab>
          </Tab.List>
         
          <Tab.Panels>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {invoice_url}, {total_amount}, {paid_amount}, {due_amount}, {cumulative_due_amount}, {due_date}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Thank you from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
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
                      onChange={handleChangeHide}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                        'Auto Send Email '
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-7">
                    <FormCheck.Input
                      id="vertical-form-4"
                      type="checkbox"
                      value=""
                      onChange={handleChangeHide}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                        'Auto Send SMS '
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {invoice_url}, {total_amount}, {paid_amount}, {due_amount}, {cumulative_due_amount}, {due_date}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Email Subject')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {payment_ref_number}, {received_amount}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Payment Received, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
  
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {due_amount}, {cumulative_due_amount}, {due_date}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Payment Reminder, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
  
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{contact_name}, {table}, {start_time}, {end_time}, {location}, {service_staff}, {correspondent}, {business_name}, {business_logo}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Booking Confirmed - {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
  
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {total_amount}, {quote_url}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Thank you from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
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
                      onChange={handleChangeHide}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                        'Auto Send Email '
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-7">
                    <FormCheck.Input
                      id="vertical-form-4"
                      type="checkbox"
                      value=""
                      onChange={handleChangeHide}
                    />
                    <FormCheck.Label
                      className="mr-2  flex"
                      htmlFor="vertical-form-3"
                    >
                      <div className="mr-2 font-medium">{`${t(
                        'Auto Send SMS '
                      )}`}</div>
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_name}, {invoice_number}, {total_amount}, {quote_url}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Email Subject')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="intro-y box mb-5 mt-5 px-5 py-5 ">
        <div className="flex flex-col border-b  text-base font-medium  dark:border-darkmode-400">
          <h2 className="mb-4 mr-auto text-base font-medium">
            {`${t('Supplier Notifications ')}`}
          </h2>
        </div>
        <Tab.Group className=" box mt-5 overflow-y-auto">
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('New Order')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Payment Paid')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Item received')}`}</div>
                  </Tippy>
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
                  <Tippy
                    content=""
                    className="flex w-full items-center justify-center py-4"
                    aria-controls="content"
                    aria-selected="true"
                  >
                    <div className="">{`${t('Item Pending')}`}</div>
                  </Tippy>
                </Tab.Button>
              )}
            </Tab>
          </Tab.List>
         
          <Tab.Panels>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_business_name}, {contact_name}, {order_ref_number}, {total_amount}, {received_amount}, {due_amount}, {location_name}, {location_address}, {location_email}, {location_phone}, {location_custom_field_1}, {location_custom_field_2}, {location_custom_field_3}, {location_custom_field_4}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('New Order, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <Alert variant="soft-pending" className="flex mt-7 items-center mb-2">
    <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" />{" "}

   {'Business logo will not work in SMS '}

</Alert>
              </div>
              
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_business_name}, {contact_name}, {order_ref_number}, {payment_ref_number}, {paid_amount}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Payment Paid, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <Alert variant="soft-pending" className="flex mt-7 items-center mb-2">
    <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" />{" "}

   {'Business logo will not work in SMS '}

</Alert>
              </div>
              
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_business_name}, {contact_name}, {order_ref_number}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Items received, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <Alert variant="soft-pending" className="flex mt-7 items-center mb-2">
    <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" />{" "}

   {'Business logo will not work in SMS '}

</Alert>
              </div>
              
            </Tab.Panel>
            <Tab.Panel className="grid gap-7 p-5 md:grid-cols-1">
              <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{business_name}, {business_logo}, {contact_business_name}, {contact_name}, {order_ref_number}'
                  )}`}
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Items Pending, from {business_name}')}`}
                    register={register}
                    name="subject"
                    id="subject"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.cc.placeolder'
                    )}`}
                    register={register}
                    name="cc"
                    id="cc"
                  />
                </div>
                <div className="my-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.label'
                    )}`}
                    placeholder={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.bcc.placeolder'
                    )}`}
                    register={register}
                    name="bcc"
                    id="bcc"
                  />
                </div>
                <div className="">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.emailBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="mt-7">
                  <ClassicEditorElement
                    id="emailBody"
                    name="emailBody"
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.smsBody.label'
                    )}`}
                    register={register}
                    value={editorDataExpensesNote}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <Alert variant="soft-pending" className="flex mt-7 items-center mb-2">
    <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" />{" "}

   {'Business logo will not work in SMS '}

</Alert>
              </div>
              
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className=" flex justify-end">


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
  )
}

export default Main
