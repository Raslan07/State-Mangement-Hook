import { useTheme } from '../../hooks/useTheme'

function DeepChild() {
  const { state, dispatch } = useTheme()

  return (
    <div className="context-demo-box" style={{ borderColor: 'var(--color-use-context)' }}>
      <div className="context-demo-label">Level 3 — Deep Child</div>
      <div className="context-demo-value">
        Theme: {state.theme} (accessed via useContext — no props!)
      </div>
      <div style={{ marginTop: 'var(--space-sm)' }}>
        <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
          Toggle Theme (from Level 3)
        </button>
      </div>
    </div>
  )
}

function Child() {
  const { state } = useTheme()

  return (
    <div className="context-demo-box" style={{ borderColor: 'var(--color-use-context)' }}>
      <div className="context-demo-label">Level 2 — Child</div>
      <div className="context-demo-value">
        Current theme: {state.theme} (received via context, not props)
      </div>
      <div className="context-nested">
        <DeepChild />
      </div>
    </div>
  )
}

export function UseContextDemo() {
  const { state } = useTheme()

  return (
    <div className="demo-container">
      <h3 className="demo-title">Context Demo — Solving Prop Drilling</h3>

      <p style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
        Each nested level accesses the theme context directly — no props are passed through
        intermediate components.
      </p>

      <div className="context-demo-box" style={{ borderColor: 'var(--color-use-context)' }}>
        <div className="context-demo-label">Level 1 — Parent (ThemeProvider)</div>
        <div className="context-demo-value">
          Theme is: <strong>{state.theme}</strong>
        </div>
        <div className="context-nested">
          <Child />
        </div>
      </div>
    </div>
  )
}