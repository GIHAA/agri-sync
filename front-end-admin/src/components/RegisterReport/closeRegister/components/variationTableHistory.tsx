/* eslint-disable prettier/prettier */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import _ from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Table from '../../../common/table'
import SharedDataContainer from '../../../../containers/sharedData'

function VariationTableHistory() {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { t } = useTranslation('pos')
  const [] = useState<boolean>(false)
  const {} = SharedDataContainer.useContainer()
  const [] = useState('')

  return (
    <div className="intro-y scrollbar-hidden mb-3 mt-8 overflow-auto overflow-y-scroll sm:mt-0">
      <Table bordered>
        <Table.Thead variant="default">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Reference No
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Paid On
            </Table.Th>
            <Table.Th className=" text-center whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Amount
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Customer
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Payment Method
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
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
  )
}

export default VariationTableHistory
