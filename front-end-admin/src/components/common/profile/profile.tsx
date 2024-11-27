import { FaCamera } from 'react-icons/fa'

function Profile() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
      <div className="absolute bottom-0 right-2 rounded-full bg-black p-1">
        <FaCamera className="text-sm text-white" />
      </div>
    </div>
  )
}

export default Profile
