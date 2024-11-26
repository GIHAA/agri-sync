/* eslint-disable react/no-unused-prop-types */
import clsx from 'clsx'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import Button from '../../common/button'
import {
  FormInfo,
  FormInline,
  FormLabel,
  FormRequiredIcon,
  FormRequiredLabel,
} from '../../common/form-elements/components'
import Lucide from '../../common/lucide'
import VariationTable from './components/variationtable'

interface InputProps {
  id?: string
  label?: string
  name?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  rounded?: boolean
  required?: boolean
  info?: string
}

function VariationTableElement({ id, label, required, info }: InputProps) {
  return (
    <FormInline className="mt-3 flex-col items-start pt-1 first:mt-0 first:pt-0 xl:flex-row">
      <div className="col-span-2 grid">
        {label ? <FormLabel htmlFor={id} /> : ''}
      </div>
      <div className="mt-0 w-full flex-1 xl:mt-0">
        <VariationTable />
      </div>
    </FormInline>
  )
}

export default VariationTableElement

VariationTableElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  disabled: false,
  rounded: false,
  required: false,
  info: '',
}
