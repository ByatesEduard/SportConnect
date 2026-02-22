import React from 'react'

export const Card = ({ 
  children, 
  className = '',
  padding = 'p-6',
  shadow = 'shadow-lg',
  rounded = 'rounded-lg',
  border = 'border border-gray-200',
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white 
        ${shadow} 
        ${rounded} 
        ${border}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
