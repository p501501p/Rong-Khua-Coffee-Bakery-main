import React from 'react'
import { CATEGORIES } from '../data/menuData.js'

function CategoryFilter({ active, onSelect }) {
  return (
    <div className="tag-row" role="tablist" aria-label="กรองหมวดหมู่สินค้า">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`tag ${active === cat ? 'tag--active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
