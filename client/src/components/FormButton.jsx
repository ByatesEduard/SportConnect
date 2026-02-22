import React from 'react'

export const FormButton = ({ 
  children, 
  type = 'submit', 
  variant = 'primary', 
  disabled = false, 
  loading = false, 
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md transition-all duration-200"
  
  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-500 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8" />
          </svg>
          <span className="ml-2">Обробка...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default FormButton
