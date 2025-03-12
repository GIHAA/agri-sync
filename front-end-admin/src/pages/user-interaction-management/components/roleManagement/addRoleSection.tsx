import React, { useEffect, useState } from 'react'
import { FieldError, useForm } from 'react-hook-form'
import Button from '../../../../components/common/button'
import InputElement from '../../../../components/common/form-elements/input-element'
import {
  AlignmentTypes,
  NotificationTypes,
} from '../../../../constants/common-enums'
import Separator from '../../../../components/common/separator/separator'
import { useAddRole } from '../../../../api/admin-role-management'
import { toTitleCase } from '../../../../utils/textFormatters'
import InputElementSecondary from '../../../../components/common/form-elements/input-element-secondary'
import { Permissions } from '../../constant/permissons'
import SharedDataContainer from '../../../../containers/sharedData'
import { Icons } from '../../../../constants'
import Toast from '../../../../utils/notification'
import FormInput from '../../../../components/common/form-elements/components/form-input'
import Lucide from '../../../../base-components/lucide'

function AddRoleSection() {
  const [selectedSection, setSelectedSection] = useState('user_management')
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const permissionOptions = Object.keys(Permissions).map((key, index) => ({
    label: key,
  }))
  const [filteredOptions, setFilteredOptions] = useState(permissionOptions)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    const filtered = permissionOptions.filter((option) =>
      option.label.toLowerCase().includes(value)
    )
    setFilteredOptions(filtered)
  }

  const { mutate, isSuccess, isError } = useAddRole()

  const onSubmit = (data: any) => {
    const selectedPermissions = Object.entries(data)
      .filter(([key, value]) => key.startsWith('permission_'))
      .flatMap(([key, permissions]) =>
        Object.entries(permissions as { [key: string]: string })
          .filter(([permKey, permValue]) => permValue)
          .map(([permKey, permValue]) => permValue)
      )

    mutate({ name: data.rolename, permissions: selectedPermissions })
  }
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()

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
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg ">
      <div className="mb-8   rounded-lg rounded-t-lg bg-white p-6">
        <div className=" w-[200px]">
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
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 ">
        <div className="col-span-1 rounded-lg bg-white pb-2 ">
          <div className="px-2">
            <InputElementSecondary
              id="permissionSection"
              name="permissionSection"
              type="text"
              iconLeft={Icons.SEARCH}
              placeholder="Search"
              register={register}
              required={true}
              error={errors.permissionSection as FieldError | undefined}
              labelAlignment={AlignmentTypes.BLOCK}
              onChange={handleSearch}
              // inputStyleClassName="!mt-0"
            />
          </div>

          <div className="my-2  ">
            <Separator />
          </div>
          <div className="max-h-[350px] min-h-[350px] overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div className="px-6" key={index}>
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

        <div className="col-span-2  w-full">
          <div className="w-full  rounded-t-lg  bg-white p-[18px] text-[16px]">
            {selectedSection
              .split('_')
              .map(
                (word) =>
                  word.charAt(0).toLocaleUpperCase() +
                  word.slice(1).toLocaleLowerCase()
              )
              .join(' ')}
          </div>
          <Separator />

          <div className="col-span-2  rounded-b-lg bg-white p-6">
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
                          className="mr-2 cursor-pointer rounded border-slate-200 shadow-sm transition-all duration-100  ease-in-out checked:border-primary checked:border-opacity-10 checked:bg-primary focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:ring-offset-0 dark:border-transparent dark:bg-darkmode-800 dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                        />

                        {key
                          ? key.charAt(0).toLocaleUpperCase() +
                            key.slice(1).toLocaleLowerCase()
                          : key}
                      </label>
                    </div>
                  )
                )}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-1">
            <Button
              onClick={() => {
                handleSlider()
              }}
              type="button"
              className="  rounded-lg  bg-[#EDF2F6] px-8  py-3 "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-black  px-10  py-3 text-white"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddRoleSection
