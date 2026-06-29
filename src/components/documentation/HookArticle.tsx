import type { HookData } from '../../types'
import { CodeBlock } from './CodeBlock'
import { PracticeCard } from './PracticeCard'
import { MistakeCard } from './MistakeCard'

interface HookArticleProps {
  data: HookData
  demoComponent: React.ReactNode
}

export function HookArticle({ data, demoComponent }: HookArticleProps) {
  return (
    <article className="hook-article">
      <header className="hook-header">
        <h1 className="hook-title" style={{ color: data.color }}>
          {data.title}
        </h1>
        <div className="hook-subtitle" style={{ color: data.color }}>
          {data.subtitle}
        </div>
        <p className="hook-description">{data.description}</p>
      </header>

      <div className="hook-overview">{data.overview}</div>

      {data.sections.map((section) => (
        <section key={section.id} className="section" id={section.id}>
          <h2>{section.title}</h2>
          <p className="section-content">{section.content}</p>
          {section.code && <CodeBlock snippet={section.code} />}
        </section>
      ))}

      <hr className="section-divider" />

      {demoComponent && (
        <section className="demo-section">
          <h2>Interactive Demo</h2>
          {demoComponent}
        </section>
      )}

      <hr className="section-divider" />

      <section className="practices-section">
        <h2>Best Practices</h2>
        {data.practices.map((practice) => (
          <PracticeCard key={practice.id} practice={practice} />
        ))}
      </section>

      <hr className="section-divider" />

      <section className="mistakes-section">
        <h2>Common Mistakes</h2>
        {data.mistakes.map((mistake) => (
          <MistakeCard key={mistake.id} mistake={mistake} />
        ))}
      </section>
    </article>
  )
}