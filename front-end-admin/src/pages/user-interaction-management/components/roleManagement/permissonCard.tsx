import Lucide from '../../../../base-components/lucide'
import Separator from '../../../../components/common/separator/separator'
import { toTitleCase } from '../../../../utils/textFormatters'

function PermissionCard(props: any) {
  const { section, availablePermissions, assignedPermissions = [] } = props

  const assignedPermissionNames = assignedPermissions
    .filter((perm: any) => perm.name.startsWith(`${section}.`))
    .map((perm: any) => perm.name)

  return (
    <div className="relative w-full rounded-lg bg-white shadow-md">
      <div className=" p-4 ">{toTitleCase(section)}</div>
      <div >
        <Separator />
      </div>

      <div className="flex flex-col p-4">
        {Object.keys(availablePermissions).map((permKey, index) => (
          <div key={index} className="mb-2 flex  justify-start">
            <div>
              {assignedPermissionNames.includes(
                availablePermissions[permKey]
              ) ? (
                <Lucide
                  icon={'CheckCircle'}
                  className={` h-4 w-4   ${'text-green-500'}`}
                />
              ) : (
                <Lucide
                  icon={'XCircle'}
                  className={`h-4 w-4   ${'text-red-500'}`}
                />
              )}
            </div>
            <div className="ml-3">{toTitleCase(permKey)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PermissionCard
