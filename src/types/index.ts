export type HookId = 'useState' | 'useReducer' | 'useContext'

export interface CodeSnippet {
  code: string
  language: string
  title?: string
}

export interface Practice {
  id: string
  title: string
  description: string
  code?: CodeSnippet
}

export interface Mistake {
  id: string
  title: string
  description: string
  problem: string
  solution: string
  code?: CodeSnippet
}

export interface Section {
  id: string
  title: string
  content: string
  code?: CodeSnippet
}

export interface HookData {
  id: HookId
  title: string
  subtitle: string
  color: string
  description: string
  overview: string
  sections: Section[]
  practices: Practice[]
  mistakes: Mistake[]
}

export type Theme = 'light' | 'dark'

export interface ThemeState {
  theme: Theme
}

export type ThemeAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: Theme }

export interface ThemeContextValue {
  state: ThemeState
  dispatch: React.Dispatch<ThemeAction>
}
