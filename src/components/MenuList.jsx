import React from 'react'
import MenuItem from './MenuItem.jsx'

function MenuList({ items, onAdd }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__emoji" aria-hidden="true">🫘</p>
        <p>ไม่พบเมนูที่ค้นหา ลองคำอื่นหรือเปลี่ยนหมวดหมู่ดูนะ</p>
      </div>
    )
  }

  return (
    <div className="menu-grid">
      {items.map((product) => (
        <MenuItem key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  )
}

export default MenuList
