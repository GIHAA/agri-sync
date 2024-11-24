/* eslint-disable prettier/prettier */
import { Icons } from '../../../../../constants'
import Lucide from '../../../lucide'

function FormRequiredIcon() {
  return (
    <Lucide
      icon={Icons.ASTERISK}
      width={15}
      height={15}
      className="text-danger"
    />
  )
}

function FormRequiredLabel() {
  return (
    <div className="text-danger">
      *
    </div>
  )
}

export { FormRequiredIcon, FormRequiredLabel }
