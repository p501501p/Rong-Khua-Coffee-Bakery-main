import { useState, useEffect } from 'react'

/**
 * useLocalStorage
 * Custom Hook สำหรับเก็บและโหลดข้อมูลจาก Local Storage โดยอัตโนมัติ
 * ใช้ useState เก็บค่าปัจจุบัน และ useEffect ซิงก์ค่ากลับไปที่ Local Storage
 * ทุกครั้งที่ค่าเปลี่ยน
 *
 * @param {string} key - key ที่จะใช้เก็บใน Local Storage
 * @param {*} initialValue - ค่าเริ่มต้น ถ้ายังไม่มีข้อมูลเดิม
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: ไม่สามารถอ่านค่า "${key}" ได้`, error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`useLocalStorage: ไม่สามารถบันทึกค่า "${key}" ได้`, error)
    }
  }, [key, value])

  return [value, setValue]
}
