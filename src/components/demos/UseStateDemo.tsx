import { useState } from 'react'

export function UseStateDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="demo-container">
      <h3 className="demo-title">Counter Demo</h3>

      <div className="demo-output">
        <div className="demo-output-text">Count: {count}</div>
      </div>

      <div className="demo-actions">
        <button onClick={() => setCount(count + 1)}>
          Increment (direct)
        </button>
        <button onClick={() => setCount(count - 1)}>
          Decrement (direct)
        </button>
        <button onClick={() => setCount((prev) => prev + 1)}>
          Increment (functional)
        </button>
        <button onClick={() => setCount((prev) => prev + 2)}>
          +2 (functional, batched)
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>

      <div style={{ marginTop: 'var(--space-md)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        <strong>Try this:</strong> Click "Increment (direct)" twice vs "Increment (functional)" twice.
        The functional updater always reads the latest state, making it safe for batched updates.
      </div>
    </div>
  )
}