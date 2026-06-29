import { useState } from 'react'
import type { HookId } from './types'
import { hooksData } from './data/hooksData'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/layout/Layout'
import { HookArticle } from './components/documentation/HookArticle'
import { UseStateDemo } from './components/demos/UseStateDemo'
import { UseReducerDemo } from './components/demos/UseReducerDemo'
import { UseContextDemo } from './components/demos/UseContextDemo'

const demos: Record<HookId, React.ComponentType> = {
  useState: UseStateDemo,
  useReducer: UseReducerDemo,
  useContext: UseContextDemo,
}

function WelcomePage() {
  return (
    <div className="welcome">
      <h1>React Hooks Masterclass</h1>
      <p className="welcome-subtitle">
        A comprehensive, interactive guide to React's three foundational hooks:
        useState, useReducer, and useContext. Learn through theory, code examples,
        and live interactive demos.
      </p>
      <div className="welcome-cards">
        <div className="welcome-card" style={{ borderTop: '4px solid var(--color-use-state)' }}>
          <div className="welcome-card-title" style={{ color: 'var(--color-use-state)' }}>
            useState
          </div>
          <div className="welcome-card-desc">
            Local component state, functional updates, lazy initialization, and the rendering lifecycle.
          </div>
        </div>
        <div className="welcome-card" style={{ borderTop: '4px solid var(--color-use-reducer)' }}>
          <div className="welcome-card-title" style={{ color: 'var(--color-use-reducer)' }}>
            useReducer
          </div>
          <div className="welcome-card-desc">
            Complex state logic, pure reducers, discriminated union actions, and state machines.
          </div>
        </div>
        <div className="welcome-card" style={{ borderTop: '4px solid var(--color-use-context)' }}>
          <div className="welcome-card-title" style={{ color: 'var(--color-use-context)' }}>
            useContext
          </div>
          <div className="welcome-card-desc">
            Dependency injection, prop drilling solutions, provider memoization, and context best practices.
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState<HookId | 'welcome'>('welcome')

  function renderContent() {
    if (activePage === 'welcome') {
      return <WelcomePage />
    }

    const data = hooksData.find((h) => h.id === activePage)
    if (!data) return null

    const DemoComponent = demos[activePage]

    return (
      <HookArticle
        data={data}
        demoComponent={<DemoComponent />}
      />
    )
  }

  return (
    <ThemeProvider>
      <Layout activePage={activePage} onNavigate={setActivePage}>
        {renderContent()}
      </Layout>
    </ThemeProvider>
  )
}

export default App