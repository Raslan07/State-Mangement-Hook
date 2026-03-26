# React Hooks Masterclass — useState · useReducer · useContext

> A complete reference guide covering definitions, syntax, parameters, caveats, use cases, best practices, and real examples for the three foundational React state hooks.

---

## Table of Contents

1. [useState](#1-usestate)
   - [Definition](#definition)
   - [Syntax & Parameters](#syntax--parameters)
   - [How It Works Internally](#how-it-works-internally)
   - [Real Examples](#real-examples)
   - [Caveats & What to Avoid](#caveats--what-to-avoid)
   - [Best Practices](#best-practices)
2. [useReducer](#2-usereducer)
   - [Definition](#definition-1)
   - [Syntax & Parameters](#syntax--parameters-1)
   - [How It Works Internally](#how-it-works-internally-1)
   - [Real Examples](#real-examples-1)
   - [Caveats & What to Avoid](#caveats--what-to-avoid-1)
   - [Best Practices](#best-practices-1)
3. [useContext](#3-usecontext)
   - [Definition](#definition-2)
   - [Syntax & Parameters](#syntax--parameters-2)
   - [How It Works Internally](#how-it-works-internally-2)
   - [3-Step Setup](#3-step-setup)
   - [Real Examples](#real-examples-2)
   - [Caveats & What to Avoid](#caveats--what-to-avoid-2)
   - [Best Practices](#best-practices-2)
4. [All Three Together — Production Pattern](#4-all-three-together--production-pattern)
5. [Comparison Table](#5-comparison-table)
6. [Decision Guide — Which Hook?](#6-decision-guide--which-hook)
7. [Use Case Map](#7-use-case-map)

---

## 1. useState

### Definition

`useState` is a React Hook that adds a **reactive memory slot** to your component. When the stored value changes, React automatically re-renders the component with the new value. Think of it as a variable that React is watching.

- Scoped to **one component** (local state)
- Each call to `useState` creates an independent state slot
- State is **preserved between renders** — unlike regular variables which reset on every render

### Syntax & Parameters

```tsx
const [state, setState] = useState(initialState)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `initialState` | `any` | The starting value. Only used on the **first render**. Can be a value or a lazy initializer function. |
| `state` *(return)* | `any` | The current value. On first render equals `initialState`. |
| `setState` *(return)* | `function` | The setter function. Call it to update state and trigger a re-render. |

#### setState — two forms

| Form | When to use | Example |
|------|-------------|---------|
| `setState(newValue)` | New value does **not** depend on old state | `setName('Ali')` |
| `setState(prev => next)` | New value **depends** on current state | `setCount(c => c + 1)` |

#### Optional: Lazy Initializer

When `initialState` is expensive to compute, pass a **function** instead of a value. React calls it only on the first render:

```tsx
// Bad — runs loadFromStorage() on EVERY render
const [items, setItems] = useState(loadFromStorage())

// Good — runs loadFromStorage() only ONCE
const [items, setItems] = useState(() => loadFromStorage())
```

### How It Works Internally

```
Component renders
       ↓
React stores state in a fiber slot (linked list, ordered by hook call)
       ↓
You call setState(newValue)
       ↓
React queues a re-render (batches multiple setStates together)
       ↓
Component re-runs, gets new state value from the fiber slot
```

> **Key insight:** React uses `Object.is()` to compare old vs new state. If they're the same reference, React **skips the re-render**. This is why mutating objects directly never triggers a re-render — the reference stays identical.

### Real Examples

#### Basic counter

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  // Use updater form — safe when next value depends on current
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)

  return (
    <div>
      <button onClick={decrement}>−</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

#### Object state — form

```tsx
function ProfileForm() {
  const [user, setUser] = useState({ name: '', email: '', age: 0 })

  // Always spread — never mutate directly
  const updateField = (field: string, value: string) =>
    setUser(prev => ({ ...prev, [field]: value }))

  return (
    <form>
      <input value={user.name}  onChange={e => updateField('name', e.target.value)} />
      <input value={user.email} onChange={e => updateField('email', e.target.value)} />
    </form>
  )
}
```

#### Array state

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>([])

  const addTodo = (text: string) =>
    setTodos(prev => [...prev, text])       // add

  const removeTodo = (i: number) =>
    setTodos(prev => prev.filter((_, idx) => idx !== i)) // remove

  const updateTodo = (i: number, text: string) =>
    setTodos(prev => prev.map((t, idx) => idx === i ? text : t)) // update

  return (/* JSX */)
}
```

#### With TypeScript

```tsx
// Explicit typing when inference isn't enough
const [user, setUser] = useState<User | null>(null)
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
```

### Caveats & What to Avoid

#### ❌ Mutating state directly

```tsx
// WRONG — same reference, React skips the re-render
state.name = 'Ali'
arr.push(item)
setUser(user)      // passing same object reference does nothing
```

```tsx
// CORRECT — always return a new reference
setUser({ ...user, name: 'Ali' })
setArr(prev => [...prev, item])
```

#### ❌ Reading state right after setting it

```tsx
// WRONG — count is still the old value in this render
setCount(count + 1)
console.log(count) // stale snapshot!

// CORRECT — use updater form or read after re-render
setCount(prev => {
  console.log(prev) // correct
  return prev + 1
})
```

#### ❌ Storing derived data in state

```tsx
// WRONG — count is redundant, gets out of sync
const [items, setItems] = useState([])
const [count, setCount] = useState(0) // just items.length!

// CORRECT — derive it inline
const [items, setItems] = useState([])
const count = items.length  // always in sync, no extra state
```

#### ❌ Calling setState during render

```tsx
// WRONG — infinite loop
function Component() {
  const [x, setX] = useState(0)
  setX(1) // called during render → re-render → setX(1) → re-render...
}
```

#### ⚠️ StrictMode runs setState twice

In development with `<StrictMode>`, React calls your component twice to detect side effects. This is intentional — if you see state-related effects happening twice, this is why.

### Best Practices

- **Prefer multiple small state variables** over one large object when fields update independently
- **Always use the updater form** `setState(prev => ...)` when the next state depends on the current one — especially inside `useEffect`, event handlers, or callbacks
- **Never derive state from props** in `useState(props.value)` — use `useMemo` or compute inline instead
- **Group related state** into an object when they always update together (e.g., `{x, y}` coordinates)
- **Initialize lazily** with a function for any expensive computation

---

## 2. useReducer

### Definition

`useReducer` is like `useState` but for **complex state logic**. Instead of calling setters directly and scattering logic across handlers, you dispatch **actions** and a single pure **reducer function** decides how state changes. Think of it as a tiny, predictable state machine.

- Best for state that has **3+ related values** that change together
- All logic lives in one place → easier to test and debug
- The reducer is a **pure function** — same input always gives same output

### Syntax & Parameters

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `reducer` | `(state, action) => state` | A **pure function** that takes current state + an action, returns the next state. No side effects allowed inside. |
| `initialArg` | `any` | The initial state value. If `init` is provided, this is passed to `init()` instead of being used directly. |
| `init` *(optional)* | `function` | Lazy initializer. Called as `init(initialArg)` to compute the initial state. Avoids expensive computation on every render. |
| `state` *(return)* | `any` | The current state value. |
| `dispatch` *(return)* | `function` | Sends an action to the reducer. Call as `dispatch({ type: 'increment' })`. |

#### dispatch

```tsx
dispatch(action)
// action is typically: { type: string; payload?: any }
```

`dispatch` is **stable** — it never changes between renders, so it's safe to pass as a prop or include in dependency arrays without causing re-renders.

### How It Works Internally

```
You call dispatch(action)
           ↓
React calls reducer(currentState, action) synchronously
           ↓
Reducer returns nextState
           ↓
React compares with Object.is()
           ↓
If different → schedules re-render with nextState
```

> The reducer runs **synchronously** and must be **pure** — no API calls, no mutations, no `Math.random()`, no `Date.now()` inside it.

### Real Examples

#### Shopping cart

```tsx
import { useReducer } from 'react'

// 1. Define the state shape
interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// 2. Define all possible actions as a discriminated union
type CartAction =
  | { type: 'ADD_ITEM';    payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QTY';  payload: { id: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DRAWER' }

// 3. Pure reducer — all cart logic in one place
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state // always return state for unknown actions
  }
}

// 4. Component
function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  return (
    <div>
      <p>{cart.items.length} items</p>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: shoe })}>
        Add Shoe
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
        Clear
      </button>
    </div>
  )
}
```

#### Multi-step form

```tsx
type FormState = {
  step: 1 | 2 | 3
  personal: { name: string; email: string }
  address:  { street: string; city: string }
  payment:  { card: string }
}

type FormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<FormState['personal']> }
  | { type: 'UPDATE_ADDRESS';  payload: Partial<FormState['address']> }
  | { type: 'RESET' }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(3, state.step + 1) as 1|2|3 }
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) as 1|2|3 }
    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } }
    case 'UPDATE_ADDRESS':
      return { ...state, address: { ...state.address, ...action.payload } }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
```

#### Lazy initializer (optional third argument)

```tsx
function init(initialCount: number) {
  return { count: initialCount, history: [] }
}

function Counter({ initialCount = 0 }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init)
  // init(0) runs only once — not on every render
}
```

### Caveats & What to Avoid

#### ❌ Side effects inside the reducer

```tsx
// WRONG — reducer must be pure
function reducer(state, action) {
  fetch('/api/save', { body: JSON.stringify(state) }) // ❌ side effect
  localStorage.setItem('state', JSON.stringify(state))  // ❌ side effect
  return newState
}

// CORRECT — side effects go in event handlers, useEffect, etc.
const handleSave = async () => {
  await fetch('/api/save', { body: JSON.stringify(state) })
  dispatch({ type: 'SAVED' })
}
```

#### ❌ Mutating state inside the reducer

```tsx
// WRONG — mutates, same reference, React bails out
case 'ADD':
  state.items.push(action.item) // ❌
  return state                  // ❌ same reference!

// CORRECT — return new object
case 'ADD':
  return {
    ...state,
    items: [...state.items, action.item]
  }
```

#### ❌ Forgetting the default case

```tsx
// Always include default — future actions won't crash
switch (action.type) {
  case 'INCREMENT': return { ...state, count: state.count + 1 }
  default: return state  // ✅ required
}
```

#### ⚠️ StrictMode runs reducer twice

In development, React calls your reducer twice to verify it's pure. If you see doubled effects, this is intentional. In production, it runs once.

### Best Practices

- **Define actions as a TypeScript discriminated union** — exhaustive type checking, autocomplete, no typos
- **Keep the reducer in a separate file** — it's a pure function, easy to import and unit test independently
- **Name actions as events, not commands** — `'ITEM_ADDED'` (what happened) vs `'ADD_ITEM'` (command) — either works, but be consistent
- **Never put async logic inside the reducer** — dispatch after awaiting, then update state
- **Use `useReducer` over `useState` when:** you have 3+ state fields that update together, state transitions are complex, or you want a clear audit trail of what changed and why

---

## 3. useContext

### Definition

`useContext` reads and subscribes to a **context value**. It lets you pass data deeply through the component tree without manually threading props through every level — the solution to **prop drilling**.

- Does **not** store state itself — it reads from the nearest `Provider` above
- Every consumer re-renders when the Provider's `value` changes
- Best for global or widely-shared data: auth, theme, locale, cart

### Syntax & Parameters

```tsx
const value = useContext(SomeContext)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `SomeContext` | `Context object` | The context created by `createContext()`. Pass the **context object**, not the value. |
| *returns* | `any` | The value from the **nearest Provider above** in the tree. Falls back to `createContext`'s default value if no Provider is found. |

### How It Works Internally

```
Provider sets value prop
         ↓
React stores it in the fiber tree (associated with that Context)
         ↓
useContext() walks up the fiber tree to find the nearest Provider
         ↓
Returns that value and subscribes to it
         ↓
When Provider's value changes → ALL consumers re-render
```

> **Critical:** Every component calling `useContext(MyCtx)` re-renders when the Provider's value changes — even if the specific data they use didn't change. Split contexts or memoize values to control this.

### 3-Step Setup

#### Step 1 — Create the context

```tsx
// theme-context.ts
import { createContext } from 'react'

// Pass a sensible default (used when no Provider is above)
export const ThemeContext = createContext<'light' | 'dark'>('light')
```

#### Step 2 — Provide it high in the tree

```tsx
// app.tsx
import { ThemeContext } from './theme-context'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeContext.Provider value={theme}>
      <Navbar />   {/* no theme prop needed */}
      <Main />     {/* no theme prop needed */}
      <Footer />   {/* no theme prop needed */}
    </ThemeContext.Provider>
  )
}
```

#### Step 3 — Consume anywhere in the tree

```tsx
// button.tsx — can be 10 levels deep, doesn't matter
import { useContext } from 'react'
import { ThemeContext } from './theme-context'

function Button() {
  const theme = useContext(ThemeContext) // 'light' or 'dark'
  return <button className={`btn btn-${theme}`}>Click me</button>
}
```

### Real Examples

#### Complete auth context pattern (production-ready)

```tsx
// store/auth-context.tsx

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Default is null — throws if used outside Provider (see useAuth below)
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    const u = await response.json()
    setUser(u)
  }

  const logout = () => setUser(null)

  // Memoize — prevents all consumers re-rendering on unrelated parent renders
  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook — throws a clear error if used outside the Provider
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>. Check your component tree.')
  }
  return ctx
}

// Usage anywhere in the tree
function ProfilePage() {
  const { user, logout } = useAuth()
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Log out</button>
    </div>
  )
}
```

#### Theme context with localStorage persistence

```tsx
// store/theme-context.tsx

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
} | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Lazy init — reads from localStorage only once
    return (localStorage.getItem('theme') as Theme) ?? 'system'
  })

  const handleSetTheme = (t: Theme) => {
    setTheme(t)
    localStorage.setItem('theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
```

### Caveats & What to Avoid

#### ❌ Object literal as Provider value (re-renders every consumer)

```tsx
// WRONG — new object created every render = all consumers re-render
function App() {
  const [user, setUser] = useState(null)
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* ↑ New object reference every render! */}
    </AuthContext.Provider>
  )
}

// CORRECT — memoize the value
function App() {
  const [user, setUser] = useState(null)
  const value = useMemo(() => ({ user, login, logout }), [user])
  return (
    <AuthContext.Provider value={value}>
      {/* Stable reference — only re-renders consumers when user changes */}
    </AuthContext.Provider>
  )
}
```

#### ❌ One giant context for everything

```tsx
// WRONG — any change to any piece re-renders all consumers
const AppContext = createContext({ user, theme, cart, locale, featureFlags })

// CORRECT — split by update frequency
const AuthContext  = createContext(...)  // changes rarely (login/logout)
const ThemeContext = createContext(...)  // changes rarely (toggle)
const CartContext  = createContext(...)  // changes often (add/remove items)
```

#### ❌ Using context for frequently-updated values without optimization

```tsx
// RISKY — if position updates 60fps, every consumer re-renders 60fps
<MouseContext.Provider value={{ x, y }}>

// FIX — use a subscription library (Zustand, Jotai) for high-frequency updates
// OR split into MouseXContext and MouseYContext so components subscribe to only what they need
```

#### ⚠️ No Provider above = uses the createContext default

```tsx
const ThemeContext = createContext('light') // fallback default

// If Button renders outside any Provider:
function Button() {
  const theme = useContext(ThemeContext) // 'light' — the default, not an error
}
```

This is a common silent bug — the component renders, uses the default, and you never get an error. Set the default to `null` and throw in a custom hook to catch it.

### Best Practices

- **Always wrap with a custom hook** (`useAuth`, `useTheme`) that throws if used outside the Provider — much better DX than silent `null` bugs
- **Memoize the Provider value** with `useMemo` to prevent unnecessary re-renders
- **Split context by concern and update frequency** — auth, theme, and cart should be separate contexts
- **Never put context inside a context** — it creates tight coupling; use composition instead
- **Context is not a state manager** — it's a dependency injection tool. For heavy state, pair it with `useReducer`

---

## 4. All Three Together — Production Pattern

This is the architecture used in almost every production React/Next.js app. The three hooks each play a distinct role:

| Hook | Role | Example |
|------|------|---------|
| `useContext` | Makes state available across the tree (global) | Auth, theme, cart |
| `useReducer` | Manages complex state transitions inside the Provider | Cart items, multi-step forms |
| `useState` | Handles simple local UI state inside each component | Button "added" feedback, dropdown open |

### Complete cart store implementation

```tsx
// store/cart-context.tsx

import {
  createContext, useContext, useReducer, useMemo,
  ReactNode, Dispatch
} from 'react'

// ─── Types ───────────────────────────────────────────────

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD';    item: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_DRAWER' }

// ─── Reducer (pure, fully testable) ──────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i
        ).filter(i => i.qty > 0)
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────

interface CartContextValue {
  state: CartState
  dispatch: Dispatch<CartAction>
  // Derived values
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────

const initialState: CartState = { items: [], isOpen: false }

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const value = useMemo(() => ({
    state,
    dispatch,
    totalItems: state.items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ─── Custom Hook ─────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside <CartProvider>')
  return ctx
}

// ─── Component using all three hooks ─────────────────────

function ProductCard({ product }: { product: Omit<CartItem, 'qty'> }) {
  const { dispatch } = useCart()           // global — from useContext + useReducer

  // Local UI state — no other component needs to know about this
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    dispatch({ type: 'ADD', item: product }) // goes to reducer
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAdd}>
        {added ? '✓ Added!' : 'Add to cart'}
      </button>
    </div>
  )
}

// ─── Next.js app/layout.tsx ──────────────────────────────

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## 5. Comparison Table

| Dimension | `useState` | `useReducer` | `useContext` |
|-----------|-----------|--------------|--------------|
| **What it does** | Stores a single reactive value | Manages complex state via actions | Reads shared data from the tree |
| **Syntax** | `[val, setVal] = useState(init)` | `[state, dispatch] = useReducer(fn, init)` | `val = useContext(MyCtx)` |
| **State shape** | Single value, primitive or object | Usually an object with multiple fields | Whatever the Provider passes |
| **Update mechanism** | Call `setState(newValue)` | Call `dispatch({ type, payload })` | Update in the Provider component |
| **Logic location** | Scattered across event handlers | Centralized in one reducer function | In the Provider |
| **Testability** | OK — test via component | Excellent — reducer is a pure function | OK — needs Provider wrapper in tests |
| **Debugging** | Medium — state is scattered | Easy — log every dispatched action | Medium — hard to trace re-renders |
| **Performance concern** | Only re-renders owning component | Only re-renders owning component | All consumers re-render on any change |
| **Scope** | Local — one component | Local — one component (or lifted) | Global — the whole subtree below Provider |
| **Complexity sweet spot** | Simple: 1–3 related values | Complex: 3+ values that change together | Any depth: auth, theme, cart |
| **Best combined with** | — | `useContext` (to share dispatch globally) | `useReducer` or `useState` as the value |
| **When to reach for it** | Toggle, counter, form field, modal open | Cart, multi-step form, game, undo/redo | Auth, theme, locale, feature flags |

---

## 6. Decision Guide — Which Hook?

```
Do multiple components (not just parent/child) need this data?
├── Yes → useContext
│         └── Is the state transitions complex? (3+ fields, many actions)
│             ├── Yes → useContext + useReducer inside the Provider
│             └── No  → useContext + useState inside the Provider
└── No  → Is the state transitions complex? (3+ fields, many actions)
          ├── Yes → useReducer
          └── No  → useState
```

### Quick rule of thumb

| Situation | Hook |
|-----------|------|
| Toggle, counter, single input, modal open/close | `useState` |
| Loading/error/data triple | `useReducer` |
| Form with 4+ fields that validate together | `useReducer` |
| Cart, wishlist, undo history | `useReducer` |
| Needs to be accessible in 3+ components | `useContext` |
| Current logged-in user | `useContext + useState` |
| Dark/light theme | `useContext + useState` |
| Shopping cart with complex add/remove logic | `useContext + useReducer` |

---

## 7. Use Case Map

### useState — best for

- Toggle open/closed
- Form input values
- Loading / error flags
- Selected tab or step
- Hover / focus state
- Counter
- Modal visibility
- "Added to cart" feedback state

### useReducer — best for

- Shopping cart (add, remove, update qty, clear)
- Multi-step checkout form
- Undo / redo history
- Game state (score, lives, level, board)
- Data fetch state (`{ status, data, error }`)
- Drag-and-drop state
- Complex filter / sort combinations
- Accordion / stepper with many rules

### useContext — best for

- Authentication (current user, login, logout)
- Theme (dark/light/system)
- Locale / internationalization (i18n)
- Feature flags
- Toast / notification system
- Route context
- Any app-wide state that many components need

---

## References

- [useState — React docs](https://react.dev/reference/react/useState)
- [useReducer — React docs](https://react.dev/reference/react/useReducer)
- [useContext — React docs](https://react.dev/reference/react/useContext)
- [createContext — React docs](https://react.dev/reference/react/createContext)
- [Choosing the State Structure — React docs](https://react.dev/learn/choosing-the-state-structure)
- [Scaling Up with Reducer and Context — React docs](https://react.dev/learn/scaling-up-with-reducer-and-context)
