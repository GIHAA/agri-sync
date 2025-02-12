/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-string-refs */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import _ from 'lodash'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Menu } from '../../components/common/headless'
import Lucide from '../../components/common/lucide'
import Button from '../../components/common/button'
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  TomSelect,
} from '../../components/common/form-elements/components'
import Tippy from '../../components/common/tippy'
import { DateElement, InputElement, SelectElement, TextareaElement } from '../../components/common/form-elements'
import PreviewImage3 from '../../assets/images/fakers/image2.jpg'
import { AlignmentTypes } from '../../constants/common-enums'

function Main() {
  const [select, setSelect] = useState('1')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { t } = useTranslation('pos')
  const [selectedTab, setSelectedTab] = useState('Instructions')
  const [Gendertype] = useState([{ id: 0, name: 'Please Select' }, { id: 1, name: ' Male' }, { id: 2, name: 'Female' }, { id: 3, name: 'Other' }])
  const [Maritaltype] = useState([{ id: 0, name: 'Please Select' }, { id: 1, name: ' Married' }, { id: 2, name: 'Unmarried' }, { id: 3, name: 'Divorced' }])
  const [date, setDate] = useState('')

  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Update Profile</h2>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* BEGIN: Profile Menu */}
        <div className="col-span-12 flex flex-col-reverse lg:col-span-4 lg:block 2xl:col-span-3">
          <div className="intro-y box mt-5">
           
            <div className=" p-3 ">
              <a className={`flex items-center rounded-md px-3 py-2 ${
                selectedTab === 'Instructions'
                  ? 'font-medium text-white rounded-md bg-primary'
                  : ''
              }`}
              onClick={() => setSelectedTab('Instructions')}
              >
                <Lucide icon="User" className="mr-2 h-4 w-4" /> Personal
                Information
              </a>

              <a className={` mt-2 flex items-center rounded-md px-3 py-2  ${
                selectedTab === 'Password'
                  ? 'font-medium text-white rounded-md bg-primary'
                  : ''
              }`}
              onClick={() => setSelectedTab('Password')}>
            
                <Lucide icon="Lock" className="mr-2 h-4 w-4" /> Change Password
              </a>
              
            </div>
            <div className="border-t border-slate-200/60 p-3 dark:border-darkmode-400">
            <a className={` flex items-center rounded-md px-3 py-2  ${
                selectedTab === 'MoreInfo'
                  ? 'font-medium text-white rounded-md bg-primary'
                  : ''
              }`}
              onClick={() => setSelectedTab('MoreInfo')}>
            
            <Lucide icon="Settings" className="mr-2 h-4 w-4" /> More Information
              </a>

              <a className={`mt-2 flex items-center rounded-md px-3 py-2  ${
                selectedTab === 'Bank'
                  ? 'font-medium text-white rounded-md bg-primary'
                  : ''
              }`}
              onClick={() => setSelectedTab('Bank')}>
            
            <Lucide icon="CreditCard" className="mr-2 h-4 w-4" /> Bank Details
              </a>
              <a className={`mt-2 flex items-center rounded-md px-3 py-2  ${
                selectedTab === 'Social'
                  ? 'font-medium text-white rounded-md bg-primary'
                  : ''
              }`}
              onClick={() => setSelectedTab('Social')}>
            
            <Lucide icon="Facebook" className="mr-2 h-4 w-4" /> Social Media
              </a>
             
            </div>
           
          </div>
        </div>
        {/* END: Profile Menu */}

        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="intro-y box lg:mt-5">
          {selectedTab === 'Instructions' && (
            <><div className="flex items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">
                  Personal Information
                </h2>
              </div><div className="p-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="mt-6 flex-1 xl:mt-0">
                      <div className="grid grid-cols-12 gap-x-5">
                        <div className="col-span-12 2xl:col-span-6">
                          <div>
                            <FormLabel className='font-medium' htmlFor="update-profile-form-4">
                              {`${t('contactManagement.fields.customers.fields.prefix.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="text"
                              placeholder={`${t('contactManagement.fields.customers.fields.prefix.placeolder')}`}
                              value="Mr."
                              onChange={() => { } } />
                          </div>
                          <div className="mt-3">
                            <FormLabel className='font-medium' htmlFor="update-profile-form-4">
                              {`${t('contactManagement.fields.customers.fields.firstName.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="text"
                              placeholder={`${t('contactManagement.fields.customers.fields.firstName.placeolder')}`}
                              value="J.K.L"
                              onChange={() => { } } />
                          </div>
                          <div className="mt-3">
                            <FormLabel className='font-medium' htmlFor="update-profile-form-4">
                              {`${t('contactManagement.fields.customers.fields.lastName.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="text"
                              placeholder={`${t('contactManagement.fields.customers.fields.lastName.placeolder')}`}
                              value="Attanayake"
                              onChange={() => { } } />
                          </div>
                          <div className="mt-3">
                            <FormLabel className='font-medium' htmlFor="update-profile-form-4">
                              {`${t('contactManagement.fields.customers.fields.email.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="text"
                              placeholder={`${t('contactManagement.fields.customers.fields.email.placeolder')}`}
                              value="attanayake@gmail.com"
                              onChange={() => { } } />
                          </div>
                        </div>
                        <div className="col-span-12 2xl:col-span-6">
                          <div className="mt-3 2xl:mt-0">
                            <FormLabel className='font-medium' htmlFor="update-profile-form-5">
                              Language
                            </FormLabel>
                            <TomSelect
                              id="update-profile-form-3"
                              value={select}
                              onChange={setSelect}
                              className="w-full"
                            >
                              <option value="1">
                                English
                              </option>
                              <option value="2">
                                Sinhala
                              </option>

                            </TomSelect>
                          </div>

                        </div>

                      </div>
                      <Button variant="primary" type="button" className="mt-5 w-20 ">
                        {`${t('common.button.update')}`}
                      </Button>
                    </div>
                    <div className="mx-auto w-52 xl:ml-6 xl:mr-0">
                      <div className="rounded-md border-2 border-dashed border-slate-200/60 p-5 shadow-sm dark:border-darkmode-400">
                        <div className="image-fit zoom-in relative mx-auto h-40 cursor-pointer">
                          <img
                            className="rounded-md"
                            alt=""
                            src={PreviewImage3} />
                          <Tippy
                            as="div"
                            content="Remove this profile photo?"
                            className="absolute right-0 top-0 -mr-2 -mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white"
                          >
                            <Lucide icon="X" className="h-4 w-4" />
                          </Tippy>
                        </div>
                        <div className="relative mx-auto mt-5 cursor-pointer">
                          <Button
                            variant="primary"
                            type="button"
                            className="w-full"
                          >
                            Change Photo
                          </Button>
                          <FormInput
                            type="file"
                            className="absolute left-0 top-0 h-full w-full opacity-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div></>
             )}
          </div>
          
         
          <div className="intro-y box lg:mt-5">
          {selectedTab === 'Password' && (
            <><div className="flex items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">
                  Change Password
                </h2>
              </div>
              <div className="p-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="mt-6 flex-1 xl:mt-0">
                    <div className="col-span-12 2xl:col-span-6">
                    <div>
                    <FormLabel className=" font-medium" htmlFor="update-profile-form-4">
                              {`${t('userManagement.fields.rolesnPermission.fields.currentPassword.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="password"
                              value="123456789012345678901234567890"
                              onChange={() => { } } />
                  </div>
                          <div className="mt-3">
                          <FormLabel className=" font-medium" htmlFor="input-state-1">
                          New Password
                      </FormLabel>
                      <FormInput id="input-state-1" className="border-success"  type="password"  />
                      <div className="grid w-full h-1 grid-cols-12 gap-4 mt-3">
                          <div className="h-full col-span-3 rounded bg-success" />
                          <div className="h-full col-span-3 rounded bg-success" />
                          <div className="h-full col-span-3 rounded bg-success" />
                          <div className="h-full col-span-3 rounded bg-slate-100 dark:bg-darkmode-800" />
                      </div>
                      <div className="mt-2 text-success">Strong password</div>
                              
                          </div>
                          <div className="mt-3">
                            <FormLabel className=" font-medium" htmlFor="update-profile-form-4">
                              {`${t('userManagement.fields.rolesnPermission.fields.confirmPassword.label')}`}
                            </FormLabel>
                            <FormInput
                              id="update-profile-form-4"
                              type="password"
                              onChange={() => { } } />
                          </div>
                        </div>
                      <Button variant="primary" type="button" className="mt-5 w-20 ">
                        {`${t('common.button.update')}`}
                      </Button>
                    </div>
                   
                  </div>
                </div></>
             )}
          </div>

          <div className="intro-y box lg:mt-5">
          {selectedTab === 'MoreInfo' && (
            <><div className="flex items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">
                  More Information
                </h2>
              </div>
              <div className="p-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="mt-6 flex-1 xl:mt-0">
                    <div className="col-span-12 2xl:col-span-6">
                    <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
          <DateElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t('customerForm.fields.otherForm.fields.dob.label')}`}
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
            name="date_of_birth"
            id="date_of_birth"
          />

          <SelectElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.gender.label'
            )}`}
            register={register}
            name="gender"
            id="gender"
            options={Gendertype}
          />
          <SelectElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.maritalStatus.label'
            )}`}
            register={register}
            name="maritalStatus"
            id="maritalStatus"
            options={Maritaltype}
          />
          <InputElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.bloodGroup.label'
            )}`}
            register={register}
            name="bloodGroup"
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.bloodGroup.placeolder'
            // )}`}
            id="bloodGroup"
          />
          <InputElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.contact.label'
            )}`}
            register={register}
            name="contact"
            type='number'
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.contact.placeolder'
            // )}`}
            id="contact"
          />
           </div><div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 ">
              <InputElement
                labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.guardianName.label'
            )}`}
            register={register}
            name="guardianName"
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.guardianName.placeolder'
            // )}`}
            id="guardianName"
          />
          
          <InputElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.iDProofName.label'
            )}`}
            register={register}
            name="iDProofName"
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.iDProofName.placeolder'
            // )}`}
            id="iDProofName"
          />
          <InputElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.iDProofNo.label'
            )}`}
            register={register}
            name="iDProofNo"
            type='number'
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.iDProofNo.placeolder'
            // )}`}
            id="iDProofNo"
          />
          </div><div className="  grid grid-cols-1 gap-4 mt-4  md:grid-cols-2 ">
          <TextareaElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.permanentAddress.label'
            )}`}
            register={register}
            name="special_remark"
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.permanentAddress.placeolder'
            // )}`}
            id="special_remark"
          />
          <TextareaElement
            labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.moreInformations.fields.currentAddress.label'
            )}`}
            register={register}
            name="special_remark"
            // placeholder={`${t(
            //   'userManagement.fields.moreInformations.fields.currentAddress.placeolder'
            // )}`}
            id="special_remark"
          />
           <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.customFields.fields.customerField1.label'
            )}`}
            register={register}
            name="customerField1"
            // placeholder={`${t(
            //   'userManagement.fields.customFields.fields.customerField1.placeolder'
            // )}`}
            id="customerField1"
          />
          <InputElement
          labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.customFields.fields.customerField2.label'
            )}`}
            register={register}
            name="customerField2"
            // placeholder={`${t(
            //   'userManagement.fields.customFields.fields.customerField2.placeolder'
            // )}`}
            id="customerField2"
          />
          <InputElement
          labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.customFields.fields.customerField3.label'
            )}`}
            register={register}
            name="customerField3"
            // placeholder={`${t(
            //   'userManagement.fields.customFields.fields.customerField3.placeolder'
            // )}`}
            id="customerField3"
          />
          <InputElement
          labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.customFields.fields.customerField4.label'
            )}`}
            register={register}
            name="customerField4"
            // placeholder={`${t(
            //   'userManagement.fields.customFields.fields.customerField4.placeolder'
            // )}`}
            id="customerField4"
          />
          </div>
                          
                          
                        </div>
                      <Button variant="primary" type="button" className="mt-5 w-20 ">
                        {`${t('common.button.update')}`}
                      </Button>
                    </div>
                   
                  </div>
                </div></>
             )}
          </div>

          <div className="intro-y box lg:mt-5">
          {selectedTab === 'Bank' && (
            <><div className="flex items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">
                 Bank Details
                </h2>
              </div>
              <div className="p-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="mt-6 flex-1 xl:mt-0">
                    <div className="col-span-12 2xl:col-span-6">
                    <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputElement
                     labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.accountHolderName.label'
            )}`}
            register={register}
            name="accountHolderName"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.accountHolderName.placeolder'
            // )}`}
            id="accountHolderName"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.accountNumber.label'
            )}`}
            register={register}
            name="accountNumber"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.accountNumber.placeolder'
            // )}`}
            id="accountNumber"
            type='number'
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.bankname.label'
            )}`}
            register={register}
            name="bankname"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.bankname.placeolder'
            // )}`}
            id="bankname"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.bankIdCode.label'
            )}`}
            register={register}
            name="bankIdCode"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.bankIdCode.placeolder'
            // )}`}
            id="bankIdCode"
            info={`${t(
              'userManagement.fields.bankDetails.fields.bankIdCode.tooltip'
            )}`}
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.branch.label'
            )}`}
            register={register}
            name="branch"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.branch.placeolder'
            // )}`}
            id="branch"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.bankDetails.fields.taxPayerID.label'
            )}`}
            register={register}
            name="taxPayerID"
            // placeholder={`${t(
            //   'userManagement.fields.bankDetails.fields.taxPayerID.placeolder'
            // )}`}
            id="taxPayerID"
            info={`${t(
              'userManagement.fields.bankDetails.fields.taxPayerID.tooltip'
            )}`}
          />
          </div>
                          
                          
                        </div>
                      <Button variant="primary" type="button" className="mt-5 w-20 ">
                        {`${t('common.button.update')}`}
                      </Button>
                    </div>
                   
                  </div>
                </div></>
             )}
          </div>

          <div className="intro-y box lg:mt-5">
          {selectedTab === 'Social' && (
            <><div className="flex items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400">
                <h2 className="mr-auto text-base font-medium">
                Social Media
                </h2>
              </div>
              <div className="p-5">
                  <div className="flex flex-col xl:flex-row">
                    <div className="mt-6 flex-1 xl:mt-0">
                    <div className="col-span-12 2xl:col-span-6">
                    <div className=" grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputElement
                     labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.socialMedia.fields.facebook.label'
            )}`}
            register={register}
            name="facebook"
            // placeholder={`${t(
            //   'userManagement.fields.socialMedia.fields.facebook.placeolder'
            // )}`}
            id="facebook"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.socialMedia.fields.twitter.label'
            )}`}
            register={register}
            name="twitter"
            // placeholder={`${t(
            //   'userManagement.fields.socialMedia.fields.twitter.placeolder'
            // )}`}
            id="twitter"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia1.label'
            )}`}
            register={register}
            name="socialMedia1"
            // placeholder={`${t(
            //   'userManagement.fields.socialMedia.fields.socialMedia1.placeolder'
            // )}`}
            id="socialMedia1"
          />
          <InputElement
           labelAlignment={AlignmentTypes.BLOCK}
            label={`${t(
              'userManagement.fields.socialMedia.fields.socialMedia2.label'
            )}`}
            register={register}
            name="socialMedia2"
            // placeholder={`${t(
            //   'userManagement.fields.socialMedia.fields.socialMedia2.placeolder'
            // )}`}
            id="socialMedia2"
          />
          
          </div>
                          
                          
                        </div>
                      <Button variant="primary" type="button" className="mt-5 w-20 ">
                        {`${t('common.button.update')}`}
                      </Button>
                    </div>
                   
                  </div>
                </div></>
             )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
