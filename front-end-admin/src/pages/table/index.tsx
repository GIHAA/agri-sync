/* eslint-disable import/no-useless-path-segments */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import Button from "../../components/common/button";
import Pagination from "../../components/common/pagination";
import { FormCheck, FormInput, FormSelect } from "../../components/common/form-elements/components";
import Lucide from "../../components/common/lucide";
import Agrisyncpy from "../../components/common/agrisyncpy";
import { Dialog, Menu } from "../../components/common/headless";
import Table from "../../base-components/Table";
import PreviewImage from '../../../src/assets/images/fakers/image2.jpg'

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const handleChange = () => {}

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Reviews</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="relative w-48 text-slate-500">
              <FormInput
                type="text"
                className="w-48 pr-10 !box"
                placeholder="Search by name..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="w-48 ml-2 xl:w-auto !box">
              <option>Status</option>
              <option>Active</option>
              <option>Removed</option>
            </FormSelect>
          </div>
          <div className="hidden mx-auto xl:block text-slate-500">
            Showing 1 to 10 of 150 entries
          </div>
          <div className="flex flex-wrap items-center w-full mt-3 xl:w-auto xl:flex-nowrap gap-y-3 xl:mt-0">
            <Button variant="primary" className="mr-2 shadow-md">
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
              Excel
            </Button>
            <Button variant="primary" className="mr-2 shadow-md">
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to PDF
            </Button>
            <Menu>
              <Menu.Button as={Button} className="px-2 !box">
                <span className="flex items-center justify-center w-5 h-5">
                  <Lucide icon="Plus" className="w-4 h-4" />
                </span>
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item>
                  <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                </Menu.Item>
                <Menu.Item>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </Menu.Item>
                <Menu.Item>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  PDF
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead variant="default">
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Image
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                 Action
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  NAME
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  RATING
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  RATING
                </Table.Th>
                
                <Table.Th className="border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className=" border-b-0 whitespace-nowrap">
                  Detail
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
             
            <Table.Tr className="intro-x">
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                
                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="w-12 h-12 image-fit zoom-in rounded-full">
                      <img
                        alt="Midone Tailwind HTML Admin Template"
                        className="rounded-full"
                        src={PreviewImage}
                      />
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  <Menu>
                      <Menu.Button
                        className="h-10 w-18 "
                        as={Button}
                        variant="primary"
                      >
                        Action <Lucide icon="ChevronDown" className="w-4 h-4 ml-1" />
                      </Menu.Button>
                      <Menu.Items className="w-52 h-48 overflow-y-auto"   >
                      <Menu.Item onChange={handleChange}
               >
                          <Lucide icon="Repeat" className="mr-2 h-4 w-4" />
                          Labels
                        </Menu.Item>
                        
                        <Menu.Item onChange={handleChange}
                >
                          <Lucide icon="Eye" className="mr-2 h-4 w-4" /> 
                          View
                        </Menu.Item >
                        <Menu.Item  onChange={handleChange}
                
                      >
                         <Lucide icon="Edit" className="mr-2 h-4 w-4" />
                          Edit
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Power" className="mr-2 h-4 w-4" />
                         Delete
                        </Menu.Item>
                        <Menu.Devider />
                        
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="FileText" className="mr-2 h-4 w-4" /> */}
                        Add or Edit Opening Stock
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="ArrowUpCircle" className="mr-2 h-4 w-4" /> */}
                      Product Stock History
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="Link" className="mr-2 h-4 w-4" /> */}
                        Add or Edit Group Prces
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="Link" className="mr-2 h-4 w-4" /> */}
                        Duplicate Prodcut
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                   a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div
                      className={clsx({
                        "flex items-center justify-center": true,
                        "text-success": 
                        "text-danger",
                      })}
                    >
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                    
                    </div>
                  </Table.Td>
               
                </Table.Tr>
                <Table.Tr className="intro-x">
                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                
                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="w-12 h-12 image-fit zoom-in rounded-full">
                      <img
                        alt="Midone Tailwind HTML Admin Template"
                        className="rounded-full"
                        src={PreviewImage}
                      />
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md  bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  <Menu>
                      <Menu.Button
                        className="h-10 w-18 "
                        as={Button}
                        variant="primary"
                      >
                        Action <Lucide icon="ChevronDown" className="w-4 h-4 ml-1" />
                      </Menu.Button>
                      <Menu.Items className="w-52 h-48 overflow-y-auto"   >
                      <Menu.Item onChange={handleChange}
               >
                          <Lucide icon="Repeat" className="mr-2 h-4 w-4" />
                          Labels
                        </Menu.Item>
                        
                        <Menu.Item onChange={handleChange}
                >
                          <Lucide icon="Eye" className="mr-2 h-4 w-4" /> 
                          View
                        </Menu.Item >
                        <Menu.Item  onChange={handleChange}
                
                      >
                         <Lucide icon="Edit" className="mr-2 h-4 w-4" />
                          Edit
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Power" className="mr-2 h-4 w-4" />
                         Delete
                        </Menu.Item>
                        <Menu.Devider />
                        
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="FileText" className="mr-2 h-4 w-4" /> */}
                        Add or Edit Opening Stock
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="ArrowUpCircle" className="mr-2 h-4 w-4" /> */}
                      Product Stock History
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="Link" className="mr-2 h-4 w-4" /> */}
                        Add or Edit Group Prces
                        </Menu.Item>
                        <Menu.Item onChange={handleChange}
                >
                          {/* <Lucide icon="Link" className="mr-2 h-4 w-4" /> */}
                        Duplicate Prodcut
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                  a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                   a
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div
                      className={clsx({
                        "flex items-center justify-center": true,
                        "text-success": 
                        "text-danger",
                      })}
                    >
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                    
                    </div>
                  </Table.Td>
               
                </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal -*/}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
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
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
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
      {/* END: Delete Confirmation Modal -*/}
    </>
  );
}

export default Main;

