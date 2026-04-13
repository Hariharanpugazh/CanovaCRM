import React, { useState } from 'react'
import './PasswordInput.css'

function PasswordInput({ 
  value, 
  onChange, 
  placeholder = 'Password',
  name = 'password',
  disabled = false 
}) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="password-input-wrapper">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="password-input"
        disabled={disabled}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={togglePasswordVisibility}
        disabled={disabled}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          // Eye Open Icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          // Eye Closed Icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default PasswordInput
