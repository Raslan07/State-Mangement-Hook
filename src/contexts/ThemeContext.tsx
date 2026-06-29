import {
  useReducer,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import { ThemeContext } from './theme-context'
import type { ThemeState, ThemeAction } from '../types'

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { theme: state.theme === 'light' ? 'dark' : 'light' }
    case 'SET_THEME':
      return { theme: action.payload }
    default:
      return state
  }
}

const initialState: ThemeState = { theme: 'light' }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  useEffect(() => {
    document.documentElement.className =
      state.theme === 'dark' ? 'theme-dark' : 'theme-light'
  }, [state.theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
