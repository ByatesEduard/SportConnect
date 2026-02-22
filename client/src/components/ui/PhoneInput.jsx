import React from 'react'
import InputMask from 'react-input-mask'

/**
 * Маска телефону: +380 (__) ___-__-__
 * - Дозволені лише цифри (літери та інші символи ігноруються маскою).
 * - Формат України: +380, потім 2 цифри коду, 3 цифри, 2, 2.
 * - value передається/зберігається у вигляді рядка з маскою для відображення;
 *   для валідації можна використовувати тільки цифри (replace(/\D/g, '')).
 */
const PHONE_MASK = '+380 (99) 999-99-99'

export const PhoneInput = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e)
  }

  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}
      <InputMask
        mask={PHONE_MASK}
        maskChar="_"
        value={value}
        onChange={handleChange}
        required={required}
        className={`input w-full bg-[var(--surface2)] border rounded-[10px] text-[var(--text)] font-sans text-sm py-3 px-4 outline-none transition-colors ${error ? 'border-[var(--red)]' : 'border-[var(--border)]'} focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--green)]/20 ${className}`}
        placeholder={placeholder || PHONE_MASK}
        {...props}
      />
      {error && (
        <p className="field-error">{error}</p>
      )}
    </div>
  )
}

export default PhoneInput
