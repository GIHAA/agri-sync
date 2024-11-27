import Agrisyncpy from '../../../agrisyncpy'
import Lucide from '../../../lucide'
import Button from '../../../button'
import { Icons } from '../../../../../constants'

function FormInfo({ toolagrisync }: { toolagrisync: string }) {
  return (
    <Agrisyncpy as={Button} className="border-0 p-0" content={toolagrisync}>
      <Lucide
        icon={Icons.INFO}
        width={18}
        height={18}
        // stroke="stroke-2.75"
        className=" font-bold text-dark dark:text-darkmode-100"
      />
    </Agrisyncpy>
  )
}

export default FormInfo
