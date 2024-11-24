/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { SetStateAction, useState } from 'react'
import Button from '../common/button'
import { FormInput, FormSelect } from '../common/form-elements/components'
import Lucide from '../common/lucide'
import FilterIcon from '../../assets/images/icons/filter-icon.svg'
import PreviewImage from '../../assets/images/fakers/image2.jpg'
import Tippy from '../common/tippy'
import Table from '../common/table'
import { TableProps } from '../../types/common'
import Pagination from '../pagination/pagination-sample'

function BasicTable({
  columns,
  data,
  table_heading,
  itemsPerPage,
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const handlePageClick = (event: { selected: SetStateAction<number> }) => {
    setCurrentPage(event.selected)
  }
  return (
    <div>
      <div className="col-span-12 mt-6">
        <div className="intro-y mb-8 block h-10 items-center sm:flex">
          <h2 className="mr-5 truncate text-[19px] text-lg font-medium text-[#2D3748]">
            {table_heading}
          </h2>
        </div>
        <div className="mb-8 mt-3 flex items-center justify-between sm:ml-auto sm:mt-0">
          <div className="relative  flex sm:mt-0 sm:w-auto">
            <FormInput
              type="text"
              className="box custom-input w-40 sm:w-64"
              placeholder="Search..."
            />
            <Lucide
              icon="Search"
              className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8 text-[#B2BEB5]"
            />
          </div>
          <div>
            <Button className="!box mr-2 flex items-center gap-2.5 !font-medium text-black dark:text-slate-300">
              <img src={FilterIcon} alt="Filter Icon" />
              <span className="hidden sm:block">Filters</span>
            </Button>
          </div>
        </div>

        <div className="intro-y mt-8 overflow-auto sm:mt-0 lg:overflow-visible">
          <Table className="border-separate border-spacing-y-[10px] sm:mt-2">
            <Table.Thead variant="default">
              <Table.Tr>
                {columns.map((heading, index) => (
                  <Table.Th
                    className="whitespace-nowrap border-b-0"
                    key={index}
                  >
                    {heading.label}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row, rowIndex) => (
                <Table.Tr
                  className="intro-x h-[68px] drop-shadow-lg"
                  key={rowIndex}
                >
                  <Table.Td className="w-40 border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    <div className="flex">
                      <div className="image-fit zoom-in h-10 w-10 rounded-full">
                        <Tippy
                          as="img"
                          alt="Midone Tailwind HTML Admin Template"
                          className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={PreviewImage}
                          content={`Uploaded at 20 `}
                        />
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    <a href="" className="whitespace-nowrap font-medium">
                      {row.sku}
                    </a>
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    {row.productname}
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    {row.location}
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    {row.alertqty}
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    {row.currentstock}
                  </Table.Td>
                  <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                    {row.reorderstock}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Pagination
            data={data}
            handlePageClick={handlePageClick}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* <div className="intro-y mt-3 flex flex-wrap items-center justify-between sm:flex-row sm:flex-nowrap">
          <div className="flex items-center gap-3.5 ">
            <div className="hidden sm:mr-auto sm:block">
              Rows per page
              <FormSelect className=" w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)] m-2">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </FormSelect>
            </div>
            <span className="hidden sm:block">|</span>
            <div className="mx-auto hidden text-slate-500 md:block">
              Showing 1 - 10 of 150
            </div>
          </div>

          <Pagination className="w-full sm:w-auto">
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
        </div> */}
      </div>
    </div>
  )
}

export default BasicTable
