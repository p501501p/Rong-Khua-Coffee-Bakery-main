import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react'
import { cartReducer, initialCartState } from '../reducers/cartReducer'

const STORAGE_KEY = 'coffee-shop:cart'

/**
 * useCart
 * Custom Hook ที่รวม logic ของตะกร้าสินค้าทั้งหมดไว้ในที่เดียว:
 *  - useReducer  : จัดการ state ตะกร้า (add / remove / qty / clear)
 *  - useEffect   : โหลดค่าตะกร้าเดิมจาก Local Storage ตอนเริ่มแอป
 *                  และบันทึกกลับทุกครั้งที่ตะกร้าเปลี่ยน
 *  - useMemo     : คำนวณยอดรวม (total) และจำนวนชิ้นทั้งหมด (count)
 *                  โดยไม่ต้องคำนวณใหม่ทุก re-render ถ้า items ไม่เปลี่ยน
 *  - useCallback : สร้างฟังก์ชัน addItem/removeItem/... ที่ reference คงที่
 *                  เพื่อส่งต่อให้ Component ลูก (MenuItem, CartItem) โดยไม่ทำให้
 *                  ลูกที่ห่อด้วย React.memo ต้อง re-render โดยไม่จำเป็น
 */
export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const hydrated = useRef(false)

  // โหลดตะกร้าเดิมจาก Local Storage ครั้งเดียวตอน mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) })
      }
    } catch (error) {
      console.warn('useCart: โหลดตะกร้าจาก Local Storage ไม่สำเร็จ', error)
    } finally {
      hydrated.current = true
    }
  }, [])

  // บันทึกตะกร้ากลับไปที่ Local Storage ทุกครั้งที่ items เปลี่ยน
  useEffect(() => {
    if (!hydrated.current) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }, [])

  const increaseQty = useCallback((id) => {
    dispatch({ type: 'INCREASE_QTY', payload: { id } })
  }, [])

  const decreaseQty = useCallback((id) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [state.items]
  )

  const count = useMemo(
    () => state.items.reduce((sum, item) => sum + item.qty, 0),
    [state.items]
  )

  return {
    items: state.items,
    total,
    count,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
  }
}
