/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
// import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { PosApi } from '../../../api'
import Button from '../../common/button'
import SharedDataContainer from '../../../containers/sharedData'
import { Icons, NotificationTypes } from '../../../constants'
import Toast from '../../../utils/notification'
import VariationTableElement from './variationTable-elements'
import VariationTableElementHistory from './variationTable-ElementsHistory'
import LoadingIcon from '../../common/loading-icon'
import Pagination from '../../common/pagination'
import Lucide from '../../common/lucide'
import { FormSelect, FormInput } from '../../common/form-elements/components'
import {
  Menu,
  Tab,
  Dialog,
  Disclosure,
} from '../../common/headless'
import Table from '../../common/table'
import Tippy from '../../common/tippy'


function CloseRegisterDetails() {
  const posApi = PosApi.useAPI()
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { t } = useTranslation('pos')
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const handleChange = () => {
    setShowMoreInfo(!showMoreInfo)
  }

  const schema = yup
    .object({
      shipping_details: yup.string().required(),
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
  const createCustomer = async (customer: any) => {
    setIsLoading(true)
    customer.type = 'both'
  }
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createCustomer(data)
  }
  const tabListStyle = {
    display: 'flex',
    flexWrap: 'wrap',
  }

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="intro-y box mb-5 bg-primary px-5 py-3 text-white">
        <div className="mt- intro-y flex flex-col items-center sm:flex-row">
          <div className="mr-auto  font-medium">
            <div className=" font-medium">
              {`${t('registerForm.fields.username.label')}`} :
              {' Storeamte demo '}
            </div>
          </div>
          <div className="flex w-full sm:mt-0 sm:w-auto">
            <div className=" font-medium">
              {`${t('registerForm.fields.email.label')}`} :
              {' support@storemate.lk '}
            </div>
          </div>
        </div>
      </div>

      <div className="intro-y box mb-5 px-5 py-5">
        <VariationTableElement register={register} />

        <div className="mt-9 flex justify-end">
          <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('common.button.print')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button>
          <Button type="submit" variant="primary" className="mb-2 mr-1 w-24">
            {`${t('common.button.slimPrint')}`}
            {isLoading ? (
              <LoadingIcon icon="oval" color="white" className="ml-2 h-4 w-4" />
            ) : (
              ''
            )}
          </Button>
          <Button
            variant="pending"
            className="mb-2 mr-1 w-36"
            onClick={handleSlider}
          >
            {`${t('Close Register')}`}
          </Button>
          <Button
            variant="secondary"
            className="mb-2 mr-1 w-24"
            onClick={handleSlider}
          >
            {`${t('common.button.cancel')}`}
          </Button>
        </div>
      </div>

      <div className="item-center flex justify-center">
        <Button
          variant="primary"
          className="mx-auto mb-5 w-fit px-28"
          onClick={handleChange}
        >
          <div className="mx-auto">
            {`${t('common.button.transactionHistory')}`}
            <Lucide
              className="mx-auto -mt-1 h-4 w-4"
              icon={showMoreInfo ? Icons.UPARROW : Icons.DOWNARROW}
            />
          </div>
        </Button>
      </div>
      {showMoreInfo && (
       <div className="intro-y box mb-5 mt-5 px-5 py-5 ">
           <div className="flex flex-col border-b mb-5 font-medium text-base  dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium mb-4">
                  {`${t('registerForm.fields.transactionHistory.label')}`}
                  </h2>
                  </div>
          <div className="mt- intro-y flex flex-col items-center sm:flex-row">
            
           

            <div className="mr-auto  font-medium" />
           
          </div>

          <Tab.Group className=" overflow-hidden intro-y box mt-5">
                <Tab.List className="flex-col border-transparent dark:border-transparent sm:flex-row bg-slate-200 dark:bg-darkmode-800" style={tabListStyle}>
                    <Tab fullWidth={false}>
                        {({ selected }) => (
                            <Tab.Button
                                className={clsx([
                                    "flex items-center justify-center w-full px-0 py-0 sm:w-36 text-slate-500",
                                    !selected &&
                                    "hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300",
                                    selected &&
                                    "text-primary border-transparent dark:bg-darkmode-600 dark:border-transparent dark:text-white",
                                ])}
                                as="button"
                            >
                                <Tippy
                                    content=""
                                    className="flex items-center justify-center w-full py-4"
                                    aria-controls="content"
                                    aria-selected="true"
                                >

                               Sales
                                </Tippy>
                            </Tab.Button>
                        )}
                    </Tab>
                    <Tab fullWidth={false}>
                        {({ selected }) => (
                            <Tab.Button
                                className={clsx([
                                    "flex items-center justify-center w-full px-0 py-0 sm:w-36 text-slate-500",
                                    !selected &&
                                    "hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300",
                                    selected &&
                                    "text-primary border-transparent dark:bg-darkmode-600 dark:border-transparent dark:text-white",
                                ])}
                                as="button"
                            >
                                <Tippy
                                    content=""
                                    className="flex items-center justify-center w-full py-4"
                                    aria-controls="content"
                                    aria-selected="true"
                                >

                                  Credi Received
                                </Tippy>
                            </Tab.Button>
                        )}
                    </Tab>
                    <Tab fullWidth={false}>
                        {({ selected }) => (
                            <Tab.Button
                                className={clsx([
                                    "flex items-center justify-center w-full px-0 py-0 sm:w-36 text-slate-500",
                                    !selected &&
                                    "hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300",
                                    selected &&
                                    "text-primary border-transparent dark:bg-darkmode-600 dark:border-transparent dark:text-white",
                                ])}
                                as="button"
                            >
                                <Tippy
                                    content=""
                                    className="flex items-center justify-center w-full py-4"
                                    aria-controls="content"
                                    aria-selected="true"
                                >

                            Sales Return
                                </Tippy>
                            </Tab.Button>
                        )}
                    </Tab>
                    <Tab fullWidth={false}>
                        {({ selected }) => (
                            <Tab.Button
                                className={clsx([
                                    "flex items-center justify-center w-full px-0 py-0 sm:w-36 text-slate-500",
                                    !selected &&
                                    "hover:border-transparent hover:bg-transparent hover:text-slate-600 hover:dark:bg-transparent hover:dark:text-slate-300",
                                    selected &&
                                    "text-primary border-transparent dark:bg-darkmode-600 dark:border-transparent dark:text-white",
                                ])}
                                as="button"
                            >
                                <Tippy
                                    content=""
                                    className="flex items-center justify-center w-full py-4"
                                    aria-controls="content"
                                    aria-selected="true"
                                >

                            Expenses
                                </Tippy>
                            </Tab.Button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel className="p-5">
                        <div>

                            <div className="flex flex-col items-center mt- intro-y sm:flex-row" />
                            <div className="intro-y mb-5">
                  <div className="mb-5 intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                    <div className=" items-center sm:mr-4 sm:flex ">
                      Page Size
                      <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </FormSelect>
                    </div>

                    <div className="mx-auto items-center  md:flex">
                    

                      <Menu>
                        <Menu.Button
                          as={Button}
                          variant="facebook"
                          className="flex items-center "
                        >
                          Export As{' '}
                          <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          
                          <Menu.Item>
                            <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                            As Excel
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

                    <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-72">
                      <FormInput
                        type="text"
                        className="box custom-input"
                        placeholder="Search Sales"
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
                      />
                    </div>
              

                  </div>
               <div className="intro-y scrollbar-hidden mb-3 mt-8 overflow-auto overflow-y-scroll sm:mt-0">
               <Table bordered hover>
            <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Reference No
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Paid On
            </Table.Th>
            <Table.Th className=" text-center whitespace-nowrap !px-2 ">
              Amount
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Customer
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Payment Method
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Invoice No
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right ">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Thead variant="default">
        <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th
            className="whitespace-nowrap bg-slate-50 !px-4 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Total
          </Table.Th>
          <Table.Th
            className="text-right whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Rs: 100,000,000.00
          </Table.Th>

         
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
        </Table.Thead>
      </Table>
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
                            <div className="flex flex-wrap items-center col-span-10 intro-y sm:flex-row sm:flex-nowrap" />
                        </div>


                    </Tab.Panel>
                    <Tab.Panel className="p-5">
                        <div>

                            <div className="flex flex-col items-center mt- intro-y sm:flex-row" />
                            <div className="intro-y mb-5">
                  <div className="mb-5 intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                    <div className=" items-center sm:mr-4 sm:flex ">
                      Page Size
                      <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </FormSelect>
                    </div>

                    <div className="mx-auto items-center  md:flex">
                    

                      <Menu>
                        <Menu.Button
                          as={Button}
                          variant="facebook"
                          className="flex items-center "
                        >
                          Export As{' '}
                          <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          
                          <Menu.Item>
                            <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                            As Excel
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

                    <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-72">
                      <FormInput
                        type="text"
                        className="box custom-input"
                        placeholder="Search Sales"
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
                      />
                    </div>
              

                  </div>
               <div className="intro-y scrollbar-hidden mb-3 mt-8 overflow-auto overflow-y-scroll sm:mt-0">
               <Table bordered hover>
            <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Reference No
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Paid On
            </Table.Th>
            <Table.Th className=" text-center whitespace-nowrap !px-2 ">
              Amount
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Customer
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Payment Method
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Invoice No
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right ">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Thead variant="default">
        <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th
            className="whitespace-nowrap bg-slate-50 !px-4 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Total
          </Table.Th>
          <Table.Th
            className="text-right whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Rs: 100,000,000.00
          </Table.Th>

         
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
        </Table.Thead>
      </Table>
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
                            <div className="flex flex-wrap items-center col-span-10 intro-y sm:flex-row sm:flex-nowrap" />
                        </div>


                    </Tab.Panel>
                    <Tab.Panel className="p-5">
                        <div>

                            <div className="flex flex-col items-center mt- intro-y sm:flex-row" />
                            <div className="intro-y mb-5">
                  <div className="mb-5 intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                    <div className=" items-center sm:mr-4 sm:flex ">
                      Page Size
                      <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </FormSelect>
                    </div>

                    <div className="mx-auto items-center  md:flex">
                    

                      <Menu>
                        <Menu.Button
                          as={Button}
                          variant="facebook"
                          className="flex items-center "
                        >
                          Export As{' '}
                          <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          
                          <Menu.Item>
                            <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                            As Excel
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

                    <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-72">
                      <FormInput
                        type="text"
                        className="box custom-input"
                        placeholder="Search Sales"
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
                      />
                    </div>
              

                  </div>
               <div className="intro-y scrollbar-hidden mb-3 mt-8 overflow-auto overflow-y-scroll sm:mt-0">
               <Table bordered hover>
            <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Reference No
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Paid On
            </Table.Th>
            <Table.Th className=" text-center whitespace-nowrap !px-2 ">
              Amount
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Customer
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Payment Method
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Invoice No
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right ">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Thead variant="default">
        <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th
            className="whitespace-nowrap bg-slate-50 !px-4 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Total
          </Table.Th>
          <Table.Th
            className="text-right whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Rs: 100,000,000.00
          </Table.Th>

         
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
        </Table.Thead>
      </Table>
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
                            <div className="flex flex-wrap items-center col-span-10 intro-y sm:flex-row sm:flex-nowrap" />
                        </div>


                    </Tab.Panel>
                    <Tab.Panel className="p-5">
                        <div>

                            <div className="flex flex-col items-center mt- intro-y sm:flex-row" />
                            <div className="intro-y mb-5">
                  <div className="mb-5 intro-y flex flex-col items-center sm:flex-row xl:mt-4">
                    <div className=" items-center sm:mr-4 sm:flex ">
                      Page Size
                      <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]  m-2">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </FormSelect>
                    </div>

                    <div className="mx-auto items-center  md:flex">
                    

                      <Menu>
                        <Menu.Button
                          as={Button}
                          variant="facebook"
                          className="flex items-center "
                        >
                          Export As{' '}
                          <Lucide icon="ChevronDown" className="ml-2 h-4 w-4" />
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          
                          <Menu.Item>
                            <Lucide icon="FileText" className="mr-2 h-4 w-4" />{' '}
                            As Excel
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

                    <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-72">
                      <FormInput
                        type="text"
                        className="box custom-input"
                        placeholder="Search Sales"
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
                      />
                    </div>
              

                  </div>
               <div className="intro-y scrollbar-hidden mb-3 mt-8 overflow-auto overflow-y-scroll sm:mt-0">
               <Table bordered hover>
            <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Reference No
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Paid On
            </Table.Th>
            <Table.Th className=" text-center whitespace-nowrap !px-2 ">
              Amount
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Customer
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Payment Method
            </Table.Th>
            <Table.Th className="whitespace-nowrap !px-2 ">
              Invoice No
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">#126789</Table.Td>
            <Table.Td className="!px-2">2023/06/23 06:24 PM</Table.Td>
            <Table.Td className="!px-2 text-right ">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2">Walking Customer</Table.Td>
            <Table.Td className="!px-2">Cash</Table.Td>
            <Table.Td className="!px-2">KOT345678</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Thead variant="default">
        <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th
            className="whitespace-nowrap bg-slate-50 !px-4 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Total
          </Table.Th>
          <Table.Th
            className="text-right whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800"
            style={{ fontSize: '16px' }}
          >
            Rs: 100,000,000.00
          </Table.Th>

         
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
          <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800" />
        </Table.Thead>
      </Table>
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
                            <div className="flex flex-wrap items-center col-span-10 intro-y sm:flex-row sm:flex-nowrap" />
                        </div>


                    </Tab.Panel>
                </Tab.Panels>

               
            </Tab.Group>


        </div>
      )}
    </form>
  )
}

export default CloseRegisterDetails
