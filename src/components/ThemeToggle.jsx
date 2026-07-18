import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isNight = theme === 'night'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isNight}
      aria-label={isNight ? 'สลับเป็นโหมดกลางวัน' : 'สลับเป็นโหมดกลางคืน'}
      title={isNight ? 'Night Brew' : 'Day Shift'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">{isNight ? '🌙' : '☀️'}</span>
      <span className="mono theme-toggle__label">{isNight ? 'NIGHT BREW' : 'DAY SHIFT'}</span>
    </button>
  )
}

export default ThemeToggle
