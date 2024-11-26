import React, { ReactNode } from 'react'
import Tippy from '../common/tippy'
import Lucide from '../common/lucide'
import clsx from 'clsx'

interface DashboardTileProps {
  amount?: string
  percentage?: any
  label?: string
  tooltipText: string
  tippyBgColor?: string
  icon?: any
}

const DashboardTileSeconary: React.FC<DashboardTileProps> = ({
  amount,
  percentage,
  label,
  tooltipText,
  tippyBgColor,
  icon,
}) => {
  return (
    <div className="intro-y w-full  ">
      <div
        className={clsx([
          'zoom-in relative',
          "h-full before:absolute before:inset-x-0 before:mx-auto before:mt-3 before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
        ])}
      >
        <div className="box  flex lg:h-full max-lg:h-[120px]   p-4">
          <div className="flex">
            <div className=" bg-gray-100 p-2 max-lg:rounded-[50px] lg:rounded-full">
              <img src={icon} className=" max-lg:h-16 max-lg:w-16" />
            </div>
            <div className="ml-auto">
              <Tippy
                as="div"
                className={clsx([
                  'flex cursor-pointer items-center rounded-full py-[3px] pl-2 pr-1 text-xs font-medium text-white',
                  tippyBgColor,
                ])}
                content={tooltipText}
              >
                {percentage}%
                <Lucide icon="ChevronUp" className="ml-0.5 h-4 w-4" />
              </Tippy>
            </div>
          </div>
          <div className=" mt-4">
            <div className="max-w-[200px] break-words max-lg:text-[15px] lg:text-xl  ">
              {label}
            </div>
            <div className="mt-3 font-medium leading-8 max-lg:text-[18px] lg:text-2xl">
              {amount}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTileSeconary
