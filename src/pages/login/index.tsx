import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLogin } from '../../api/auth-management';
import Toast from '../../utils/notification';
import illustrationUrl from '../../assets/images/final-logo.svg';
import Button from '../../components/common/button';
import { FormCheck, FormInput } from '../../components/common/form-elements/components';
import SharedDataContainer from '../../containers/sharedData';
import { Icons, NotificationTypes } from '../../constants';

function Main() {
  const { setNotification, handleSlider } = SharedDataContainer.useContainer();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { mutate, data, isSuccess, isError, error } = useLogin();

  const validateInputs = () => {
    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const loginHandler = () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const { token, validationToken, name, role } = data.data;

          // Save user data and tokens to local storage
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('validationToken', validationToken);
          localStorage.setItem('user', JSON.stringify({ name, role }));

          // Show success notification
          setNotification({
            title: 'Successfully Logged In',
            message: `Welcome back, ${name}!`,
            icon: Icons.CHECKCIRCLE,
            type: NotificationTypes.SUCCESS,
          });
          Toast();

          // Redirect user after login
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || 'Invalid login credentials.';
          setNotification({
            title: 'Login Failed',
            message: errorMessage,
            icon: Icons.XCIRCLE,
            type: NotificationTypes.ERROR,
          });
          Toast();
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

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
          {/* Login Illustration */}
          <div className="hidden min-h-screen flex-col xl:flex">
            <div className="my-auto flex -translate-x-10 -translate-y-6 transform items-center justify-center">
              <img alt="Illustration" className="mr-52 w-1/2" src={illustrationUrl} />
            </div>
          </div>

          {/* Login Form */}
          <div className="flex flex-col items-center justify-center py-5">
            <div className="mx-auto my-auto w-full rounded-md px-5 py-8 shadow-md dark:bg-darkmode-600 sm:w-3/4 sm:px-8 lg:w-2/4 xl:bg-transparent xl:p-0 xl:shadow-none">
              <h2 className="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl">
                LOG IN
              </h2>
              <div className="intro-x mt-2 text-center text-slate-400 xl:hidden">
                Sign in to your account to manage all your tasks in one place.
              </div>
              <div className="intro-x mt-8">
                <FormInput
                  type="text"
                  value={email}
                  className="intro-x login__input block min-w-full px-4 py-3 shadow-md xl:min-w-[350px]"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <div className="text-red-500 text-xs mt-2">{emailError}</div>}

                <FormInput
                  type="password"
                  value={password}
                  className="intro-x login__input mt-4 block min-w-full px-4 py-3 shadow-md xl:min-w-[350px]"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div className="text-red-500 text-xs mt-2">{passwordError}</div>
                )}
              </div>

              <div className="intro-x mt-5 flex xl:mt-8">
                <Button
                  variant="primary"
                  className="w-full px-4 py-3 shadow-lg xl:w-32"
                  onClick={loginHandler}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              </div>

              <div className="intro-x mt-10 text-center text-slate-600 dark:text-slate-500 xl:mt-24">
                AgriAPP © 2024 All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
