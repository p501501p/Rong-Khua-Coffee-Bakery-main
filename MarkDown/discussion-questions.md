# คำถามอภิปรายท้ายใบงาน

โปรเจ็ค: ระบบสั่งเครื่องดื่มร้านกาแฟด้วย React Hooks (โรงคั่ว — Rong Khua Coffee)

---

## 1. เหตุใดจึงเลือกใช้ useReducer แทน useState ในการจัดการตะกร้าสินค้า

ตะกร้าสินค้าไม่ใช่ state ก้อนเดียวที่เปลี่ยนค่าตรงๆ แต่เป็น "รายการ" ที่มีการกระทำ (action)
หลายแบบเกิดขึ้นได้ในเวลาต่างกัน เช่น เพิ่มสินค้า ลบสินค้า เพิ่ม/ลดจำนวน และล้างตะกร้า
ถ้าใช้ `useState` เพียงตัวเดียวเก็บ array ของสินค้า ทุก action จะต้องเขียน logic การ
`map`/`filter`/`find` ซ้ำๆ กระจายอยู่ในหลายจุดของ component ทำให้:

- โค้ดปนกันระหว่าง "UI" กับ "logic การเปลี่ยนแปลงข้อมูล"
- เสี่ยงต่อการเขียน logic ผิดพลาดไม่ตรงกันในแต่ละจุดที่แก้ตะกร้า (เช่น ลืม filter
  จำนวน 0 ออกตอนลดจำนวนสินค้า)
- ทดสอบยาก เพราะ logic ไม่ได้อยู่รวมกันเป็นฟังก์ชันเดียว

`useReducer` ทำให้เรารวบ logic ทั้งหมดไว้ในฟังก์ชัน `cartReducer` เพียงจุดเดียว
(ดูไฟล์ `src/reducers/cartReducer.js`) และ component เพียงแค่ `dispatch({ type, payload })`
เข้าใจง่ายว่า state เปลี่ยนเพราะ action อะไร คล้ายการมี "state machine" ของตะกร้า
ทำให้ debug ง่ายขึ้นมาก (log action ที่ dispatch ก็รู้ทันทีว่าตะกร้าเปลี่ยนเพราะอะไร)
และขยาย action ใหม่ในอนาคต (เช่น ใส่โค้ดส่วนลด) ก็ทำได้โดยไม่กระทบโค้ดเดิม

ตัวอย่างโค้ดจากโปรเจกต์:

```js
// src/hooks/useCart.js
const addItem = (product) => {
  dispatch({ type: 'ADD_ITEM', payload: product })
}
```

```js
// src/reducers/cartReducer.js
export function cartReducer(state, action) {
  switch (action.type) {
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

    case 'CLEAR_CART':
      return { items: [] }

    default:
      return state
  }
}
```

---

## 2. useMemo ช่วยเพิ่มประสิทธิภาพของระบบอย่างไร

ในโปรเจ็คนี้ใช้ `useMemo` อยู่ 2 จุดหลัก:

1. **กรองเมนู** (`App.jsx`) — คำนวณ `filteredItems` จากคำค้นหาและหมวดหมู่ที่เลือก
2. **คำนวณยอดรวมและจำนวนสินค้า** (`useCart.js`) — คำนวณ `total` และ `count` จาก
   รายการในตะกร้า

หากไม่ใช้ `useMemo` ทุกครั้งที่ component re-render (เช่น ตอนเปิด/ปิดตะกร้า หรือ
สลับธีมกลางวัน/กลางคืน) React จะรัน `.filter()` และ `.reduce()` วนซ้ำใหม่ทั้งหมด
ทั้งที่ข้อมูลต้นทาง (เมนู, คำค้นหา, ตะกร้า) ไม่ได้เปลี่ยนเลย ซึ่งเป็นการคำนวณที่สิ้นเปลือง
โดยเฉพาะถ้ารายการเมนูมีจำนวนมากขึ้นในอนาคต

`useMemo` จะจำ (cache) ผลลัพธ์ไว้ และคำนวณใหม่ก็ต่อเมื่อค่าใน dependency array
เปลี่ยนไปจริงๆ เท่านั้น (เช่น `[search, category]` หรือ `[state.items]`) ทำให้ระบบ
ตอบสนองไวขึ้นและไม่คำนวณข้อมูลซ้ำโดยไม่จำเป็น

ตัวอย่างโค้ดจากโปรเจกต์:

```js
// src/App.jsx
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
```

```js
// src/hooks/useCart.js
const total = useMemo(
  () => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  [state.items]
)
```

---

## 3. useCallback มีประโยชน์ในสถานการณ์ใด และหากไม่ใช้จะเกิดผลอย่างไร

`useCallback` มีประโยชน์เมื่อเราส่งฟังก์ชันจาก parent component ลงไปเป็น prop ให้
child component ที่ถูกห่อด้วย `React.memo` (เช่น `MenuItem` และ `CartItem` ในโปรเจ็คนี้)
โดยปกติแล้วทุกครั้งที่ parent re-render จะมีการสร้างฟังก์ชันใหม่ขึ้นมาใน memory
(แม้เนื้อหาโค้ดจะเหมือนเดิมทุกตัวอักษร) ซึ่งทำให้ `React.memo` มองว่า prop เปลี่ยน
และ re-render child ทุกตัวโดยไม่จำเป็น — ทั้งที่ข้อมูลของ card นั้นไม่ได้เปลี่ยนเลย

ในไฟล์ `src/hooks/useCart.js` ฟังก์ชัน `addItem`, `removeItem`, `increaseQty`,
`decreaseQty`, `clearCart` ถูกห่อด้วย `useCallback` ทำให้ reference ของฟังก์ชัน
คงที่ระหว่าง re-render (ตราบใดที่ dependency ไม่เปลี่ยน) เมื่อส่งต่อไปให้
`MenuItem`/`CartItem` ที่เป็น `React.memo` แล้ว การ์ดเมนูหรือรายการในตะกร้าที่ไม่ได้
เกี่ยวข้องกับ action นั้นๆ จะไม่ re-render ตามไปด้วย

**หากไม่ใช้ useCallback:** ระบบยังทำงานถูกต้องเหมือนเดิม (functionality ไม่เปลี่ยน)
แต่ประสิทธิภาพจะแย่ลงเมื่อรายการสินค้าหรือของในตะกร้ามีจำนวนมาก เพราะทุกครั้งที่
มีการ re-render จาก state อื่น (เช่น พิมพ์ค้นหา หรือสลับธีม) การ์ดสินค้าทุกใบจะถูก
re-render ใหม่หมดทั้งกริด ทั้งที่ควรจะ re-render แค่ใบที่เกี่ยวข้อง ทำให้ UI ช้าลง
โดยเฉพาะบนอุปกรณ์ที่ประสิทธิภาพต่ำ

ตัวอย่างโค้ดจากโปรเจกต์:

```js
// src/hooks/useCart.js
const addItem = useCallback((product) => {
  dispatch({ type: 'ADD_ITEM', payload: product })
}, [])
```

```js
// src/components/MenuItem.jsx
const MenuItem = React.memo(function MenuItem({ item, onAdd }) {
  return (
    <button onClick={() => onAdd(item)}>
      เพิ่มลงตะกร้า
    </button>
  )
})
```

---

## 4. เปรียบเทียบการใช้ useContext กับการส่งข้อมูลผ่าน Props (Props Drilling)

**Props Drilling** คือการส่งค่า/ฟังก์ชันผ่าน props จาก component แม่ไปยัง component
ลูกหลานทีละชั้น แม้ว่า component ระดับกลางบางตัวจะไม่ได้ใช้ค่านั้นเลย เพียงแค่
"รับส่งต่อ" เท่านั้น ยกตัวอย่างในโปรเจ็คนี้ ถ้าไม่ใช้ `useContext` การส่งค่าธีม
(`theme`, `toggleTheme`) จาก `App` ไปยัง `ThemeToggle` จะต้องผ่าน `Header` เป็น
props ก่อน ทั้งที่ `Header` เองไม่ได้ใช้ค่าธีมโดยตรง — ยิ่งโครงสร้างลึกเท่าไร
ก็ยิ่งต้องส่งผ่านหลายชั้นเท่านั้น

ผลเสียของ Props Drilling:
- โค้ดใน component ระดับกลางรกและอ่านยาก เพราะมี props ที่ไม่ได้ใช้ผ่านไปมา
- แก้ไข/เพิ่มค่าที่ต้องแชร์ทีหลัง ต้องไล่แก้ไฟล์หลายไฟล์ตามลำดับชั้น
- Refactor โครงสร้าง component ยาก เพราะการย้ายตำแหน่ง component กระทบ
  เส้นทางการส่ง props ทั้งหมด

**useContext** แก้ปัญหานี้โดยสร้าง "จุดแชร์ข้อมูลกลาง" (`ThemeContext`) ที่ทุก
component ในแอปสามารถ `useContext` ดึงค่ามาใช้ได้โดยตรง ไม่ว่าจะอยู่ลึกแค่ไหน
ในโปรเจ็คนี้ `ThemeProvider` ห่อทั้งแอปไว้ใน `main.jsx` และ component ใดก็ตาม
(เช่น `ThemeToggle`) เรียกใช้ `useTheme()` เพื่อดึง `theme` และ `toggleTheme`
ได้ทันทีโดยไม่ต้องผ่าน props จาก `App` หรือ `Header` เลย
เพิ่มเติมในรุ่นใหม่ ปุ่ม "ยืนยันสั่งซื้อ" จะล้างตะกร้าและแสดงข้อความยืนยันหลังจากกด
เพื่อให้ผู้ใช้รับรู้ว่าออเดอร์ถูกบันทึกเรียบร้อยแล้ว
**ข้อควรระวัง:** useContext ไม่ได้ควรใช้แทน props ทุกกรณี — ถ้าข้อมูลนั้นใช้เฉพาะ
component ลูกโดยตรงชั้นเดียว การส่ง props ธรรมดายังตรงไปตรงมาและเข้าใจง่ายกว่า
useContext เหมาะกับข้อมูล "global" ที่หลาย component ทั่วทั้งแอปต้องใช้ร่วมกัน
เช่น ธีม, ข้อมูลผู้ใช้ที่ล็อกอิน หรือภาษาที่เลือกใช้งาน

ตัวอย่างโค้ดจากโปรเจกต์:

```js
// src/context/ThemeContext.jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('coffee-shop:theme', 'day')

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'))
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

```js
// src/components/ThemeToggle.jsx
const { theme, toggleTheme } = useTheme()
```
