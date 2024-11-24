import React, { ReactNode } from 'react'
import Tippy from '../common/tippy'
import Lucide from '../common/lucide'
import clsx from 'clsx'

interface DashboardTileProps {
  amount: string
  percentage: any
  label: string
  tooltipText: string
  tippyBgColor: string
  icon: any
}

const DashboardTile: React.FC<DashboardTileProps> = ({
  amount,
  percentage,
  label,
  tooltipText,
  tippyBgColor,
  icon,
}) => {
  return (
    <div className="intro-y w-full ">
      <div
        className={clsx([
          'zoom-in relative',
          "before:absolute before:inset-x-0 before:mx-auto before:mt-3 h-full before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
        ])}
      >
        <div className="box h-full p-4">
          <div className="flex">
            <div className="rounded-full bg-gray-100 p-2">
              <img src={icon} />
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
          <div className="mt-3 text-2xl font-medium leading-8">{amount}</div>
          <div className="break-words text-base text-slate-500 max-w-[200px]">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTile
