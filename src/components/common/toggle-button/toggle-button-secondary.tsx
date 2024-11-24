import { useState, useEffect } from 'react'

interface ToggleButtonProps {
  onclick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  toggletext?: string
  togglestyle?: boolean
  title?: string | number
  style?: string
}

const ToggleButtonSecondary: React.FC<ToggleButtonProps> = ({
  onclick,
  toggletext,
  togglestyle,
  title,
  style,
}) => {
  return (
    <div className={`flex h-[57px] w-full rounded-md bg-white p-1 ${style}`}>
      <button
        className={`w-full rounded-md px-4 py-2 transition-colors ${
          togglestyle
            ? 'bg-black text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        onClick={onclick}
        type="button"
      >
        {toggletext}
        {title && (
          <span
            className={`ml-2 rounded-full px-2 text-xs ${
              togglestyle ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            {title}
          </span>
        )}
      </button>
    </div>
  )
}

export default ToggleButtonSecondary
