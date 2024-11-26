import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import React, { useState } from 'react'
import {
  PreviewComponent,
  Preview,
} from '../../components/common/preview-component'
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormHelp,
  FormCheck,
  FormSwitch,
  FormInline,
  InputGroup,
  FormTextarea,
  Litepicker,
  TomSelect,
  ClassicEditor,
} from '../../components/common/form-elements/components'
import {
  InputElement,
  TextareaElement,
  DateElement,
  SelectElement,
  ImageUploadElement,
} from '../../components/common/form-elements'

import Button from '../../components/common/button'
import LoadingIcon from '../../components/common/loading-icon'
import Tippy from '../../components/common/tippy'
import fakerData from '../../assets/images/fakers/image-placeholder-1.png'
import Lucide from '../../components/common/lucide'
import ProgressBar from '../../components/common/progress-bar'

function CommonComponent() {
  return (
    <div className="mt-5 grid grid-cols-12 gap-6">
      <div className="intro-y col-span-12 lg:col-span-6">
        <PreviewComponent className="intro-y box">
          <>
            <div className="p-5">
              <Preview>
                <div>
                  <FormLabel htmlFor="regular-form-1">Input Text</FormLabel>
                  <FormInput
                    id="regular-form-1"
                    type="text"
                    placeholder="Input text"
                  />
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="regular-form-2">Rounded</FormLabel>
                  <FormInput
                    id="regular-form-2"
                    type="text"
                    rounded
                    placeholder="Rounded"
                  />
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="regular-form-3">With Help</FormLabel>
                  <FormInput
                    id="regular-form-3"
                    type="text"
                    placeholder="With help"
                  />
                  <FormHelp>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </FormHelp>
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="regular-form-4">Password</FormLabel>
                  <FormInput
                    id="regular-form-4"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="regular-form-5">Disabled</FormLabel>
                  <FormInput
                    id="regular-form-5"
                    type="text"
                    placeholder="Disabled"
                    disabled
                  />
                </div>
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <FormInput
                  type="text"
                  formInputSize="lg"
                  placeholder=".form-control-lg"
                  aria-label=".form-control-lg example"
                />
                <FormInput
                  type="text"
                  className="mt-2"
                  placeholder="Default input"
                  aria-label="default input example"
                />
                <FormInput
                  type="text"
                  formInputSize="sm"
                  className="mt-2"
                  placeholder=".form-control-sm"
                  aria-label=".form-control-sm example"
                />
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <InputGroup>
                  <InputGroup.Text id="input-group-email">@</InputGroup.Text>
                  <FormInput
                    type="text"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="input-group-email"
                  />
                </InputGroup>
                <InputGroup className="mt-2">
                  <FormInput
                    type="text"
                    placeholder="Price"
                    aria-label="Price"
                    aria-describedby="input-group-price"
                  />
                  <InputGroup.Text id="input-group-price">.00</InputGroup.Text>
                </InputGroup>
                <InputGroup className="mt-2">
                  <InputGroup.Text>@</InputGroup.Text>
                  <FormInput
                    type="text"
                    placeholder="Price"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <div>
                  <FormLabel htmlFor="input-state-1">Input Success</FormLabel>
                  <FormInput
                    id="input-state-1"
                    type="text"
                    className="border-success"
                    placeholder="Input text"
                  />
                  <div className="mt-3 grid h-1 w-full grid-cols-12 gap-4">
                    <div className="col-span-3 h-full rounded bg-success" />
                    <div className="col-span-3 h-full rounded bg-success" />
                    <div className="col-span-3 h-full rounded bg-success" />
                    <div className="col-span-3 h-full rounded bg-slate-100 dark:bg-darkmode-800" />
                  </div>
                  <div className="mt-2 text-success">Strong password</div>
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="input-state-2">Input Warning</FormLabel>
                  <FormInput
                    id="input-state-2"
                    type="text"
                    className="border-warning"
                    placeholder="Input text"
                  />
                  <div className="mt-2 text-warning">
                    Attempting to reconnect to server...
                  </div>
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="input-state-3">Input Error</FormLabel>
                  <FormInput
                    id="input-state-3"
                    type="text"
                    className="border-danger"
                    placeholder="Input text"
                  />
                  <div className="mt-2 text-danger">This field is required</div>
                </div>
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <div className="flex flex-col items-center sm:flex-row">
                  <FormSelect
                    formSelectSize="lg"
                    className="sm:mr-2 sm:mt-2"
                    aria-label=".form-select-lg example"
                  >
                    <option>Chris Evans</option>
                    <option>Liam Neeson</option>
                    <option>Daniel Craig</option>
                  </FormSelect>
                  <FormSelect
                    className="mt-2 sm:mr-2"
                    aria-label="Default select example"
                  >
                    <option>Chris Evans</option>
                    <option>Liam Neeson</option>
                    <option>Daniel Craig</option>
                  </FormSelect>
                  <FormSelect
                    formSelectSize="sm"
                    className="mt-2"
                    aria-label=".form-select-sm example"
                  >
                    <option>Chris Evans</option>
                    <option>Liam Neeson</option>
                    <option>Daniel Craig</option>
                  </FormSelect>
                </div>
              </Preview>
            </div>
          </>
        </PreviewComponent>
      </div>
      <div className="intro-y col-span-12 lg:col-span-6">
        <PreviewComponent className="intro-y box">
          <>
            <div className="p-5">
              <Preview>
                <div>
                  <FormLabel htmlFor="vertical-form-1">Email</FormLabel>
                  <FormInput
                    id="vertical-form-1"
                    type="text"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="mt-3">
                  <FormLabel htmlFor="vertical-form-2">Password</FormLabel>
                  <FormInput
                    id="vertical-form-2"
                    type="text"
                    placeholder="secret"
                  />
                </div>
                <FormCheck className="mt-5">
                  <FormCheck.Input
                    id="vertical-form-3"
                    type="checkbox"
                    value=""
                  />
                  <FormCheck.Label htmlFor="vertical-form-3">
                    Remember me
                  </FormCheck.Label>
                </FormCheck>
                {/* <Button variant="primary" className="mt-5">
                        Login
                      </Button> */}
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <FormInline>
                  <FormLabel htmlFor="horizontal-form-1" className="sm:w-20">
                    Email
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-1"
                    type="text"
                    placeholder="example@gmail.com"
                  />
                </FormInline>
                <FormInline className="mt-5">
                  <FormLabel htmlFor="horizontal-form-2" className="sm:w-20">
                    Password
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-2"
                    type="password"
                    placeholder="secret"
                  />
                </FormInline>
                <FormCheck className="mt-5 sm:ml-20 sm:pl-5">
                  <FormCheck.Input
                    id="horizontal-form-3"
                    type="checkbox"
                    value=""
                  />
                  <FormCheck.Label htmlFor="horizontal-form-3">
                    Remember me
                  </FormCheck.Label>
                </FormCheck>
                {/* <div className="mt-5 sm:ml-20 sm:pl-5">
                      <Button variant="primary">Login</Button>
                    </div> */}
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <div className="grid grid-cols-12 gap-2">
                  <FormInput
                    type="text"
                    className="col-span-4"
                    placeholder="Input inline 1"
                    aria-label="default input inline 1"
                  />
                  <FormInput
                    type="text"
                    className="col-span-4"
                    placeholder="Input inline 2"
                    aria-label="default input inline 2"
                  />
                  <FormInput
                    type="text"
                    className="col-span-4"
                    placeholder="Input inline 3"
                    aria-label="default input inline 3"
                  />
                </div>
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <div>
                  <div>Vertical Checkbox</div>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="checkbox-switch-1"
                      type="checkbox"
                      value=""
                    />
                    <FormCheck.Label htmlFor="checkbox-switch-1">
                      Chris Evans
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="checkbox-switch-2"
                      type="checkbox"
                      value=""
                    />
                    <FormCheck.Label htmlFor="checkbox-switch-2">
                      Liam Neeson
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="checkbox-switch-3"
                      type="checkbox"
                      value=""
                    />
                    <FormCheck.Label htmlFor="checkbox-switch-3">
                      Daniel Craig
                    </FormCheck.Label>
                  </FormCheck>
                </div>
                <div className="mt-3">
                  <div>Horizontal Checkbox</div>
                  <div className="mt-2 flex flex-col sm:flex-row">
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        id="checkbox-switch-4"
                        type="checkbox"
                        value=""
                      />
                      <FormCheck.Label htmlFor="checkbox-switch-4">
                        Chris Evans
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 mt-2 sm:mt-0">
                      <FormCheck.Input
                        id="checkbox-switch-5"
                        type="checkbox"
                        value=""
                      />
                      <FormCheck.Label htmlFor="checkbox-switch-5">
                        Liam Neeson
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 mt-2 sm:mt-0">
                      <FormCheck.Input
                        id="checkbox-switch-6"
                        type="checkbox"
                        value=""
                      />
                      <FormCheck.Label htmlFor="checkbox-switch-6">
                        Daniel Craig
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>
                <div className="mt-3">
                  <div>Switch</div>
                  <div className="mt-2">
                    <FormSwitch>
                      <FormSwitch.Input
                        id="checkbox-switch-7"
                        type="checkbox"
                      />
                      <FormSwitch.Label htmlFor="checkbox-switch-7">
                        Default switch checkbox input
                      </FormSwitch.Label>
                    </FormSwitch>
                  </div>
                </div>
              </Preview>
            </div>
            <div className="p-5">
              <Preview>
                <div>
                  <div>Vertical Radio Button</div>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="radio-switch-1"
                      type="radio"
                      name="vertical_radio_button"
                      value="vertical-radio-chris-evans"
                    />
                    <FormCheck.Label htmlFor="radio-switch-1">
                      Chris Evans
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="radio-switch-2"
                      type="radio"
                      name="vertical_radio_button"
                      value="vertical-radio-liam-neeson"
                    />
                    <FormCheck.Label htmlFor="radio-switch-2">
                      Liam Neeson
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-2">
                    <FormCheck.Input
                      id="radio-switch-3"
                      type="radio"
                      name="vertical_radio_button"
                      value="vertical-radio-daniel-craig"
                    />
                    <FormCheck.Label htmlFor="radio-switch-3">
                      Daniel Craig
                    </FormCheck.Label>
                  </FormCheck>
                </div>
                <div className="mt-3">
                  <div>Horizontal Radio Button</div>
                  <div className="mt-2 flex flex-col sm:flex-row">
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        id="radio-switch-4"
                        type="radio"
                        name="horizontal_radio_button"
                        value="horizontal-radio-chris-evans"
                      />
                      <FormCheck.Label htmlFor="radio-switch-4">
                        Chris Evans
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 mt-2 sm:mt-0">
                      <FormCheck.Input
                        id="radio-switch-5"
                        type="radio"
                        name="horizontal_radio_button"
                        value="horizontal-radio-liam-neeson"
                      />
                      <FormCheck.Label htmlFor="radio-switch-5">
                        Liam Neeson
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 mt-2 sm:mt-0">
                      <FormCheck.Input
                        id="radio-switch-6"
                        type="radio"
                        name="horizontal_radio_button"
                        value="horizontal-radio-daniel-craig"
                      />
                      <FormCheck.Label htmlFor="radio-switch-6">
                        Daniel Craig
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>
              </Preview>
            </div>
          </>
        </PreviewComponent>
      </div>
    </div>
  )
}

function ValidateComponent() {
  const schema = yup
    .object({
      name: yup.string().required().min(2),
      email: yup.string().required().email(),
      password: yup.string().required().min(6),
      age: yup
        .number()
        .required()
        .test(
          'len',
          'age must be less than or equal to 3',
          (val) => !!(val && val.toString().length <= 3)
        ),
      url: yup.string().url(),
      comment: yup.string().required().min(10),
    })
    .required()

  const {
    register,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Form Validation</h2>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-6">
        <div className="intro-y col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <div className="p-5">
              <Preview>
                <form className="validate-form" onSubmit={onSubmit}>
                  <div className="input-form">
                    <FormLabel
                      htmlFor="validation-form-1"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Name
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Required, at least 2 characters
                      </span>
                    </FormLabel>
                    <FormInput
                      {...register('name')}
                      id="validation-form-1"
                      type="text"
                      name="name"
                      className={clsx({
                        'border-danger': errors.name,
                      })}
                      placeholder="John Legend"
                    />
                    {errors.name && (
                      <div className="mt-2 text-danger">
                        {typeof errors.name.message === 'string' &&
                          errors.name.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form mt-3">
                    <FormLabel
                      htmlFor="validation-form-2"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Email
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Required, email address format
                      </span>
                    </FormLabel>
                    <FormInput
                      {...register('email')}
                      id="validation-form-2"
                      type="email"
                      name="email"
                      className={clsx({
                        'border-danger': errors.email,
                      })}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && (
                      <div className="mt-2 text-danger">
                        {typeof errors.email.message === 'string' &&
                          errors.email.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form mt-3">
                    <FormLabel
                      htmlFor="validation-form-3"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Password
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Required, at least 6 characters
                      </span>
                    </FormLabel>
                    <FormInput
                      {...register('password')}
                      id="validation-form-3"
                      type="password"
                      name="password"
                      className={clsx({
                        'border-danger': errors.password,
                      })}
                      placeholder="secret"
                    />
                    {errors.password && (
                      <div className="mt-2 text-danger">
                        {typeof errors.password.message === 'string' &&
                          errors.password.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form mt-3">
                    <FormLabel
                      htmlFor="validation-form-4"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Age
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Required, integer only & maximum 3 characters
                      </span>
                    </FormLabel>
                    <FormInput
                      {...register('age')}
                      id="validation-form-4"
                      type="number"
                      name="age"
                      className={clsx({
                        'border-danger': errors.age,
                      })}
                      placeholder="21"
                    />
                    {errors.age && (
                      <div className="mt-2 text-danger">
                        {typeof errors.age.message === 'string' &&
                          errors.age.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form mt-3">
                    <FormLabel
                      htmlFor="validation-form-5"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Profile URL
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Optional, URL format
                      </span>
                    </FormLabel>
                    <FormInput
                      {...register('url')}
                      id="validation-form-5"
                      type="text"
                      name="url"
                      className={clsx({
                        'border-danger': errors.url,
                      })}
                      placeholder="https://google.com"
                    />
                    {errors.url && (
                      <div className="mt-2 text-danger">
                        {typeof errors.url.message === 'string' &&
                          errors.url.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form mt-3">
                    <FormLabel
                      htmlFor="validation-form-6"
                      className="flex w-full flex-col sm:flex-row"
                    >
                      Comment
                      <span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">
                        Required, at least 10 characters
                      </span>
                    </FormLabel>
                    <FormTextarea
                      {...register('comment')}
                      id="validation-form-6"
                      name="comment"
                      className={clsx({
                        'border-danger': errors.comment,
                      })}
                      placeholder="Type your comments"
                    />
                    {errors.comment && (
                      <div className="mt-2 text-danger">
                        {typeof errors.comment.message === 'string' &&
                          errors.comment.message}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="mt-5">
                    Register
                  </button>
                </form>
              </Preview>
            </div>
          </PreviewComponent>
        </div>
      </div>
    </>
  )
}

function DatepickerComponent() {
  const [date, setDate] = useState('')
  const [daterange, setDaterange] = useState('')

  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Datepicker</h2>
      </div>
      <div className="intro-y mt-5 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Basic Date Picker
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Litepicker
                    value={date}
                    onChange={setDate}
                    options={{
                      autoApply: false,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }}
                    className="mx-auto block w-56"
                  />
                </Preview>
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Input Group</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div className="relative mx-auto w-56">
                    <div className="absolute flex h-full w-10 items-center justify-center rounded-l border bg-slate-100 text-slate-500 dark:border-darkmode-800 dark:bg-darkmode-700 dark:text-slate-400">
                      <Lucide icon="Calendar" className="h-4 w-4" />
                    </div>
                    <Litepicker
                      value={date}
                      onChange={setDate}
                      options={{
                        autoApply: false,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
                      className="pl-12"
                    />
                  </div>
                </Preview>
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Date Range Picker
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Litepicker
                    value={daterange}
                    onChange={setDaterange}
                    options={{
                      autoApply: false,
                      singleMode: false,
                      numberOfColumns: 2,
                      numberOfMonths: 2,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }}
                    className="mx-auto block w-56"
                  />
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
      </div>
    </>
  )
}

function SelectComponent() {
  const [select, setSelect] = useState('1')
  const [selectMultiple, setSelectMultiple] = useState(['1', '3'])
  const [selectHeader, setSelectHeader] = useState(['2', '3', '5'])

  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Tom Select</h2>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-6">
        <div className="intro-y col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Basic Select</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div>
                    <div>Basic {select}</div>
                    <div className="mt-2">
                      <TomSelect
                        value={select}
                        onChange={setSelect}
                        options={{
                          placeholder: 'Select your favorite actors',
                        }}
                        className="w-full"
                      >
                        <option value="1">Leonardo DiCaprio</option>
                        <option value="2">Johnny Deep</option>
                        <option value="3">Robert Downey, Jr</option>
                        <option value="4">Samuel L. Jackson</option>
                        <option value="5">Morgan Freeman</option>
                      </TomSelect>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div>Nested</div>
                    <div className="mt-2">
                      <TomSelect
                        value={select}
                        onChange={setSelect}
                        options={{
                          placeholder: 'Select your favorite actors',
                        }}
                        className="w-full"
                      >
                        <optgroup label="American Actors">
                          <option value="1">Leonardo DiCaprio</option>
                          <option value="2">Johnny Deep</option>
                          <option value="3">Robert Downey, Jr</option>
                          <option value="4">Samuel L. Jackson</option>
                          <option value="5">Morgan Freeman</option>
                        </optgroup>
                        <optgroup label="American Actresses">
                          <option value="6">Scarlett Johansson</option>
                          <option value="7">Jessica Alba</option>
                          <option value="8">Jennifer Lawrence</option>
                          <option value="9">Emma Stone</option>
                          <option value="10">Angelina Jolie</option>
                        </optgroup>
                      </TomSelect>
                    </div>
                  </div>
                </Preview>
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Multiple Select
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <TomSelect
                    value={selectMultiple}
                    onChange={setSelectMultiple}
                    options={{
                      placeholder: 'Select your favorite actors',
                    }}
                    className="w-full"
                    multiple
                  >
                    <option value="1">Leonardo DiCaprio</option>
                    <option value="2">Johnny Deep</option>
                    <option value="3">Robert Downey, Jr</option>
                    <option value="4">Samuel L. Jackson</option>
                    <option value="5">Morgan Freeman</option>
                  </TomSelect>
                </Preview>
                {/* <Source>
                    <Highlight>
                      {`
              <TomSelect
                value={selectMultiple}
                onChange={setSelectMultiple}
                options={{
                  placeholder: "Select your favorite actors",
                }}
                className="w-full"
                multiple
              >
                <option value="1">Leonardo DiCaprio</option>
                <option value="2">Johnny Deep</option>
                <option value="3">Robert Downey, Jr</option>
                <option value="4">Samuel L. Jackson</option>
                <option value="5">Morgan Freeman</option>
              </TomSelect>
              `}
                    </Highlight>
                  </Source> */}
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Header</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <TomSelect
                    value={selectHeader}
                    onChange={setSelectHeader}
                    options={{
                      placeholder: 'Select your favorite actors',
                      plugins: {
                        dropdown_header: {
                          title: 'Actors',
                        },
                      },
                    }}
                    className="w-full"
                    multiple
                  >
                    <option value="1">Leonardo DiCaprio</option>
                    <option value="2">Johnny Deep</option>
                    <option value="3">Robert Downey, Jr</option>
                    <option value="4">Samuel L. Jackson</option>
                    <option value="5">Morgan Freeman</option>
                  </TomSelect>
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
        <div className="intro-y col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Input Group</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div className="flex">
                    <div className="z-30 -mr-1 flex w-10 items-center justify-center rounded-l border bg-slate-100 text-slate-600 dark:border-darkmode-800 dark:bg-darkmode-700 dark:text-slate-400">
                      @
                    </div>
                    <TomSelect
                      value={select}
                      onChange={setSelect}
                      className="w-full"
                    >
                      <option value="1">Leonardo DiCaprio</option>
                      <option value="2">Johnny Deep</option>
                      <option value="3">Robert Downey, Jr</option>
                      <option value="4">Samuel L. Jackson</option>
                      <option value="5">Morgan Freeman</option>
                    </TomSelect>
                  </div>
                </Preview>
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Disabled</h2>
                {/* <FormSwitch className="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto">
                    <FormSwitch.Label htmlFor="show-example-5">
                      Show example code
                    </FormSwitch.Label>
                    <FormSwitch.Input
                      id="show-example-5"
                      onClick={toggle}
                      className="ml-3 mr-0"
                      type="checkbox"
                    />
                  </FormSwitch> */}
              </div>
              <div className="p-5">
                <Preview>
                  <TomSelect
                    value={select}
                    onChange={setSelect}
                    className="w-full"
                    disabled
                  >
                    <option value="1">Leonardo DiCaprio</option>
                    <option value="2">Johnny Deep</option>
                    <option value="3">Robert Downey, Jr</option>
                    <option value="4">Samuel L. Jackson</option>
                    <option value="5">Morgan Freeman</option>
                  </TomSelect>
                </Preview>
                {/* <Source>
                    <Highlight>
                      {`
              <TomSelect
                value={select}
                onChange={setSelect}
                className="w-full"
                disabled
              >
                <option value="1">Leonardo DiCaprio</option>
                <option value="2">Johnny Deep</option>
                <option value="3">Robert Downey, Jr</option>
                <option value="4">Samuel L. Jackson</option>
                <option value="5">Morgan Freeman</option>
              </TomSelect>
              `}
                    </Highlight>
                  </Source> */}
              </div>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Disabled Option
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <TomSelect
                    value={select}
                    onChange={setSelect}
                    className="w-full"
                  >
                    <option value="1" disabled>
                      Leonardo DiCaprio
                    </option>
                    <option value="2">Johnny Deep</option>
                    <option value="3">Robert Downey, Jr</option>
                    <option value="4" disabled>
                      Samuel L. Jackson
                    </option>
                    <option value="5">Morgan Freeman</option>
                  </TomSelect>
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
      </div>
    </>
  )
}

function WysiwygEditor() {
  const [editorData, setEditorData] = useState('<p>Content of the editor.</p>')

  return (
    <>
      <div className="mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">CKEditor</h2>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-6">
        {/* BEGIN: Classic Editor */}
        <div className="col-span-12">
          <PreviewComponent className="box">
            {/* {({ toggle }) => ( */}
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Classic Editor
                </h2>
                {/* <FormSwitch className="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto">
                  <FormSwitch.Label htmlFor="show-example-1">
                    Show example code
                  </FormSwitch.Label>
                  <FormSwitch.Input
                    id="show-example-1"
                    onClick={toggle}
                    className="ml-3 mr-0"
                    type="checkbox"
                  />
                </FormSwitch> */}
              </div>
              <div className="p-5">
                <Preview>
                  <ClassicEditor value={editorData} onChange={setEditorData} />
                </Preview>
                {/* <Source>
                    <Highlight>
                      {`
              <ClassicEditor
                value={editorData}
                onChange={setEditorData}
              />
              `}
                    </Highlight>
                  </Source> */}
              </div>
            </>
            {/* // )} */}
          </PreviewComponent>
        </div>
        {/* END: Classic Editor */}
      </div>
    </>
  )
}

function FormComponent() {
  const [date, setDate] = useState('')
  const schema = yup
    .object({
      name: yup.string().required().min(2),
      age: yup
        .number()
        .required()
        .test(
          'len',
          'age must be less than or equal to 3',
          (val) => !!(val && val.toString().length <= 3)
        ),
      comment: yup.string().required().min(10),
    })
    .required()

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    await trigger()
  }

  const options = [
    { id: 1, name: 'Chris Evans' },
    { id: 2, name: 'iam Neeson' },
    { id: 3, name: 'Daniel Craig' },
  ]

  return (
    <div className="mt-5 grid grid-cols-12 gap-6">
      <div className="intro-y col-span-12 lg:col-span-6">
        <PreviewComponent className="intro-y box">
          <div className="p-5">
            <Preview>
              <form className="validate-form" onSubmit={onSubmit}>
                <div className="input-form">
                  <InputElement
                    label="Name"
                    register={register}
                    name="name"
                    placeholder="Your Name"
                    id="name"
                    error={errors.name}
                  />
                  <InputElement
                    label="Age"
                    register={register}
                    name="age"
                    placeholder="Your Age"
                    id="age"
                    error={errors.age}
                    type="number"
                  />
                  <TextareaElement
                    label="comments"
                    register={register}
                    required
                    name="comment"
                    placeholder="Your Comment"
                    id="comment"
                    error={errors.comment}
                  />
                  <DateElement
                    label="DOB"
                    name="dob"
                    placeholder="Your DOB"
                    id="dob"
                    options={{
                      autoApply: false,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }}
                    error={errors.dob}
                    required
                    value={date}
                    onChange={setDate}
                    info="This is a Tooltip"
                  />
                  <SelectElement
                    label="actors"
                    register={register}
                    required
                    name="actors"
                    id="actors"
                    error={errors.actors}
                    options={options}
                  />
                </div>
                <div className="mt-5">
                  <Button
                    type="submit"
                    variant="primary"
                    className="mb-2 mr-1 w-24"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </Preview>
          </div>
        </PreviewComponent>
      </div>
    </div>
  )
}

function ButtonCom() {
  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Buttons</h2>
      </div>
      <div className="intro-y mt-5 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Basic Buttons</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button variant="primary" className="mb-2 mr-1 w-24">
                    Primary
                  </Button>
                  <Button variant="secondary" className="mb-2 mr-1 w-24">
                    Secondary
                  </Button>
                  <Button variant="success" className="mb-2 mr-1 w-24">
                    Success
                  </Button>
                  <Button variant="warning" className="mb-2 mr-1 w-24">
                    Warning
                  </Button>
                  <Button variant="pending" className="mb-2 mr-1 w-24">
                    Pending
                  </Button>
                  <Button variant="danger" className="mb-2 mr-1 w-24">
                    Danger
                  </Button>
                  <Button variant="dark" className="mb-2 mr-1 w-24">
                    Dark
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Button Sizes</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mb-2 mr-1 w-24"
                    >
                      Small
                    </Button>
                    <Button variant="primary" className="mb-2 mr-1 w-24">
                      Medium
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="mb-2 mr-1 w-24"
                    >
                      Large
                    </Button>
                  </div>
                  <div className="mt-5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mb-2 mr-1 w-24"
                    >
                      Small
                    </Button>
                    <Button variant="secondary" className="mb-2 mr-1 w-24">
                      Medium
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="mb-2 mr-1 w-24"
                    >
                      Large
                    </Button>
                  </div>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Working with Links
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button
                    as="a"
                    variant="primary"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Link
                  </Button>
                  <Button
                    as="a"
                    variant="secondary"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Button
                  </Button>
                  <Button
                    as="a"
                    variant="success"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Input
                  </Button>
                  <Button
                    as="a"
                    variant="warning"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Submit
                  </Button>
                  <Button
                    as="a"
                    variant="pending"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Pending
                  </Button>
                  <Button
                    as="a"
                    variant="danger"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Reset
                  </Button>
                  <Button
                    as="a"
                    variant="dark"
                    href=""
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Metal
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Elevated Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div>
                    <Button
                      variant="primary"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Primary
                    </Button>
                    <Button
                      variant="secondary"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Secondary
                    </Button>
                    <Button
                      variant="success"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Success
                    </Button>
                    <Button
                      variant="warning"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Warning
                    </Button>
                    <Button
                      variant="pending"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Pending
                    </Button>
                    <Button
                      variant="danger"
                      elevated
                      className="mb-2 mr-1 w-24"
                    >
                      Danger
                    </Button>
                    <Button variant="dark" elevated className="mb-2 mr-1 w-24">
                      Dark
                    </Button>
                  </div>
                  <div className="mt-5">
                    <Button
                      variant="primary"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Primary
                    </Button>
                    <Button
                      variant="secondary"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Secondary
                    </Button>
                    <Button
                      variant="success"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Success
                    </Button>
                    <Button
                      variant="warning"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Warning
                    </Button>
                    <Button
                      variant="pending"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Pending
                    </Button>
                    <Button
                      variant="danger"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Danger
                    </Button>
                    <Button
                      variant="dark"
                      elevated
                      rounded
                      className="mb-2 mr-1 w-24"
                    >
                      Dark
                    </Button>
                  </div>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Social Media Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div className="flex flex-wrap">
                    <Button variant="facebook" className="mb-2 mr-2 w-32">
                      <Lucide icon="Facebook" className="mr-2 h-4 w-4" />{' '}
                      Facebook
                    </Button>
                    <Button variant="twitter" className="mb-2 mr-2 w-32">
                      <Lucide icon="Twitter" className="mr-2 h-4 w-4" /> Twitter
                    </Button>
                    <Button variant="instagram" className="mb-2 mr-2 w-32">
                      <Lucide icon="Instagram" className="mr-2 h-4 w-4" />{' '}
                      Instagram
                    </Button>
                    <Button variant="linkedin" className="mb-2 mr-2 w-32">
                      <Lucide icon="Linkedin" className="mr-2 h-4 w-4" />{' '}
                      Linkedin
                    </Button>
                  </div>
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Outline Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button
                    variant="outline-primary"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Primary
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Secondary
                  </Button>
                  <Button
                    variant="outline-success"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Success
                  </Button>
                  <Button
                    variant="outline-warning"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Warning
                  </Button>
                  <Button
                    variant="outline-pending"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Pending
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Danger
                  </Button>
                  <Button
                    variant="outline-dark"
                    className="mb-2 mr-1 inline-block w-24"
                  >
                    Dark
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Loading State Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button variant="primary" className="mb-2 mr-1">
                    Saving
                    <LoadingIcon
                      icon="oval"
                      color="white"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                  <Button variant="success" className="mb-2 mr-1">
                    Adding
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                  <Button variant="warning" className="mb-2 mr-1">
                    Loading
                    <LoadingIcon
                      icon="three-dots"
                      color="1a202c"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                  <Button variant="danger" className="mb-2 mr-1">
                    Deleting
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="ml-2 h-4 w-4"
                    />
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Rounded Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button variant="primary" rounded className="mb-2 mr-1 w-24">
                    Primary
                  </Button>
                  <Button
                    variant="secondary"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Secondary
                  </Button>
                  <Button variant="success" rounded className="mb-2 mr-1 w-24">
                    Success
                  </Button>
                  <Button variant="warning" rounded className="mb-2 mr-1 w-24">
                    Warning
                  </Button>
                  <Button variant="pending" rounded className="mb-2 mr-1 w-24">
                    Pending
                  </Button>
                  <Button variant="danger" rounded className="mb-2 mr-1 w-24">
                    Danger
                  </Button>
                  <Button variant="dark" rounded className="mb-2 mr-1 w-24">
                    Dark
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Soft Color Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button
                    variant="soft-primary"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Primary
                  </Button>
                  <Button
                    variant="soft-secondary"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Secondary
                  </Button>
                  <Button
                    variant="soft-success"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Success
                  </Button>
                  <Button
                    variant="soft-warning"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Warning
                  </Button>
                  <Button
                    variant="soft-pending"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Pending
                  </Button>
                  <Button
                    variant="soft-danger"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Danger
                  </Button>
                  <Button
                    variant="soft-dark"
                    rounded
                    className="mb-2 mr-1 w-24"
                  >
                    Dark
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">Icon Buttons</h2>
              </div>
              <div className="p-5">
                <Preview>
                  <div className="flex flex-wrap">
                    <Button variant="primary" className="mb-2 mr-2 w-32">
                      <Lucide icon="Activity" className="mr-2 h-4 w-4" />{' '}
                      Activity
                    </Button>
                    <Button variant="secondary" className="mb-2 mr-2 w-32">
                      <Lucide icon="HardDrive" className="mr-2 h-4 w-4" /> Hard
                      Drive
                    </Button>
                    <Button variant="success" className="mb-2 mr-2 w-32">
                      <Lucide icon="Calendar" className="mr-2 h-4 w-4" />{' '}
                      Calendar
                    </Button>
                    <Button variant="warning" className="mb-2 mr-2 w-32">
                      <Lucide icon="Share2" className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button variant="pending" className="mb-2 mr-2 w-32">
                      <Lucide icon="Download" className="mr-2 h-4 w-4" />{' '}
                      Pending
                    </Button>
                    <Button variant="danger" className="mb-2 mr-2 w-32">
                      <Lucide icon="Trash" className="mr-2 h-4 w-4" /> Trash
                    </Button>
                    <Button variant="dark" className="mb-2 mr-2 w-32">
                      <Lucide icon="Image" className="mr-2 h-4 w-4" /> Image
                    </Button>
                  </div>
                </Preview>
              </div>
            </>
          </PreviewComponent>
          <PreviewComponent className="intro-y box mt-5">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Icon Only Buttons
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <Button variant="primary" className="mb-2 mr-1">
                    <Lucide icon="Activity" className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" className="mb-2 mr-1">
                    <Lucide icon="HardDrive" className="h-5 w-5" />
                  </Button>
                  <Button variant="success" className="mb-2 mr-1">
                    <Lucide icon="Calendar" className="h-5 w-5" />
                  </Button>
                  <Button variant="warning" className="mb-2 mr-1">
                    <Lucide icon="Share2" className="h-5 w-5" />
                  </Button>
                  <Button variant="pending" className="mb-2 mr-1">
                    <Lucide icon="Download" className="h-5 w-5" />
                  </Button>
                  <Button variant="danger" className="mb-2 mr-1">
                    <Lucide icon="Trash" className="h-5 w-5" />
                  </Button>
                  <Button variant="dark" className="mb-2 mr-1">
                    <Lucide icon="Image" className="h-5 w-5" />
                  </Button>
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
      </div>
    </>
  )
}

function ImageUploadComponent() {
  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Change Photo</h2>
      </div>
      <ImageUploadElement
        image={fakerData}
        alt="Profile Image"
        removeImageContent="Remove this profile photo?"
        buttonLabel="Change Photo"
      />
    </>
  )
}

function ProgressComponent() {
  return (
    <>
      <div className="intro-y mt-8 flex items-center">
        <h2 className="mr-auto text-lg font-medium">Progressbar</h2>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-6">
        <div className="intro-y col-span-12 lg:col-span-6">
          <PreviewComponent className="intro-y box">
            <>
              <div className="flex flex-col items-center border-b border-slate-200/60 p-5 dark:border-darkmode-400 sm:flex-row">
                <h2 className="mr-auto text-base font-medium">
                  Basic Progressbar
                </h2>
              </div>
              <div className="p-5">
                <Preview>
                  <ProgressBar />
                  <ProgressBar />
                  <ProgressBar />
                </Preview>
              </div>
            </>
          </PreviewComponent>
        </div>
      </div>
    </>
  )
}

export {
  CommonComponent,
  ValidateComponent,
  DatepickerComponent,
  SelectComponent,
  WysiwygEditor,
  FormComponent,
  ButtonCom,
  ImageUploadComponent,
  ProgressComponent,
}
