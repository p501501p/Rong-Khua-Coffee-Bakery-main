/**
 * cartReducer
 * จัดการ state ของตะกร้าสินค้าทั้งหมดด้วย useReducer แทน useState
 * เพราะการเปลี่ยนแปลงตะกร้ามีหลาย action ที่สัมพันธ์กัน
 * (เพิ่ม/ลบ/เพิ่มจำนวน/ลดจำนวน/ล้างตะกร้า) การรวม logic ไว้ที่เดียว
 * ทำให้ debug และทดสอบง่ายกว่าการกระจาย setState หลายจุด
 */

export const initialCartState = {
  items: [], // { id, name, price, category, emoji, size, qty }
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE': {
      // ใช้ตอนโหลดค่าตะกร้าเดิมกลับมาจาก Local Storage
      return { items: action.payload ?? [] }
    }

    case 'ADD_ITEM': {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          ),
        }
      }

      return {
        items: [...state.items, { ...product, qty: 1 }],
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }

    case 'INCREASE_QTY': {
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        ),
      }
    }

    case 'DECREASE_QTY': {
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id ? { ...item, qty: item.qty - 1 } : item
          )
          .filter((item) => item.qty > 0),
      }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    default:
      return state
  }
}
