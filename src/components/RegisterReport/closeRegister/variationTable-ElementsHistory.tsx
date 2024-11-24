/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unused-prop-types */
import { FieldValues, UseFormRegister } from 'react-hook-form'
import {
  FormInline,
  FormLabel,
} from '../../common/form-elements/components'
import VariationTableHistory from './components/variationTableHistory'

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

function VariationTableElementsHistory({
  id,
  label,
}: InputProps) {
  return (
    <FormInline className="mt-3 flex-col items-start pt-1 first:mt-0 first:pt-0 xl:flex-row">
      <div className="col-span-2 grid">
        {label ? <FormLabel htmlFor={id} /> : ''}
      </div>
      <div className="mt-0 w-full flex-1 xl:mt-0">
        <VariationTableHistory />
      </div>
    </FormInline>
  )
}

export default VariationTableElementsHistory

VariationTableElementsHistory.defaultProps = {
  id: '',
  label: '',
  name: '',
  disabled: false,
  rounded: false,
  required: false,
  info: '',
}
