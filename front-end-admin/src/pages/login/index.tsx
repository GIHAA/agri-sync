import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import illustrationUrl from '../../assets/images/final-logo.svg'
import Button from '../../components/common/button'
import { FormCheck, FormInput } from '../../components/common/form-elements/components'
import { AuthApi } from '../../api'
import Toast from '../../utils/notification'
import SharedDataContainer from '../../containers/sharedData'
import { Icons, NotificationTypes } from '../../constants'
import { useLogin } from '../../api/auth-management'

function Main() {
  const authApi = AuthApi.useAPI()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('') 
  const { setNotification, handleSlider } = SharedDataContainer.useContainer()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const sucessHandlerLogin = (username: any, message: string) => {
    setNotification({
      title: 'Successfully Login',
      message,
      icon: Icons.CHECKCIRCLE,
      type: NotificationTypes.SUCCESS,
    })
    Toast()
    setIsLoading(false)
    handleSlider()
    setTimeout(() => {
      handleSlider()
      window.location.href = '/'
    }, 800)
  }
  const errorHandler = (error: any) => {
    Toast()
    setNotification({
      title: '',
      message: error || 'Please Check Your Login Credentials.',
      icon: Icons.XCIRCLE,
      type: NotificationTypes.ERROR,
    })
    setIsLoading(false)
  }
  const { mutate , data , isSuccess , isError } = useLogin()

  async function login() {
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    } else {
      setEmailError('')
    }
    
    setIsLoading(true)
    mutate({email , password })
  }

  useEffect(() => {
    if (isSuccess && data) {
      sucessHandlerLogin(email, 'Successfully Login')
    }
    if (isError) {
      errorHandler('Please Check Your Login Credentials.')
    }
  }, [isSuccess , isError , data])

  useEffect(() =>{
    if(isSuccess){
      localStorage.setItem('jwtToken', data?.access_token)
      localStorage.setItem('validationToken', data?.validation_token)
      localStorage.setItem('user' , JSON.stringify(data?.user))
    }
  }, [data, isSuccess])

  const UserLogin = async (userData: any) => {
    setIsLoading(true)
  }
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    UserLogin(data)
  }
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  return (
    <div
      className={clsx([
        'relative -m-3 h-screen bg-primary p-3 dark:bg-darkmode-800 sm:-mx-8 sm:px-8 lg:overflow-hidden xl:bg-white xl:dark:bg-darkmode-600',
        "before:absolute before:inset-y-0 before:left-0 before:-mb-[16%] before:-ml-[13%] before:-mt-[28%] before:hidden before:w-[57%] before:rotate-[-4.5deg] before:transform before:rounded-[100%] before:bg-primary/20 before:content-[''] before:dark:bg-darkmode-400 before:xl:block",
        "after:absolute after:inset-y-0 after:left-0 after:-mb-[13%] after:-ml-[13%] after:-mt-[20%] after:hidden after:w-[57%] after:rotate-[-4.5deg] after:transform after:rounded-[100%] after:bg-primary after:content-[''] after:dark:bg-darkmode-700 after:xl:block",
      ])}
    >
      <div className="container relative z-10 sm:px-10">
        <div className="block grid-cols-2 gap-4 xl:grid">
          {/* BEGIN: Login Info */}
          <div className="hidden min-h-screen flex-col xl:flex">
            <div className="my-auto flex -translate-x-10 -translate-y-6  transform items-center justify-center">
              <img alt="" className="mr-52 w-1/2" src={illustrationUrl} />
            </div>
          </div>
          {/* END: Login Info */}
          {/* BEGIN: Login Form */}
          <div className=" flex flex-col items-center justify-center  py-5">
            <div className="mx-auto my-auto w-full rounded-md   px-5 py-8 shadow-md dark:bg-darkmode-600 sm:w-3/4 sm:px-8 lg:w-2/4  xl:bg-transparent xl:p-0 xl:shadow-none">
              <h2 className="intro-x  text-center text-2xl font-bold xl:text-left xl:text-3xl">
                LOG IN
              </h2>
              <div className="intro-x mt-2 text-center text-slate-400 xl:hidden">
                A few more clicks to sign in to your account. Manage all your
                e-commerce accounts in one place
              </div>
              <div className="intro-x mt-8">
                <FormInput
                  type="text"
                  className="intro-x login__input block min-w-full px-4 py-3 shadow-md xl:min-w-[350px]"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* Display error message for invalid email */}
                {emailError && (
                  <div className="intro-x mt-2 text-red-500 text-xs">
                    {emailError}
                  </div>
                )}
                <FormInput
                  type="password"
                  className="intro-x login__input mt-4 block min-w-full px-4 py-3 shadow-md xl:min-w-[350px]"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="intro-x mt-4 flex text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
                <div className="mr-auto flex items-center">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <div className="intro-x mt-5 flex xl:mt-8">
                <div className="mr-auto flex items-center">
                  <Button
                    variant="primary"
                    className="w-full px-4 py-3 align-top shadow-lg xl:mr-3 xl:w-32"
                    onClick={login}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                </div>
              </div>
              <div className="intro-x mt-10 text-center text-slate-600 dark:text-slate-500 xl:mt-24 xl:text-left">
                TIPAPP © 2024 All rights reserved.
              </div>
            </div>
          </div>
          {/* END: Login Form */}
        </div>
      </div>
    </div>
  )
}

export default Main
