import type { Practice } from '../../types'
import { CodeBlock } from './CodeBlock'

interface PracticeCardProps {
  practice: Practice
}

export function PracticeCard({ practice }: PracticeCardProps) {
  return (
    <article className="practice-card">
      <h3 className="practice-card-title">{practice.title}</h3>
      <p className="practice-card-desc">{practice.description}</p>
      {practice.code && <CodeBlock snippet={practice.code} />}
    </article>
  )
}