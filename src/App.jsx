import React, { useState, useMemo, useCallback } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import MenuList from './components/MenuList.jsx'
import Cart from './components/Cart.jsx'
import { MENU_ITEMS } from './data/menuData.js'
import { useCart } from './hooks/useCart.js'
import './App.css'

function App() {
  // useState: จัดการ UI state ง่ายๆ ที่ไม่มี logic ซับซ้อน (ไม่จำเป็นต้องใช้ useReducer)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ทั้งหมด')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const cart = useCart()

  // useMemo: กรองเมนูใหม่เฉพาะตอนที่ search, category หรือรายการเมนูเปลี่ยนจริงๆ
  // ป้องกันการวนลูปกรองข้อมูลซ้ำทุกครั้งที่ App re-render ด้วยเหตุผลอื่น (เช่น เปิด/ปิดตะกร้า)
  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return MENU_ITEMS.filter((item) => {
      const matchCategory = category === 'ทั้งหมด' || item.category === category
      const matchSearch =
        keyword === '' ||
        item.name.toLowerCase().includes(keyword) ||
        item.nameEn.toLowerCase().includes(keyword)
      return matchCategory && matchSearch
    })
  }, [search, category])

  const openCart = useCallback(() => {
    setCheckoutMessage('')
    setCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setCheckoutMessage('')
    setCartOpen(false)
  }, [])

  const handleCheckout = useCallback(() => {
    if (cart.items.length === 0) return

    cart.clearCart()
    setCheckoutMessage('สั่งซื้อสำเร็จแล้ว ขอบคุณที่เลือกเครื่องดื่มจากโรงคั่ว')
  }, [cart.clearCart, cart.items.length])

  return (
    <div className="app">
      <Header cartCount={cart.count} onOpenCart={openCart} />

      <main className="app__main">
        <section className="app__intro">
          <p className="mono app__intro-eyebrow">เมนูวันนี้</p>
          <h2>คั่วสด ชงใหม่ ทุกออเดอร์</h2>
          <p className="app__intro-sub">
            เลือกเครื่องดื่มและของทานเล่นที่ชอบ แล้วดูใบเสร็จสรุปราคาแบบเรียลไทม์
          </p>
        </section>

        <div className="app__controls">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter active={category} onSelect={setCategory} />
        </div>

        <MenuList items={filteredItems} onAdd={cart.addItem} />
      </main>

      <Cart
        open={cartOpen}
        onClose={closeCart}
        items={cart.items}
        total={cart.total}
        count={cart.count}
        onIncrease={cart.increaseQty}
        onDecrease={cart.decreaseQty}
        onRemove={cart.removeItem}
        onClear={cart.clearCart}
        onCheckout={handleCheckout}
        checkoutMessage={checkoutMessage}
      />
    </div>
  )
}

export default App
