import { useState, useEffect } from 'react';

interface ToggleButtonProps {
  onClick?: (type: 'email' | 'inApp') => void;
  selectedType?: string;
  editbutton? : boolean
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onClick,
  selectedType = 'email',
  editbutton,
}) => {
  const [selected, setSelected] = useState<string>(selectedType)

  useEffect(() => {
    setSelected(selectedType)
  }, [selectedType])

  const handleClick = (type: 'email' | 'inApp') => {
    setSelected(type)
    if (onClick) {
      onClick(type)
    }
  }

  return (
    <div className="flex h-[57px] w-full rounded-md bg-white p-1">
      <button
        className={`w-full rounded-md px-4 py-2 transition-colors ${
          selected === 'email'
            ? 'bg-black text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        onClick={() => handleClick('email')}
        type="button"
        disabled={editbutton  ? editbutton : false}
      >
        Email
      </button>
      <button
        className={`w-full rounded-md px-4 py-2 transition-colors ${
          selected === 'inApp'
            ? 'bg-black text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        }`}
        onClick={() => handleClick('inApp')}
        type="button"
        disabled={editbutton ? editbutton : false}
      >
        In App
      </button>
    </div>
  )
}

export default ToggleButton;
