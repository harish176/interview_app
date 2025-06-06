import React from 'react'

const SpinnerLoader = () => {
  return (
<div role="status" className="flex items-center space-x-2">
  <svg
    aria-hidden="true"
    className="w-4 h-4 text-white animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
  <span className="text-white font-medium"></span>
</div>



  )
}

export default SpinnerLoader
