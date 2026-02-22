import React from 'react'

export const FormSelect = ({ 
  label, 
  id, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  className = '',
  children,
  ...props 
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormSelect
