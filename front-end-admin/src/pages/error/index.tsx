import { useNavigate } from 'react-router-dom'

import errorIllustration from '../../assets/images/error-illustration.svg'
import RouteRegistry from '../../router/router-registry'

function Error() {
  const navigate = useNavigate()

  const handleRedirect = () => {
    navigate(RouteRegistry.home.path)
  }

  return (
    <div className="py-2">
      <div className="container">
        <div className="error-page flex h-screen flex-col items-center justify-center text-center lg:flex-row lg:text-left">
          <div className="-intro-x lg:mr-20">
            <img
              alt="Midone Tailwind HTML Admin Template"
              className="h-48 w-[450px] lg:h-auto"
              src={errorIllustration}
            />
          </div>
          <div className="mt-10 text-white lg:mt-0">
            <div className="intro-x text-8xl font-medium">404</div>
            <div className="intro-x mt-5 text-xl font-medium lg:text-3xl">
              Oops. This page has gone missing.
            </div>
            <div className="intro-x mt-3 text-lg">
              You may have mistyped the address or the page may have moved.
            </div>
            {/* <button onClick={handleRedirect}>Back to Home</button> */}
            <button
              type="button"
              className="intro-x mt-10 rounded-md border-2 border-white px-4 py-3 text-white dark:border-darkmode-400 dark:text-slate-200"
              onClick={handleRedirect}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
