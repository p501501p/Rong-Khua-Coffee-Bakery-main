import React from 'react'

const CartItem = React.memo(function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <li className="receipt-line">
      <div className="receipt-line__main">
        <span className="receipt-line__emoji" aria-hidden="true">{item.emoji}</span>
        <div>
          <p className="receipt-line__name">{item.name}</p>
          <p className="receipt-line__unit mono">฿{item.price} / หน่วย</p>
        </div>
      </div>
      <div className="receipt-line__controls">
        <button onClick={() => onDecrease(item.id)} aria-label={`ลดจำนวน ${item.name}`}>
          −
        </button>
        <span className="mono">{item.qty}</span>
        <button onClick={() => onIncrease(item.id)} aria-label={`เพิ่มจำนวน ${item.name}`}>
          +
        </button>
      </div>
      <div className="receipt-line__end">
        <span className="mono">฿{item.price * item.qty}</span>
        <button className="receipt-line__remove" onClick={() => onRemove(item.id)} aria-label={`ลบ ${item.name} ออกจากตะกร้า`}>
          ลบ
        </button>
      </div>
    </li>
  )
})

export default CartItem
