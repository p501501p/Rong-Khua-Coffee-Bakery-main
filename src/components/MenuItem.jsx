import React from 'react'

/**
 * ห่อด้วย React.memo เพื่อให้เห็นประโยชน์ของ useCallback อย่างชัดเจน:
 * ถ้า onAdd ที่ส่งมาจาก parent ไม่ใช่ฟังก์ชันใหม่ทุกครั้ง (เพราะห่อด้วย
 * useCallback ใน useCart) การ์ดเมนูที่ไม่เกี่ยวข้องจะไม่ re-render โดยไม่จำเป็น
 */
const MenuItem = React.memo(function MenuItem({ product, onAdd }) {
  return (
    <article className="menu-card">
      <div className="menu-card__badge mono">{product.category}</div>
      <div className="menu-card__emoji" aria-hidden="true">{product.emoji}</div>
      <h3 className="menu-card__name">{product.name}</h3>
      <p className="menu-card__nameEn mono">{product.nameEn}</p>
      <p className="menu-card__note">{product.note}</p>
      <div className="menu-card__footer">
        <span className="menu-card__price mono">฿{product.price}</span>
        <button className="menu-card__add" onClick={() => onAdd(product)}>
          + ใส่ตะกร้า
        </button>
      </div>
    </article>
  )
})

export default MenuItem
