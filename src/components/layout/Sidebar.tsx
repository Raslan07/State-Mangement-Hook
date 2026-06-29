import type { HookId } from '../../types'
import { useTheme } from '../../hooks/useTheme'

interface SidebarProps {
  activePage: HookId | 'welcome'
  onNavigate: (page: HookId | 'welcome') => void
}

const hookLinks: { id: HookId; label: string }[] = [
  { id: 'useState', label: 'useState' },
  { id: 'useReducer', label: 'useReducer' },
  { id: 'useContext', label: 'useContext' },
]

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { state, dispatch } = useTheme()

  function getActiveClass(id: HookId | 'welcome') {
    if (activePage !== id) return ''
    if (id === 'welcome') return 'active'
    return `active-${id}`
  }

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-title">React Masterclass</div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-link-welcome ${getActiveClass('welcome')}`}
          onClick={() => onNavigate('welcome')}
          aria-current={activePage === 'welcome' ? 'page' : undefined}
        >
          Welcome
        </button>

        {hookLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar-link ${getActiveClass(link.id)}`}
            onClick={() => onNavigate(link.id)}
            aria-current={activePage === link.id ? 'page' : undefined}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          aria-label={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </aside>
  )
}
