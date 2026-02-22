import React from 'react'

// Icon component for inline SVGs
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

// Common icons
export const UserIcon = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
export const MailIcon = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
export const PhoneIcon = () => <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
export const CalIcon = () => <Icon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
export const MapIcon = () => <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
export const LockIcon = () => <Icon d="M12 2v4M5 10h14M5 14h14M5 18h14M7 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />

export const Input = ({ 
  label, 
  icon, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <div className={`input-wrap ${icon ? 'has-icon' : ''}`}>
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  rows = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <div className="input-wrap">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export const Select = ({ 
  label, 
  icon,
  options, 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = "Оберіть варіант",
  className = '',
  ...props 
}) => {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <div className={`input-wrap ${icon ? 'has-icon' : ''}`}>
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export const RadioGroup = ({ name, options, value, onChange, error, className = '' }) => {
  return (
    <div className="field">
      <div className={`radio-group ${className}`}>
        {options.map(option => (
          <label
            key={option.value}
            className={`radio-opt ${value === option.value ? 'selected' : ''}`}
          >
            <input 
              type="radio" 
              name={name} 
              value={option.value} 
              checked={value === option.value} 
              onChange={onChange} 
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
