import type { ReactNode } from 'react'
import type { HookId } from '../../types'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
  activePage: HookId | 'welcome'
  onNavigate: (page: HookId | 'welcome') => void
}

export function Layout({ children, activePage, onNavigate }: LayoutProps) {
  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="main-content">{children}</main>
    </div>
  )
}