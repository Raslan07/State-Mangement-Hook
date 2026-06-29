import type { HookData } from '../types'

export const hooksData: HookData[] = [
  {
    id: 'useState',
    title: 'useState',
    subtitle: 'Local Component State',
    color: '#059669',
    description: 'The foundational hook for managing state in functional components.',
    overview:
      'useState is the most basic React hook. It lets you add state to functional components, ' +
      'providing a reactive value and a setter function. Understanding useState deeply is critical ' +
      'because it introduces the mental model of React\'s rendering lifecycle, state preservation, ' +
      'and the functional update pattern.',
    sections: [
      {
        id: 'syntax',
        title: 'Syntax',
        content:
          'useState returns a pair: the current state value and a function that lets you update it. ' +
          'The only argument is the initial state, which can be a primitive, object, array, or a lazy initializer function.',
        code: {
          code: `const [state, setState] = useState(initialValue)\nconst [count, setCount] = useState(0)\nconst [user, setUser] = useState({ name: '', age: 0 })`,
          language: 'tsx',
          title: 'Basic syntax',
        },
      },
      {
        id: 'lazy-initialization',
        title: 'Lazy Initialization',
        content:
          'If the initial state is the result of an expensive computation, provide a function instead. ' +
          'React will only call this function during the initial render, preserving performance on re-renders.',
        code: {
          code: `// ❌ Expensive on every render\nconst [state, setState] = useState(computeInitialValue())\n\n// ✅ Lazy — only runs once\nconst [state, setState] = useState(() => computeInitialValue())`,
          language: 'tsx',
          title: 'Lazy initializer pattern',
        },
      },
      {
        id: 'functional-updater',
        title: 'Functional Updater',
        content:
          'When the new state depends on the previous state, use the functional updater form. ' +
          'This guarantees you always read the latest state, even inside closures or batching scenarios.',
        code: {
          code: `// ❌ Stale closure risk\nsetCount(count + 1)\nsetCount(count + 1) // Both use the same count\n\n// ✅ Always correct\nsetCount(prev => prev + 1)\nsetCount(prev => prev + 1) // Each receives the latest`,
          language: 'tsx',
          title: 'Functional vs direct update',
        },
      },
      {
        id: 'object-is',
        title: 'State Comparison (Object.is)',
        content:
          'React uses Object.is to compare state before and after an update. If the value hasn\'t changed, ' +
          'React skips re-rendering the component and its children. This is why mutating state directly ' +
          'fails — the object reference stays the same.',
        code: {
          code: `const [user, setUser] = useState({ name: 'Alice' })\n\n// ❌ Mutates — same reference, no re-render\nuser.name = 'Bob'\nsetUser(user)\n\n// ✅ New reference, re-render happens\nsetUser({ ...user, name: 'Bob' })`,
          language: 'tsx',
          title: 'Immutability matters',
        },
      },
      {
        id: 'rendering-lifecycle',
        title: 'Rendering Lifecycle & State Preservation',
        content:
          'React preserves state as long as the component stays mounted. State is not preserved across ' +
          'unmounts. During re-renders, useState returns the current state (not the initial value). ' +
          'State updates are batched in React 18+ and applied together before the next render.',
      },
      {
        id: 'when-to-use',
        title: 'When to Use',
        content:
          'Use useState when state is simple (primitives, small objects, booleans, strings) ' +
          'and the update logic is straightforward. If your state updates involve complex logic, ' +
          'multiple sub-values, or depend on previous state in non-trivial ways, consider useReducer.',
      },
    ],
    practices: [
      {
        id: 'useState-functional-updater',
        title: 'Prefer Functional Updates for Dependent State',
        description:
          'Always use the functional updater form when the new state depends on the previous state. ' +
          'This eliminates stale closure bugs, especially in async callbacks, timers, and event handlers.',
        code: {
          code: `setCount(prev => prev + 1)`,
          language: 'tsx',
        },
      },
      {
        id: 'useState-spread-immutable',
        title: 'Spread Objects & Arrays Immutably',
        description:
          'Never mutate state directly. Always create a new copy using the spread operator or structuredClone. ' +
          'This ensures React detects the change and re-renders correctly.',
        code: {
          code: `setUser(prev => ({ ...prev, name: 'Bob' }))\nsetItems(prev => [...prev, newItem])`,
          language: 'tsx',
        },
      },
      {
        id: 'useState-colocate',
        title: 'Colocate State Where It Is Used',
        description:
          'Keep state as close as possible to where it is consumed. Avoid lifting state up prematurely. ' +
          'Start with local useState, then lift only when multiple components need to share the same state.',
      },
      {
        id: 'useState-multiple-states',
        title: 'Separate Independent Concerns',
        description:
          'Use multiple useState calls for unrelated state values instead of one large object. ' +
          'This improves readability and reduces unnecessary re-renders from unrelated state changes.',
        code: {
          code: `// ✅ Clear and focused\nconst [name, setName] = useState('')\nconst [email, setEmail] = useState('')\n\n// ❌ Too broad, harder to update partially\nconst [form, setForm] = useState({ name: '', email: '' })`,
          language: 'tsx',
        },
      },
    ],
    mistakes: [
      {
        id: 'useState-mutating-directly',
        title: 'Mutating State Directly',
        description:
          'The most common useState mistake is modifying state directly instead of creating a new copy. ' +
          'React uses reference equality (Object.is) to detect changes, so mutations are invisible to React.',
        problem:
          'Direct mutations cause silent UI bugs where the component does not re-render despite apparent state changes.',
        solution:
          'Always return a new object/array when updating state. Use the spread operator, .map(), .filter(), ' +
          'or structuredClone to create copies.',
        code: {
          code: `// ❌ Mutation — no re-render\nconst [items, setItems] = useState([1, 2, 3])\nitems.push(4)\nsetItems(items)\n\n// ✅ New array — re-render happens\nsetItems(prev => [...prev, 4])`,
          language: 'tsx',
        },
      },
      {
        id: 'useState-stale-closure',
        title: 'Stale Closures in Async Code',
        description:
          'When reading state inside a setTimeout, setInterval, or async callback, the closure captures ' +
          'the state at the time the callback was created, not the current state.',
        problem:
          'Using the state value directly inside async callbacks leads to one-off bugs that are hard to reproduce.',
        solution:
          'Use the functional updater form to always access the latest state, or use a ref to store the current value.',
        code: {
          code: `const [count, setCount] = useState(0)\n\nuseEffect(() => {\n  const id = setInterval(() => {\n    // ❌ Stale: count is always 0\n    setCount(count + 1)\n    // ✅ Fresh: reads the latest count\n    setCount(prev => prev + 1)\n  }, 1000)\n  return () => clearInterval(id)\n}, [])`,
          language: 'tsx',
        },
      },
      {
        id: 'useState-overcomplicating',
        title: 'Overcomplicating Simple State',
        description:
          'Using useState for state that could be derived from other state or props, or using complex ' +
          'objects when multiple simple useState calls would be clearer.',
        problem: 'Leads to synchronization bugs and unnecessary re-renders.',
        solution:
          'Derive what you can. Keep state minimal. Split unrelated concerns into separate useState calls.',
      },
    ],
  },
  {
    id: 'useReducer',
    title: 'useReducer',
    subtitle: 'Complex State & State Machines',
    color: '#d97706',
    description:
      'A more powerful alternative to useState for managing complex state logic.',
    overview:
      'useReducer is ideal when state transitions involve multiple sub-values, when the next state ' +
      'depends heavily on the previous one, or when you want to model state as a state machine. ' +
      'It follows the same reducer pattern popularized by Redux: a pure function that takes the ' +
      'current state and an action, and returns the next state.',
    sections: [
      {
        id: 'syntax',
        title: 'Syntax',
        content:
          'useReducer accepts a reducer function and an initial state. It returns the current state ' +
          'and a dispatch function. The reducer receives the current state and an action, and returns ' +
          'the next state. Actions are typically objects with a type field (discriminated union).',
        code: {
          code: `const [state, dispatch] = useReducer(reducer, initialState)\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { ...state, count: state.count + 1 }\n    case 'DECREMENT':\n      return { ...state, count: state.count - 1 }\n    default:\n      return state\n  }\n}`,
          language: 'tsx',
          title: 'Basic reducer pattern',
        },
      },
      {
        id: 'pure-reducers',
        title: 'Pure Reducers',
        content:
          'Reducers must be pure functions — no side effects, no async calls, no DOM mutations. ' +
          'Given the same (state, action) pair, a reducer should always return the same output. ' +
          'This purity makes state transitions predictable, testable, and debuggable.',
        code: {
          code: `// ✅ Pure — predictable\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'ADD_TODO':\n      return [...state, { id: Date.now(), text: action.payload }]\n    default:\n      return state\n  }\n}\n\n// ❌ Impure — side effect inside reducer\nfunction reducer(state, action) {\n  localStorage.setItem('todos', JSON.stringify(state)) // side effect!\n  return state\n}`,
          language: 'tsx',
          title: 'Pure vs impure reducers',
        },
      },
      {
        id: 'discriminated-unions',
        title: 'Discriminated Union Actions',
        content:
          'TypeScript discriminated unions make reducers type-safe. Each action type carries its own ' +
          'payload type, and TypeScript narrows the action within each case branch.',
        code: {
          code: `type Action =\n  | { type: 'INCREMENT' }\n  | { type: 'DECREMENT' }\n  | { type: 'SET_COUNT'; payload: number }\n  | { type: 'RESET' }\n\nfunction reducer(state: State, action: Action): State {\n  switch (action.type) {\n    case 'INCREMENT':\n      return { count: state.count + 1 }\n    case 'SET_COUNT':\n      return { count: action.payload } // payload is typed as number\n    case 'RESET':\n      return { count: 0 }\n    default:\n      return state\n  }\n}`,
          language: 'tsx',
          title: 'Type-safe discriminated unions',
        },
      },
      {
        id: 'when-to-use',
        title: 'When to Use',
        content:
          'Reach for useReducer when: (1) state is an object with multiple fields, (2) state transitions ' +
          'are complex and involve multiple sub-values, (3) the next state depends heavily on the ' +
          'previous one, or (4) you want to model a state machine with finite states. For simple ' +
          'primitives or single values, useState is often sufficient.',
      },
      {
        id: 'useReducer-vs-useState',
        title: 'useReducer vs useState',
        content:
          'useReducer and useState are both state management hooks. The key difference is that ' +
          'useReducer separates the "what happened" (action) from the "how state changes" (reducer logic). ' +
          'This makes complex update logic more readable, testable, and maintainable. As a rule of thumb: ' +
          'start with useState, refactor to useReducer when the logic becomes unwieldy.',
      },
    ],
    practices: [
      {
        id: 'useReducer-pure',
        title: 'Keep Reducers Pure',
        description:
          'Reducers should never have side effects. No API calls, no timers, no DOM access. ' +
          'Side effects belong in event handlers or useEffect. Pure reducers are testable and predictable.',
      },
      {
        id: 'useReducer-descriminated-actions',
        title: 'Use Discriminated Unions',
        description:
          'Always type actions as discriminated unions. This gives you type safety and autocompletion ' +
          'in every case branch. Never use a generic string type for action.type.',
        code: {
          code: `type Action = { type: 'ADD'; payload: Item } | { type: 'REMOVE'; payload: Id }`,
          language: 'tsx',
        },
      },
      {
        id: 'useReducer-default-case',
        title: 'Always Handle the Default Case',
        description:
          'Return the current state unchanged in the default case. This makes the reducer resilient ' +
          'to unknown actions and enables easy extension.',
        code: {
          code: `default:\n  return state`,
          language: 'tsx',
        },
      },
      {
        id: 'useReducer-extract-constants',
        title: 'Extract Reducer and Types',
        description:
          'Extract the reducer function, state type, and action types into a separate file or co-located ' +
          'module. This improves testability and keeps components focused on rendering.',
      },
    ],
    mistakes: [
      {
        id: 'useReducer-side-effects',
        title: 'Side Effects Inside Reducers',
        description:
          'The most common useReducer mistake is performing side effects inside the reducer function. ' +
          'This breaks purity and makes state transitions unpredictable.',
        problem:
          'Side effects in reducers cause bugs that are hard to track: async operations may conflict, ' +
          'mutations can corrupt state, and testing becomes unreliable.',
        solution:
          'Move side effects to event handlers (dispatch after the effect) or to useEffect (dispatch when ' +
          'the effect runs). Keep reducers pure.',
        code: {
          code: `// ❌ Side effect in reducer\nfunction reducer(state, action) {\n  fetch('/api/data') // NO!\n  return { ...state, loading: true }\n}\n\n// ✅ Dispatch from event handler or effect\nfunction handleSubmit() {\n  dispatch({ type: 'START_LOADING' })\n  fetch('/api/data').then(data => dispatch({ type: 'SET_DATA', payload: data }))\n}`,
          language: 'tsx',
        },
      },
      {
        id: 'useReducer-mutation',
        title: 'Mutating State in Reducers',
        description:
          'Just like with useState, mutating the state object inside a reducer prevents React from ' +
          'detecting the change. Reducers must return new objects, not modify existing ones.',
        problem: 'Silent UI staleness — the state changes internally but the component never re-renders.',
        solution:
          'Always spread or copy state before making changes. Use array methods that return new arrays ' +
          '(.map, .filter, .concat) instead of mutating ones (.push, .splice).',
        code: {
          code: `// ❌ Mutation\ncase 'ADD_ITEM':\n  state.items.push(action.payload)\n  return state\n\n// ✅ Immutable update\ncase 'ADD_ITEM':\n  return { ...state, items: [...state.items, action.payload] }`,
          language: 'tsx',
        },
      },
      {
        id: 'useReducer-overengineering',
        title: 'Overengineering with useReducer',
        description:
          'Using useReducer for a single boolean or a simple counter adds unnecessary boilerplate. ' +
          'useReducer should be reserved for state that genuinely benefits from the pattern.',
        problem: 'Unnecessary complexity reduces readability and maintainability.',
        solution:
          'Start with useState. If you find yourself writing complex state logic with multiple ' +
          'dependent state variables, refactor to useReducer.',
      },
    ],
  },
  {
    id: 'useContext',
    title: 'useContext',
    subtitle: 'Dependency Injection & Shared State',
    color: '#7c3aed',
    description:
      'A mechanism for sharing values across the component tree without prop drilling.',
    overview:
      'useContext lets you subscribe to a React context without introducing a separate state management ' +
      'library. It is React\'s built-in dependency injection system. Combined with useReducer, it can ' +
      'serve as a lightweight global state solution. However, it must be used with care — inappropriate ' +
      'usage can cause unnecessary re-renders across the entire tree.',
    sections: [
      {
        id: 'syntax',
        title: 'Syntax',
        content:
          'First, create a context with createContext. Then provide a value using a Provider component. ' +
          'Any descendant can consume the value using the useContext hook. The default value is used ' +
          'when a component is not wrapped in a matching Provider.',
        code: {
          code: `// 1. Create\nconst ThemeContext = createContext('light')\n\n// 2. Provide\n<ThemeContext.Provider value="dark">\n  <App />\n</ThemeContext.Provider>\n\n// 3. Consume\nconst theme = useContext(ThemeContext) // 'dark'`,
          language: 'tsx',
          title: 'Context in three steps',
        },
      },
      {
        id: 'prop-drilling',
        title: 'Solving Prop Drilling',
        content:
          'Prop drilling occurs when you pass data through multiple intermediate components that do not ' +
          'need the data themselves. Context bypasses the intermediate layers, letting data flow directly ' +
          'from the provider to any consumer anywhere in the tree.',
        code: {
          code: `// ❌ Prop drilling\n<Page user={user} />\n  -> <Header user={user} />\n    -> <Avatar user={user} />\n      -> <UserBadge user={user} />\n\n// ✅ Context\n<UserProvider value={user}>\n  <Page />\n    -> <Header />\n      -> <Avatar />\n        -> <UserBadge /> // useContext(UserContext)`,
          language: 'tsx',
          title: 'Before vs after Context',
        },
      },
      {
        id: 'provider-memoization',
        title: 'Provider Value Memoization',
        content:
          'Every time a Provider component re-renders, its value prop is recreated. This causes all ' +
          'consumers to re-render, even if the value hasn\'t semantically changed. Use useMemo to ' +
          'stabilize the provider value.',
        code: {
          code: `// ❌ New object every render -> all consumers re-render\n<UserProvider value={{ name, email }}>\n  <App />\n</UserProvider>\n\n// ✅ Stable reference with useMemo\nconst value = useMemo(() => ({ name, email }), [name, email])\n<UserProvider value={value}>\n  <App />\n</UserProvider>`,
          language: 'tsx',
          title: 'Stabilizing provider value',
        },
      },
      {
        id: 'when-to-use',
        title: 'When to Use',
        content:
          'Use context for truly global concerns: theme, locale, auth state, user preferences. ' +
          'Do not use context as a replacement for component composition or prop threading in small ' +
          'component trees. Context is not a state management tool — it is a dependency injection ' +
          'mechanism. Pair it with useReducer when you need to manage the state that lives in context.',
      },
    ],
    practices: [
      {
        id: 'useContext-memoize-value',
        title: 'Always Memoize Provider Values',
        description:
          'Wrap provider values in useMemo to prevent unnecessary consumer re-renders. ' +
          'This is especially important when the value is an object or array.',
        code: {
          code: `const value = useMemo(() => ({ theme, toggleTheme }), [theme])`,
          language: 'tsx',
        },
      },
      {
        id: 'useContext-split-contexts',
        title: 'Split Large Contexts',
        description:
          'If a context holds unrelated values, split it into multiple smaller contexts. ' +
          'This prevents components from re-rendering when unrelated data changes.',
        code: {
          code: `// ❌ One giant context\nconst AppContext = createContext({ theme, user, notifications })\n\n// ✅ Separate concerns\nconst ThemeContext = createContext(theme)\nconst UserContext = createContext(user)\nconst NotificationContext = createContext(notifications)`,
          language: 'tsx',
          title: 'Split by concern',
        },
      },
      {
        id: 'useContext-composition',
        title: 'Prefer Composition First',
        description:
          'Before reaching for context, consider if component composition (passing components as ' +
          'props or children) can solve the problem. Composition is simpler, more explicit, and ' +
          'does not introduce coupling to a context.',
      },
      {
        id: 'useContext-custom-hook',
        title: 'Wrap in a Custom Hook',
        description:
          'Always expose context through a custom hook with a guard. This provides a clean API ' +
          'and an early error if the hook is used outside a provider.',
        code: {
          code: `function useTheme() {\n  const context = useContext(ThemeContext)\n  if (!context) {\n    throw new Error('useTheme must be used within ThemeProvider')\n  }\n  return context\n}`,
          language: 'tsx',
          title: 'Guarded custom hook pattern',
        },
      },
    ],
    mistakes: [
      {
        id: 'useContext-high-frequency',
        title: 'Using Context for High-Frequency Updates',
        description:
          'Context re-renders all consumers when the value changes. This makes it unsuitable ' +
          'for state that updates frequently (e.g., form inputs, animations, mouse position).',
        problem:
          'Every keystroke or animation frame will re-render the entire consumer subtree, causing ' +
          'jank and performance degradation.',
        solution:
          'For high-frequency updates, use local state, refs, or a dedicated state management library ' +
          'with fine-grained subscriptions (e.g., Zustand, Jotai, useSyncExternalStore).',
      },
      {
        id: 'useContext-overusing',
        title: 'Overusing Context for All State',
        description:
          'Putting all application state into a single context or using context for every piece ' +
          'of shared data leads to a monolithic, tightly coupled architecture.',
        problem:
          'Any state change triggers re-renders in unrelated parts of the tree. Refactoring becomes ' +
          'difficult because components are implicitly coupled through the context.',
        solution:
          'Be selective. Use context only for truly global concerns. For feature-specific shared state, ' +
          'consider composition or lifting state to the nearest common ancestor.',
      },
      {
        id: 'useContext-default-wrong',
        title: 'Assuming Default Value Is the Provider Value',
        description:
          'The default value passed to createContext is only used when a component is NOT wrapped ' +
          'in a Provider. Many developers accidentally consume the default value instead of the ' +
          'provided value because they forgot to wrap the tree.',
        problem: 'Silent bugs where components use fallback values instead of real provided values.',
        solution:
          'Always wrap root components in the appropriate Providers. Use the guarded custom hook ' +
          'pattern to throw an error when context is accessed outside a Provider. Use null as the ' +
          'default value for providers that must be wrapped.',
        code: {
          code: `// ❌ Silent fallback\nconst ThemeContext = createContext('light')\n\n// ✅ Guard forces correct usage\nconst ThemeContext = createContext<ThemeContextValue | null>(null)\n\nfunction useTheme() {\n  const ctx = useContext(ThemeContext)\n  if (!ctx) throw new Error('Missing ThemeProvider')\n  return ctx\n}`,
          language: 'tsx',
        },
      },
    ],
  },
]