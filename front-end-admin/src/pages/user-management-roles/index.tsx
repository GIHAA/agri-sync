/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import _ from 'lodash'
import Table from '../../components/common/table'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import fakerData from '../../utils/faker'
import Button from '../../components/common/button'
// import VariationTableElement from './variationTable-elements'
import Lucide from '../../components/common/lucide'
import { Menu, Tab,Dialog } from '../../components/common/headless'
import Pagination from '../../components/common/pagination'
// import DarkModeSwitch from '../../components/common/dark-mode-switch'
import {
  FormInput,
  FormSelect,
} from '../../components/common/form-elements/components'
import SharedDataContainer from '../../containers/sharedData'
import SlideoverRegistry from './slideover-registry'
import ShortcutKey from '../../components/common/shortcut-key'
import SlideoverPanel from '../../components/slideover-panel'

interface FormContent {
  title: string
  component: JSX.Element
}

interface Props {
  setSliderContent: React.Dispatch<React.SetStateAction<any>>
}

function Roles() {
  const { handleSlider } = SharedDataContainer.useContainer()
  // eslint-disable-next-line prettier/prettier
  const handleChange = () => {}


  const [sliderSize, setSliderSize] = useState('xl')

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
  
  const handleKeyUp = (keyName: string) => {
    if (keyName === 'alt+s') {
      handleClick(SlideoverRegistry.adduserManagementRoles)
    }
  }
  const { register } = useForm()
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  return (
    <div className="">
      <div className="intro-y mt-4 flex flex-col items-center sm:flex-row">
      {/* <div className="flex items-center space-x-2">
          {' '}
          <DarkModeSwitch />
        </div> */}
            <h2 className="mr-auto text-lg font-medium ml-2">All Roles <Button
                  variant="twitter"
                  className="intro-y mx-1 h-7 w-7 rounded-full"
                >
                ? 
                </Button></h2> 
            <div className="mt-4 flex w-full sm:mt-0 sm:w-auto">
                
            <Button variant="primary" className="sm:w-auto mr-2 shadow-md"
             onChange={handleChange}
             onClick={() => handleClick(SlideoverRegistry.adduserManagementRoles)}>
            Add New Role
          </Button>
      
          <Button variant="primary" className=" px-2 mr-2 "  onChange={handleChange}
             onClick={() => handleClick(SlideoverRegistry.adduserManagementRoles)}>
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
              </Button>
              
            </div>
          </div>
        
        <div className="intro-y box mb-5 mt-5 px-5 py-5 ">
        <div className="mt- intro-y flex flex-col items-center sm:flex-row ">
            <div className="items-center sm:mr-4 sm:flex ">
            Page Size
              <FormSelect className=" m-2 w-15  dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </FormSelect>
            </div>

            <div className="mx-auto items-center  md:flex">
           
            </div>

            <div className="relative ml-2 mr-2 flex sm:mt-0 sm:w-auto">
              <FormInput
                type="text"
                className="box custom-input w-64"
                placeholder="Search by Roles"
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8"
              />
            </div>
          </div>
          {/* <VariationTableElement register={register} /> */}
          <div className="intro-y  py-5" style={{ overflowY: 'auto' }}>
      <Table bordered className="">
        <Table.Thead variant="dark">
          <Table.Tr>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-slate-500 dark:bg-darkmode-800">
              Roles
            </Table.Th>
            <Table.Th className="whitespace-nowrap bg-slate-50 text-center  text-slate-500 dark:bg-darkmode-800">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
          <Table.Td >Admin</Table.Td>
          <Table.Td >
              <div className="justify-center flex ">
              <Button variant="primary" className="mb-2 mr-1"  size="sm"    onChange={handleChange}
             onClick={() => handleClick(SlideoverRegistry.edituserManagementRoles)}>
                  <a className=" flex items-center" href="#">
                    <Lucide icon="Edit" className="h-4 w-4 " />
                  </a>
                </Button>
                
                <Button variant="danger" size="sm" className="mb-2 w-18 flex items-center"
                onChange={handleChange}
                        onClick={(event: { preventDefault: () => void }) => {
                          event.preventDefault();
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-4 h-4 " /> 
                    
                </Button>
                
              </div>
            </Table.Td>
          </Table.Tr>
         

         
        </Table.Tbody>
      </Table>
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
        
      <ShortcutKey onKeyUp={handleKeyUp} />
      <SlideoverPanel
        close
        size={sliderSize}
        heading={sliderContent.header}
        footer={sliderContent.footer}
      >
        {sliderContent.children}
      </SlideoverPanel>
    </div>
    
  )
}

export default Roles
