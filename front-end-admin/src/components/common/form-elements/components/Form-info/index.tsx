import Tippy from '../../../tippy'
import Lucide from '../../../lucide'
import Button from '../../../button'
import { Icons } from '../../../../../constants'

function FormInfo({ tooltip }: { tooltip: string }) {
  return (
    <Tippy as={Button} className="border-0 p-0" content={tooltip}>
      <Lucide
        icon={Icons.INFO}
        width={18}
        height={18}
        // stroke="stroke-2.75"
        className=" font-bold text-dark dark:text-darkmode-100"
      />
    </Tippy>
  )
}

export default FormInfo
