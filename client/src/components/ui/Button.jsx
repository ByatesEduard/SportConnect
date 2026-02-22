import React from 'react'

const Icon = ({ d, size = 20, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
)

export const CheckIcon = () => <Icon d="M20 6 9 17l-5-5" size={16} />
export const ArrowLeftIcon = () => <Icon d="M19 12H5M12 19l-7-7 7-7" />
export const ArrowRightIcon = () => <Icon d="M5 12h14M12 5l7 7-7 7" />

export const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  loading = false, 
  className = '',
  onClick,
  icon,
  ...props 
}) => {
  const baseClasses = "btn"
  
  const variantClasses = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    danger: "btn-danger",
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
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8" />
          </svg>
          <span>Обробка...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon && icon}
          {children}
        </span>
      )}
    </button>
  )
}

export default Button
