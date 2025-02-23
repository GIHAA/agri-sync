/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/order */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/no-duplicates */
/* eslint-disable prettier/prettier */
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { UseQueryResult } from "react-query";

interface TipItem {
  id: string;
  KeyCloakID: string;
  ProfilePictureURL?: string;
  username?: string;
  email?: string;
  phone?: string;
  Whatsapp?: string;
  role?: string;
  farmerDetails: {
    age?: number;
    vision_problems?: boolean;
    color_blindness?: boolean;
    lat?: number;
    long?: number;
  };
  accessibilitySettings?: {
    text_size?: string;
    layout?: string;
    color_friendly_scheme?: string;
    use_symbols_with_colors?: boolean;
  };
}
import { Tab } from "@headlessui/react";
import { PosApi } from "../../../../api";
import {
  useGetUserById,
  useActivateUser,
  useDeactivateUser,
} from "../../../../api/admin-user-management";
import Button from "../../../../components/common/button";
import PreviewImage from "../../../../assets/images/profile.svg";
import SharedDataContainer from "../../../../containers/sharedData";
import Separator from "../../../../components/common/separator/separator";

interface ViewUserProps {
  userId: string;
}
function ViewUserSection(props: ViewUserProps) {
  const posApi = PosApi.useAPI();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [useridparam, setuseridparame] = useState("");
  const [userStatus, setuserStatus] = useState("");
  const {
    data,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
  }: UseQueryResult<TipItem> = useGetUserById(props.userId);
  // const {
  //   data: userData,
  //   isLoading: isFetchingUserData,
  //   isError: isFetchingUserError,
  // } = useDeactiveUserAndActive(useridparam, userStatus)

  console.log("user data", data);

  const { t } = useTranslation("pos");

  const schema = yup
    .object({
      prefix: yup.string().when("_", {
        is: () => "tooltip",
        then: yup
          .string()
          .required(`${t("customerForm.fields.prefix.tooltip")}`),
        otherwise: yup.string().notRequired(),
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { mutate: ActivateUser } = useActivateUser();
  const { mutate: DeactivateUser } = useDeactivateUser();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  const handleDeactivate = () => {
    if (data?.id) DeactivateUser(data?.KeyCloakID.toString());
  };

  const handleActivate = () => {
    if (data?.id) ActivateUser(data?.KeyCloakID.toString());
  };

  const { handleSlider } = SharedDataContainer.useContainer();

  return (
    <form className="validate-form" onSubmit={handleSubmit(onSubmit)}>
      <Tab.Group>
        <div className="intro-y  rounded-t-lg bg-white p-[12px] px-5 ">
          <div className="-mx-5 mb-[2px] flex flex-col  content-center md:flex-row">
            <div className="b flex flex-1 content-center items-center justify-center px-5 lg:justify-start">
              <div className="ml-2 mt-4 flex-none content-center sm:mt-0 sm:h-24 sm:w-24 ">
                <img
                  alt="profile page"
                  className=" h-[85px] w-[85px] rounded-full"
                  src={
                    data?.ProfilePictureURL
                      ? data.ProfilePictureURL
                      : PreviewImage
                  }
                />
              </div>
              <div>
                <div className="ml-1  w-24 truncate text-lg font-medium sm:ml-0 sm:w-60 sm:whitespace-normal">
                  {data?.username ? data?.username : "name"}{" "}
                </div>
              </div>
            </div>

            {/* <div className="mx-0  mt-6 content-center sm:mx-0  md:mx-2 lg:mt-1 lg:border-t-0">
              <div className="flex content-center  items-center justify-center sm:mr-[70px] lg:justify-start">
                <div className="flex items-center truncate text-slate-500">
                  {permissionChecker(
                    <>
                      {data?.Status === 'active' ? (
                        <Button
                          className=" w-40 bg-red-500 px-6 py-2"
                          onClick={handleDeactivate}
                        >
                          <span className="text-white sm:block">
                            Deactivate
                          </span>
                        </Button>
                      ) : (
                        <Button
                          className="w-40 bg-green-500 px-6 py-2"
                          onClick={handleActivate}
                        >
                          <span className="text-white sm:block">Activate</span>
                        </Button>
                      )}
                    </>,
                    'user_management.deactivate'
                  )}
                </div>
              </div>
            </div> */}
            {/* <div className="mt-6     px-5 lg:mt-0 lg:border-t-0 bg-">
              <div className="flex items-center  justify-end px-5 lg:justify-start">
                <div className="ml-8 pt-5 ">
                  <div className="mt-2 flex items-center truncate  ">
                    {permissionChecker(
                      <>
                        {data?.Status === 'active' ? (
                          <Button
                            className=" w-40 bg-red-500 px-6 py-2"
                            onClick={handleDeactivate}
                          >
                            <span className="text-white sm:block">
                              Deactivate
                            </span>
                          </Button>
                        ) : (
                          <Button
                            className="w-40 bg-green-500 px-6 py-2"
                            onClick={handleActivate}
                          >
                            <span className="text-white sm:block">
                              Activate
                            </span>
                          </Button>
                        )}
                      </>,
                      'user_management.deactivate'
                    )}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <Separator />
        <div className="rounded-b-lg bg-white py-[12px]">
          <Tab.Panel>
            <div className="flex flex-col gap-[20px]  px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3">
              {/* <FormInline className="flex-col items-start xl:flex-row">
                <div className="xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Email</div>
                    </div>
                    <div
                      className="text-small mt-3 leading-relaxed text-slate-500"
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Email ? data.Email : 'No'}
                    </div>
                  </div>
                </div>
                <div className="xl:!mr-3 xl:w-64">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Phone</div>
                    </div>
                    <div
                      className="text-small mt-3 leading-relaxed text-slate-500"
                      style={{ maxWidth: '250px', wordWrap: 'break-word' }}
                    >
                      {data?.Phone ? data?.Phone : 'No'}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center">
                    <div className="">Whatsapp</div>
                  </div>
                  <div
                    className="text-small mt-3 leading-relaxed text-slate-500"
                    style={{ maxWidth: '300px', wordWrap: 'break-word' }}
                  >
                    {data?.Whatsapp ? data.Whatsapp : 'No'}
                  </div>
                </div>
              </FormInline> */}

              <div className="flex w-full flex-col gap-[10px]    dark:border-darkmode-400 ">
                <span className="w-full rounded-sm bg-gray-200 px-[15px] py-[10px]">
                  Personal Information
                </span>
                <div className="grid grid-cols-3 gap-y-[10px] px-[15px]">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Email</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.email ? "text-[#000000]" : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "300px", wordWrap: "break-word" }}
                    >
                      {data?.email ? data.email : "Not Provided Yet"}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Phone</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.phone ? "text-[#000000]" : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.phone ? data?.phone : "Not Provided Yet"}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Whatsapp</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.Whatsapp ? "text-[#000000]" : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.Whatsapp ? data?.Whatsapp : "Not Provided Yet"}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Role</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.role ? "text-[#000000]" : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.role ? data?.role : "Not Provided Yet"}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Age</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.farmerDetails.age
                          ? "text-[#000000]"
                          : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.farmerDetails.age
                        ? data?.farmerDetails.age
                        : "Not Provided Yet"}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Location</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.farmerDetails.lat
                          ? "text-[#000000]"
                          : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.farmerDetails.lat
                        ? data?.farmerDetails.lat
                        : "Not Provided Yet"}{" "}
                      ,{" "}
                      {data?.farmerDetails.long
                        ? data?.farmerDetails.long
                        : "Not Provided Yet"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-[10px]    dark:border-darkmode-400 ">
                <span className="w-full rounded-sm bg-gray-200 px-[15px] py-[10px]">
                  User Preferences
                </span>

                <div className="grid grid-cols-3 gap-y-[10px] px-[15px]">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Text Size</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.accessibilitySettings?.text_size
                          ? "text-[#000000]"
                          : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.accessibilitySettings?.text_size}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Layout</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.accessibilitySettings?.layout
                          ? "text-[#000000]"
                          : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.accessibilitySettings?.layout}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Color Scheme</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed ${
                        data?.accessibilitySettings?.color_friendly_scheme
                          ? "text-[#000000]"
                          : " text-[#D5D5D5]"
                      }`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.accessibilitySettings?.color_friendly_scheme}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="font-bold">Use Symbols</div>
                    </div>
                    <div
                      className={`text-small  } mt-1 leading-relaxed
                        text-[#000000]`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.accessibilitySettings?.use_symbols_with_colors
                        ? "Yes"
                        : "No"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-[10px]    dark:border-darkmode-400 ">
                <span className="w-full rounded-sm bg-gray-200 px-[15px] py-[10px]">
                  Other Details
                </span>

                <div className="grid grid-cols-3 gap-y-[10px] px-[15px]">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className=" font-bold">Vission Problem</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.farmerDetails?.vision_problems ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center">
                      <div className=" font-bold">Color Blindness</div>
                    </div>
                    <div
                      className={`text-small  mt-1 leading-relaxed`}
                      style={{ maxWidth: "250px", wordWrap: "break-word" }}
                    >
                      {data?.farmerDetails?.color_blindness ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center px-5 py-5 pt-5 dark:border-darkmode-400 sm:py-3"></div>
          </Tab.Panel>
        </div>
      </Tab.Group>
      <div className=" mt-3 flex justify-end">
        <Button
          className=" min-w-[120px] bg-[#EDF2F6] px-10 py-2 "
          onClick={() => {
            handleSlider();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ViewUserSection;
