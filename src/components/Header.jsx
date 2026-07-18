import React from 'react'
import ThemeToggle from './ThemeToggle.jsx'

function Header({ cartCount, onOpenCart }) {
  return (
    <header className="signboard">
      <div className="signboard__inner">
        <div className="signboard__mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="40" height="40">
            <path
              d="M14 24h30a6 6 0 0 1 6 6v2a10 10 0 0 1-10 10H24A10 10 0 0 1 14 32v-8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path d="M50 28h3a6 6 0 0 1 0 12h-3" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M20 10c-2 3 2 4 0 7M28 10c-2 3 2 4 0 7M36 10c-2 3 2 4 0 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 48h38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="signboard__text">
          <p className="signboard__eyebrow mono">EST. 2026 — ROASTED DAILY</p>
          <h1 className="signboard__title">โรงคั่ว</h1>
          <p className="signboard__sub">Rong Khua Coffee &amp; Bakery</p>
        </div>
        <div className="signboard__actions">
          <ThemeToggle />
          <button className="cart-fab" onClick={onOpenCart} aria-label="เปิดตะกร้าสินค้า">
            <span aria-hidden="true">🧺</span>
            <span className="cart-fab__count mono">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
