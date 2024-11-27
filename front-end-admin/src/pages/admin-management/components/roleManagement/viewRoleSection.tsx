import { useGetRoleById } from '../../../../api/admin-role-management'
import PermissionCard from './permissonCard'
import { Permissions } from '../../constant/permissons'

function ViewRoleSection(props: { roleId: number }) {
  const { roleId } = props; 
  const { data }  = useGetRoleById(roleId) 

  
  return (
    <form className="rounded-lg">
      <div className="mb-6 flex justify-start rounded-lg bg-white p-6">
        {`Role Name: ${data?.name || 'Unknown'}`}
      </div>
      <div className="my-8 text-[16px]">
        <span>Permission List</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.keys(Permissions).map((sectionKey, index) => (
          <PermissionCard
            key={index}
            section={sectionKey}
            availablePermissions={Permissions[sectionKey]}
            assignedPermissions={data?.permissions || []}
          />
        ))}
      </div>
    </form>
  )
}

export default ViewRoleSection

