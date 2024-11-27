/* eslint-disable import/no-useless-path-segments */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import _ from 'lodash'
import {useRef, useState } from 'react'
import { Dialog } from '../../../components/common/headless'
import Table from '../../../components/common/table'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Lucide from '../../../components/common/lucide'
import Button from '../../../components/common/button'
import {
  FormCheck,
  FormInfo,
} from '../../../components/common/form-elements/components'
import {
  InputElement, 
} from '../../../components/common/form-elements'

function VariationTableContact() {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  
  const { t } = useTranslation('pos')
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)
  const deleteButtonRef = useRef(null)
  const handleChange = () => {}
  const [buttonContactModalPreview, setContactButtonModalPreview] = useState(false)
  const [editButtonContactModalPreview, setEditContactButtonModalPreview] = useState(false)

  return (
    <div className="overflow-y-auto overflow-x-scroll ">
      <Table bordered className="">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Action
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
             Username
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Name
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Email
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            lang_v1.department
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
            lang_v1.designation
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td> <div className="items-left flex border-t border-slate-200/60 dark:border-darkmode-400 lg:justify-start">
                <Button variant="primary" size="sm" className="mb-2  mr-2 " onClick={(event: React.MouseEvent) => {
                      event.preventDefault()
                      setEditContactButtonModalPreview(true)
                    }}>
                  <a className="flex items-center" href="#">
                    <Lucide icon="Edit" className="h-4 w-4 " />
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
            <Table.Td className="!px-4">J.K.L Nandasenasdsdsdsdsdsdsd</Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
            <Table.Td className="!px-2">nanda@gmail.com</Table.Td>
            <Table.Td className="!px-4">2023.04.05 14:12P.M</Table.Td>
            <Table.Td className="!px-4">2023.04.05 14:12P.M</Table.Td>
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
              <Dialog.Panel>
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
                  size="xl"
                  open={buttonContactModalPreview}
                  onClose={() => {
                    setContactButtonModalPreview(false)
                  }}
                >
                  <Dialog.Panel className="max-h-screen overflow-y-auto">
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
                <Dialog
                  size="xl"
                  open={editButtonContactModalPreview}
                  onClose={() => {
                    setEditContactButtonModalPreview(false)
                  }}
                >
                  <Dialog.Panel className="overflow-y-auto">
                    <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">{`${t(
                        'Edit Login'
                      )}`}</h2>
                    </Dialog.Title>
                    <a
                      onClick={(event: React.MouseEvent) => {
                        event.preventDefault()
                        setEditContactButtonModalPreview(false)
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
                       
                      </Button>
                 <Button type="button" variant="outline-secondary" onClick={()=> {
                setEditContactButtonModalPreview(false);
                }}
                className="mb-2 mr-1 w-24"
                >
                Cancel
            </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog>
    </div>
  )
}

export default VariationTableContact