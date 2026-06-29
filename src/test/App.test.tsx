import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the welcome page by default', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /react hooks masterclass/i })
    ).toBeInTheDocument()
  })

  it('renders the sidebar with navigation links', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: /main navigation/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /welcome/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^useState$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^useReducer$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^useContext$/i })).toBeInTheDocument()
  })

  it('has a theme toggle button', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /switch to dark mode/i })
    ).toBeInTheDocument()
  })
})
