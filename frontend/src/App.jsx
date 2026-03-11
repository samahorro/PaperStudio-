import React, { useState } from 'react'

function App() {
  const [placeholder1, setPlaceholder1] = useState('home')
  const [placeholder2, setPlaceholder2] = useState(null)
  const [placeholder3, setPlaceholder3] = useState([])

  const [placeholder4, setPlaceholder4] = useState('')
  const [placeholder5, setPlaceholder5] = useState('')

  const [placeholder6, setPlaceholder6] = useState('')
  const [placeholder7, setPlaceholder7] = useState('')
  const [placeholder8, setPlaceholder8] = useState('')

  const fn1 = (e) => {
    e.preventDefault()
    setPlaceholder3([...placeholder3, { p1: placeholder4, p2: placeholder5 }])
    setPlaceholder8('success')
  }

  const fn2 = (e) => {
    e.preventDefault()
    const found = placeholder3.find(x => x.p1 === placeholder6 && x.p2 === placeholder7)
    if (found) {
      setPlaceholder2(found.p1)
      setPlaceholder1('home')
    } else {
      setPlaceholder8('fail')
    }
  }

  const fn3 = () => {
    setPlaceholder2(null)
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', fontFamily: 'serif' }}>
      <div>
        <a href="#" onClick={(e) => { e.preventDefault(); setPlaceholder8(''); setPlaceholder1('home') }}>[Placeholder 9]</a> | 
        <a href="#" onClick={(e) => { e.preventDefault(); setPlaceholder8(''); setPlaceholder1('products') }}>[Placeholder 10]</a> | 
        {!placeholder2 && <a href="#" onClick={(e) => { e.preventDefault(); setPlaceholder8(''); setPlaceholder1('login') }}>[Placeholder 11]</a>}
        {!placeholder2 && <span> | </span>}
        {!placeholder2 && <a href="#" onClick={(e) => { e.preventDefault(); setPlaceholder8(''); setPlaceholder1('register') }}>[Placeholder 12]</a>}
        {placeholder2 && <a href="#" onClick={(e) => { e.preventDefault(); fn3() }}>[Placeholder 13] ({placeholder2})</a>}
      </div>
      <hr />
      
      {placeholder1 === 'home' && (
        <div>
          <h1>Placeholder 14</h1>
          <p>Placeholder 15</p>
        </div>
      )}

      {placeholder1 === 'products' && (
        <div>
          <h1>Placeholder 16</h1>
          <ul>
            <li>Placeholder 17 - $10</li>
            <li>Placeholder 18 - $20</li>
          </ul>
        </div>
      )}

      {placeholder1 === 'register' && (
        <div>
          <h1>Placeholder 19</h1>
          <form onSubmit={fn1}>
            <div>
              <label>Placeholder 20: </label>
              <input type="text" value={placeholder4} onChange={e => setPlaceholder4(e.target.value)} />
            </div>
            <div>
              <label>Placeholder 21: </label>
              <input type="password" value={placeholder5} onChange={e => setPlaceholder5(e.target.value)} />
            </div>
            <button type="submit">Placeholder 22</button>
          </form>
          {placeholder8 && <p>{placeholder8}</p>}
        </div>
      )}

      {placeholder1 === 'login' && (
        <div>
          <h1>Placeholder 23</h1>
          <form onSubmit={fn2}>
            <div>
              <label>Placeholder 24: </label>
              <input type="text" value={placeholder6} onChange={e => setPlaceholder6(e.target.value)} />
            </div>
            <div>
              <label>Placeholder 25: </label>
              <input type="password" value={placeholder7} onChange={e => setPlaceholder7(e.target.value)} />
            </div>
            <button type="submit">Placeholder 26</button>
          </form>
          {placeholder8 && <p>{placeholder8}</p>}
        </div>
      )}
    </div>
  )
}

export default App
