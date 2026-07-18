import React from 'react'

function SearchBar({ value, onChange }) {
  return (
    <div className="search-stamp">
      <span className="search-stamp__icon" aria-hidden="true">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="ค้นหาเมนู เช่น ลาเต้, ครัวซองต์..."
        aria-label="ค้นหาเมนู"
      />
      {value && (
        <button className="search-stamp__clear" onClick={() => onChange('')} aria-label="ล้างคำค้นหา">
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
