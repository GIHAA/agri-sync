/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
import _ from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Table from '../../../common/table'
import SharedDataContainer from '../../../../containers/sharedData'

function VariationTable() {
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
      <Table className="border">
        <Table.Thead variant="default">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50  !px-2 text-slate-500 dark:bg-darkmode-800" />
            <Table.Th className="whitespace-nowrap bg-slate-50 text-right !px-2 text-slate-500 dark:bg-darkmode-800">
              Sales
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-right text-slate-500 dark:bg-darkmode-800">
              Credit received
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-right text-slate-500 dark:bg-darkmode-800">
              Sales return
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-right text-slate-500 dark:bg-darkmode-800">
              Expences
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="!px-4">
              {/* <div className="mt-2 mr-2 font-medium">
            {`${t('nonreceiptForm.fields.tableTopics.fields.topicOneName.label')}`}:{' '}
          </div> */}
              Cash payment
            </Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 420,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 72,900.00</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">Cheque payment</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 620,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 110,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 420,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 72,900.00</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">KoKo</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 70,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 80,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 420,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 72,900.00</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">Bank Transfer</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 90,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 60,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 420,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 72,900.00</Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td className="!px-4">Mint</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 98,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 20,900,000.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 420,900.00</Table.Td>
            <Table.Td className="!px-2 text-right">Rs : 22,172,900.00</Table.Td>
          </Table.Tr>
        </Table.Tbody>
        <Table.Thead variant="default">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-4 text-slate-500 dark:bg-darkmode-800">
              Total
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-right !px-2  text-slate-500 dark:bg-darkmode-800">
              Rs : 989,900,000.00
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-right !px-2 text-slate-500 dark:bg-darkmode-800">
              Rs : 588,900,000.00
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-right !px-2 text-slate-500 dark:bg-darkmode-800">
              Rs : 1,900,000.00
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-right !px-2 text-slate-500 dark:bg-darkmode-800">
              Rs : 3,900,000.00
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
      </Table>

      <br />
      <br />

      <div className="overflow-x-auto">
        <Table bordered hover>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td className="!px-4 ">Cash In Hand</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 120,900,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">Cash Sell Payment</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 50,900,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">Credit Sell Payment</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 900,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">
                <div className="font-medium">
                  {`${t(
                    'registerForm.fields.tableTopics.fields.cashInflow.label'
                  )}`}
                  :{' '}
                </div>
              </Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 40,400,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr> 
              <Table.Td className="!px-4 ">Cash Refund</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 40,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4 ">Sales Return</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 90,800,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">Expences(Cash)</Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 220,000,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">
                <div className="font-medium">
                  {`${t(
                    'registerForm.fields.tableTopics.fields.netCashAmount.label'
                  )}`}
                  :{' '}
                </div>
              </Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 300,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">
                <div className="font-medium">
                  {`${t(
                    'registerForm.fields.tableTopics.fields.totalSales.label'
                  )}`}
                  :{' '}
                </div>
              </Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 520,800,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">
                <div className="font-medium">
                  {`${t(
                    'registerForm.fields.tableTopics.fields.paymentDue.label'
                  )}`}
                  :{' '}
                </div>
              </Table.Td>
              <Table.Td className="!px-2 text-right">Rs : 600,000.00</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="!px-4">
                <div className="font-medium">
                  {`${t(
                    'registerForm.fields.tableTopics.fields.paymentReceived.label'
                  )}`}
                  :{' '}
                </div>
              </Table.Td>
              <Table.Td className="!px-2 text-right" >Rs : 700,000.00</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}

export default VariationTable
