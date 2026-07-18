import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext(null)

/**
 * ThemeProvider
 * ใช้ useContext ร่วมกับ useState เพื่อแชร์ธีม (day/night) ให้ทุก Component
 * โดยไม่ต้องส่ง props ลงไปทีละชั้น (หลีกเลี่ยง Props Drilling)
 * ค่าธีมถูกจำไว้ผ่าน useLocalStorage เพื่อให้คงอยู่แม้รีเฟรชหน้า
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('coffee-shop:theme', 'day')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'night' ? 'night' : 'day')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'))
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme ต้องถูกเรียกใช้ภายใน <ThemeProvider>')
  }
  return ctx
}
