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
import Table from '../../../../components/common/table'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Button from '../../../../components/common/button'
import SharedDataContainer from '../../../../containers/sharedData'
import Lucide from '../../../../components/common/lucide'


function VariationTable() {
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const { t } = useTranslation('pos')

  return (
    <div className="intro-y scrollbar-hidden mb-3 overflow-auto overflow-y-scroll ">
      <Table bordered className="">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Action
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
             Heading
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Added By
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Creadted At
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 !px-2 text-slate-500 dark:bg-darkmode-800">
              Update At
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td> <div className="items-left flex border-t border-slate-200/60 dark:border-darkmode-400 lg:justify-start">
                <Button variant="primary" size="sm" className="mb-2  mr-2 w-16">
                  <a className="mr-2 flex items-center" href="#">
                    <Lucide icon="Edit" className="h-4 w-4 mr-1" /> Edit
                  </a>
                </Button>
                <Button variant="linkedin" size="sm" className="mb-2 mr-2 w-16">
                <a className="mr-2 flex items-center" href="#">
                  <Lucide icon="Eye" className="h-4 w-4 mr-1" /> View
                </a>
                </Button>
                <Button variant="danger" size="sm" className="mb-2 w-18">
                <a className="flex items-center ">
                  <Lucide icon="Trash2" className="h-4 w-4 mr-1" /> Delete
                </a>
                </Button>
                
              </div></Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
            <Table.Td className="!px-4">J.K.L Nandasena</Table.Td>
            <Table.Td className="!px-2">nanda@gmail.com</Table.Td>
            <Table.Td className="!px-4">2023.04.05 14:12P.M</Table.Td>
          </Table.Tr>
         
         
        </Table.Tbody>
      </Table>
    </div>
  )
}

export default VariationTable
