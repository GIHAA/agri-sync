/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { InputElement, SearchSelectElement, SelectElement, TextareaElement, } from '../../common/form-elements'
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

function AddCampaign() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()

  const [selectedOption, setSelectedOption] = useState(null)
  const [type] = useState([
    { id: 0, name: ' Please Select' },
    { id: 2, name: 'SMS' },
    { id: 3, name: 'Email' },
  ])
  const handleSelectChange = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  }

  const handleChange = () => { }

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')
  const [date, setDate] = useState('')

  const schema = yup
    .object({
      campaignName: yup
        .string()
        .required(
          `${t(
            'lead.fields.campaignName.validationMessage'
          )}`
        ),
        campaignType: yup
        .string()
        .required(
          `${t(
            'lead.fields.campaignType.validationMessage'
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

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
  const deleteButtonRef = useRef(null)
  const [selectMultipleOne, setSelectMultipleOne] = useState<string>('0');
  const [selectOne, setSelectOne] = useState<string[]>([])
  const [selectOneCustomer, setSelectOneCustomer] = useState<string[]>([])
  const [showSecondTomSelect, setShowSecondTomSelect] = useState(false);
  const [showThirdTomSelect, setShowThirdTomSelect] = useState(false);
  const [showFourthTomSelect, setShowFourthTomSelect] = useState(false);
  const [showLastTomSelect, setShowLastTomSelect] = useState(false);
  const [selectAllCustomerChecked, setSelectAllCustomerChecked] = useState(false);
  const [selectAllLeadsChecked, setSelectAllLeadsChecked] = useState(false);
  const [deselectAllCustomerChecked, setDeselectAllCustomerChecked] = useState(false);
  const [deselectAllLeadsChecked, setDeselectAllLeadsChecked] = useState(false);
  const [selectAllContactChecked, setSelectAllContactChecked] = useState(false);
  const [deselectAllContactChecked, setDeselectAllContactChecked] = useState(false);
  const [selectOneContact, setSelectOneContact] = useState<string[]>([])

  const handleSelectMultipleOneChange = (newValue: string) => {
    setSelectMultipleOne(newValue);

    const isLeadsSelected = ['2'].includes(newValue);
    setShowSecondTomSelect(isLeadsSelected);
  
    if (!isLeadsSelected) {
      setSelectAllLeadsChecked(false);
      setDeselectAllLeadsChecked(false);
    }

    const isCustomerSelected = newValue.includes('1')
    setShowThirdTomSelect( isCustomerSelected);
  
    if ( !isCustomerSelected) {
      setSelectAllCustomerChecked(false);
      setDeselectAllCustomerChecked(false);
    }

    const isContactSelected = newValue.includes('4')
    setShowFourthTomSelect( isContactSelected);
  
    if ( !isContactSelected) {
      setSelectAllContactChecked(false);
      setDeselectAllContactChecked(false);
    }

    const isTransactionActivitySelected = newValue.includes('3')
    setShowLastTomSelect( isTransactionActivitySelected);
  
  }



  const handleSelectLeadsAll = () => {
    setSelectAllLeadsChecked(true);
    setDeselectAllLeadsChecked(false);
    setSelectOne(['1','2','3','4']);
  }
  
  const handleDeselectLeadsAll = () => {
    setSelectAllLeadsChecked(false);
    setDeselectAllLeadsChecked(true);
    setSelectOne([]);
  }

  const handleCheckLeadsAll = (selectAll: boolean) => {
    if (selectAll) {
      handleSelectLeadsAll();
    } else {
      handleDeselectLeadsAll();
    }
  } 




  const handleSelectCustomerAll = () => {
    setSelectAllCustomerChecked(true);
    setDeselectAllCustomerChecked(false);
    setSelectOneCustomer(['5','6','7','8']);
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
 
  

  const handleSelectContactAll = () => {
    setSelectAllContactChecked(true);
    setDeselectAllContactChecked(false);
    setSelectOneContact(['9', '10', '11', '12']);
  }
  
  const handleDeselectContactAll = () => {
    setSelectAllContactChecked(false);
    setDeselectAllContactChecked(true);
    setSelectOneContact([]);
  }
  
  const handleCheckContactAll = (selectAll: boolean) => {
    if (selectAll) {
      handleSelectContactAll();
    } else {
      handleDeselectContactAll();
    }
  }


  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const [isBox2Visible, setIsBox2Visible] = useState(false);
  const [isBox3Visible, setIsBox3Visible] = useState(false);
  const [editorDataExpensesNote, setEditorDataExpensesNote] = useState(
    `<p>${t(
      'Dear {contact_name}, Thank you for shopping with us. {business_name}'
    )}.</p>`
  )


  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="mb-5 grid grid-cols-1 gap-5 px-5 pt-5 sm:grid-cols-2"> 
      <InputElement
                label={`${t('lead.fields.campaignName.label')}`}
                register={register}
                name="title"
                error={errors.campaignName}
                required
                id="campaignName" 
                />
                <SelectElement
        label={`${t('lead.fields.campaignType.label')}`}
        register={register}
        options={type}
        name="title"
        error={errors.campaignType}
        required
        id="campaignType"

      />

                </div>
      


      </div>
      <div className="intro-y box mb-5 px-5 py-5">
      <div className="mb-5 grid grid-cols-1 gap-5 px-5 pt-5 sm:grid-cols-2">          
      <div className="relative  font-medium sm:mt-0">
      
      <div  className="mb-4 "> <div className="mt-0.5 ">{`${t('To')}`}</div></div> 
       <TomSelect
  value={selectMultipleOne}
  required
  onChange={handleSelectMultipleOneChange}
  options={{
    placeholder: 'Please Select',
  }}
>
  
    <option value="1">Customers</option>
    <option value="2">Leads</option>
    <option value="3">Transaction Activity</option>
    <option value="4">Contact</option>

</TomSelect>
      </div>

      {showSecondTomSelect && (
        <div className="relative font-medium sm:mt-0">
              <div className=" flex "> <div className=" flex mr-2 mt-2">{`${t('Leads')}`}</div>
                <Button variant="primary" rounded size="sm" className=" flex ml-2  mr-2 mb-2" 
                onClick={() => handleCheckLeadsAll(true)}>Select All</Button>
                <Button variant="secondary" size="sm" rounded className=" flex mb-2" 
                onClick={() => handleCheckLeadsAll(false)}>Deselect All</Button>
              </div>
              <TomSelect
                value={selectOne}
                onChange={setSelectOne}
                options={{
                  placeholder: 'Please Select ',
                }}
                className="sm:w-auto"
                multiple
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
              multiple
            >
              <option value="5">Walking Customer</option>
              <option value="6">Mr.Shani</option>
              <option value="7">Mr.Timi</option>
              <option value="8">Mr.shara</option>
            </TomSelect>
          </div>
      )}
       {showFourthTomSelect && (
            <div className="relative font-medium sm:mt-0">
            <div className=" flex "> <div className=" flex mr-2 mt-2">{`${t('Contact')}`}</div>
            <Button
        variant="primary"
        rounded
        size="sm"
        className="flex ml-2 mr-2 mb-2"
        onClick={() => handleCheckContactAll(true)}
      >
        Select All
      </Button>
      <Button
        variant="secondary"
        size="sm"
        rounded
        className="flex mb-2"
        onClick={() => handleCheckContactAll(false)}
      >
        Deselect All
      </Button>
            </div>
            <TomSelect
      value={selectOneContact}
      onChange={setSelectOneContact}
      options={{
        placeholder: 'Please Select',
      }}
      className="sm:w-auto"
      multiple
    >
      <option value="9">Customer</option>
      <option value="10">Shani</option>
      <option value="11">Timi</option>
      <option value="12">shara</option>
    </TomSelect>
          </div>
      )}
      {showLastTomSelect && (
            <div className="relative font-medium sm:mt-0">
              
            <div className=" flex mr-2 mt-2.5">{`${t('Transaction Activity')}`}</div>
            <FormSelect className="mt-2">
            <option>Has Transaction</option>
            <option>Has No Transaction</option>
                     
                    </FormSelect>

                    <div className=" flex mr-2  mt-7">{`${t('In Days')}`}</div>
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

      </div>
        <div className="intro-y box mb-5 px-5 py-5">
          
          <div className=" p-5 ">
               
                <div className="mb-7">
                  <InputElement
                    label={`${t(
                      'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.subject.label'
                    )}`}
                    placeholder={`${t('Email Subject')}`}
                    register={register}
                    name="subject"
                    id="subject"
                    error={errors.campaignName}
                    required
                  />
                </div>
                
                <div className="mb-7">
                  <ClassicEditorElement
                   error={errors.campaignName}
                   required
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
              </div>
        </div>
        <div className="intro-y box mb-5 px-5 py-5">
          
          <div className=" p-5 ">
               
                <div className="mb-7">
                 
                </div>
                
                <div className="mb-7">
                  <TextareaElement
                  
                    id="smsBody"
                    name="smsBody"
                    label={`${t(
                      'lead.fields.smsBody.label'
                    )}`}
                    register={register}
                    // onChange={setEditorDataExpensesNote}
                  />
                </div>
                <div className="felx mr-2 mt-2 font-medium">
                  {`${t(
                    'contactManagement.fields.suppliers.fields.viewSuppliers.fields.purchase.fields.sendNotifications.fields.availabletags.label'
                  )}`}
                  :{' '}
                </div>{' '}
                <div className=" mt-2 ">
                  {' '}
                  {`${t(
                    '{contact_name}, {campaign_name}, {business_name}'
                  )}`}
                </div>
              </div>
        </div>
          <div className=" mt-5 flex justify-end">
            <Button type="submit" variant="pending" className="mb-2 mr-1 w-auto">
              {`${t('Send Notification')}`}
              {isLoading ? (
                <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
              ) : (
                ''
              )}
            </Button>
            <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
              {`${t('Draft')}`}
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

export default AddCampaign
function setSelectAllChecked(arg0: boolean) {
  throw new Error('Function not implemented.')
}

