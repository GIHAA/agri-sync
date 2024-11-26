import React, { useState, useEffect } from 'react'
import { useForm, Controller, FieldError } from 'react-hook-form'
import Button from '../../../../components/common/button'
import InputElement from '../../../../components/common/form-elements/input-element'
import { AlignmentTypes, NotificationTypes } from '../../../../constants/common-enums'
import Separator from '../../../../components/common/separator/separator'
import { useUpdateRoles, useGetRoleById } from '../../../../api/admin-role-management'
import { toTitleCase } from '../../../../utils/textFormatters'
import InputElementSecondary from '../../../../components/common/form-elements/input-element-secondary'
import { Permissions } from '../../constant/permissons'
import { Icons } from '../../../../constants'
import Toast from '../../../../utils/notification'
import SharedDataContainer from '../../../../containers/sharedData'


function EditRoleSection({ roleId }: { roleId: number }) {
  const [selectedSection, setSelectedSection] = useState('user_management')
  const [filteredOptions, setFilteredOptions] = useState(Object.keys(Permissions).map(key => ({ label: key })))
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  
  const { data: roleData } = useGetRoleById(roleId)
  const { mutate , isSuccess , isError } = useUpdateRoles()

  useEffect(() => {
    if (roleData) {
      setValue('rolename', roleData.name)
      roleData.permissions.forEach((perm: any) => {
        setValue(`permission_${perm.name}`, true)
      })
    }
  }, [roleData, setValue])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    const filtered = Object.keys(Permissions)
      .filter((key) => key.toLowerCase().includes(value))
      .map((key) => ({ label: key }))
    setFilteredOptions(filtered)
  }

  const onSubmit = (data: any) => {
    const selectedPermissions = Object.entries(data)
      .filter(([key, value]) => key.startsWith('permission_'))
      .flatMap(([key, permissions]) =>
        Object.entries(permissions as { [key: string]: string })
          .filter(([permKey, permValue]) => permValue)
          .map(([permKey, permValue]) => permValue)
      )
    mutate({ roleId, name: data.rolename, permissions: selectedPermissions })
  }
  const { setNotification , handleSlider } = SharedDataContainer.useContainer()

  useEffect(() => {
    if (isSuccess) {
      setNotification({
        message: 'Role added successfully',
        icon: Icons.CHECKCIRCLE,
        type: NotificationTypes.SUCCESS,
      })
      Toast()
      handleSlider()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      setNotification({
        message: 'Role adding failed',
        icon: Icons.CLOSE,
        type: NotificationTypes.ERROR,
      })
      Toast()
      handleSlider()
    }
  }, [isError])
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg">
      <div className="mb-6 flex justify-start rounded-lg bg-white p-6">
        <InputElement
          id="rolename"
          label="Role Name"
          name="rolename"
          type="text"
          placeholder="Enter role name"
          register={register}
          required={true}
          error={errors.rolename}
          labelAlignment={AlignmentTypes.BLOCK}
          value={roleData?.name}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 rounded-lg bg-white pb-2">
          <div className="px-2">
            <InputElementSecondary
              id="permissionSection"
              name="permissionSection"
              type="text"
              placeholder="Search Permission Section"
              register={register}
              required={false} // Search is optional
              error={errors.permissionSection as FieldError | undefined}
              labelAlignment={AlignmentTypes.BLOCK}
              onChange={handleSearch}
              inputStyleClassName="!mt-0"
            />
          </div>

          <div className="my-2">
            <Separator />
          </div>
          <div className="max-h-[350px] min-h-[350px] overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div className="px-4" key={index}>
                <button
                  type="button"
                  onClick={() => setSelectedSection(option.label)}
                  className={`${
                    selectedSection === option.label
                      ? 'bg-primary text-white'
                      : 'bg-white text-black'
                  } my-1 w-full rounded-lg p-3 text-left`}
                >
                  {toTitleCase(option.label)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 ml-[3px] w-full">
          <div className="w-full rounded-t-lg bg-white p-[18px] text-[16px]">
            {selectedSection
              .split('_')
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ')}
          </div>
          <Separator />

          <div className="col-span-2 rounded-b-lg bg-white p-6">
            <div className="grid grid-cols-2 gap-4">
              {selectedSection &&
                Object.entries(Permissions[selectedSection]).map(
                  ([key, value]) => (
                    <div key={value}>
                      <label htmlFor={`permission_${value}`}>
                        <input
                          type="checkbox"
                          id={`permission_${value}`}
                          {...register(`permission_${value}`)}
                          value={value}
                          defaultChecked={roleData?.permissions.some(
                            (perm: any) => perm.name === value
                          )} // Set defaultChecked based on existing permissions
                          className="mr-2 cursor-pointer rounded border-slate-200 shadow-sm transition-all duration-100 ease-in-out checked:border-primary checked:bg-primary focus:ring-4 focus:ring-primary focus:ring-opacity-20"
                        />
                        {toTitleCase(key)}
                      </label>
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              onClick={() => handleSlider()}
              type="button"
              className="  rounded-lg  bg-[#EDF2F6] px-8  py-3 "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-black  px-10  py-3 text-white"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditRoleSection
