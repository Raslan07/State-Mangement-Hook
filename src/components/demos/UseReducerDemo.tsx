import { useReducer } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { name: string; price: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(
        (item) => item.name === action.payload.name
      )
      if (existing) {
        return state.map((item) =>
          item.name === action.payload.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...state,
        {
          id: Date.now(),
          name: action.payload.name,
          price: action.payload.price,
          quantity: 1,
        },
      ]
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload.id)
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

const availableItems = [
  { name: 'React Handbook', price: 29.99 },
  { name: 'TypeScript Guide', price: 24.99 },
  { name: 'CSS Mastery', price: 19.99 },
  { name: 'Node.js Patterns', price: 34.99 },
]

export function UseReducerDemo() {
  const [cart, dispatch] = useReducer(cartReducer, [])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="demo-container">
      <h3 className="demo-title">Shopping Cart Demo</h3>

      <div className="demo-output">
        {cart.length === 0 ? (
          <div className="cart-empty">Your cart is empty. Add some items below.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">
                  ${item.price.toFixed(2)} x {item.quantity}
                </span>
                <span>= ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <button
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_ITEM',
                    payload: { id: item.id },
                  })
                }
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-total">Total: ${total.toFixed(2)}</div>

      <div className="demo-actions">
        {availableItems.map((item) => (
          <button
            key={item.name}
            onClick={() =>
              dispatch({
                type: 'ADD_ITEM',
                payload: { name: item.name, price: item.price },
              })
            }
          >
            Add {item.name} (${item.price.toFixed(2)})
          </button>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  )
}