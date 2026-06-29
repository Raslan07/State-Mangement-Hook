import type { Mistake } from '../../types'
import { CodeBlock } from './CodeBlock'

interface MistakeCardProps {
  mistake: Mistake
}

export function MistakeCard({ mistake }: MistakeCardProps) {
  return (
    <article className="mistake-card">
      <h3 className="mistake-card-title">{mistake.title}</h3>
      <p className="mistake-card-desc">{mistake.description}</p>
      <div className="mistake-card-problem">
        <strong>Problem:</strong> {mistake.problem}
      </div>
      <div className="mistake-card-solution">
        <strong>Solution:</strong> {mistake.solution}
      </div>
      {mistake.code && <CodeBlock snippet={mistake.code} />}
    </article>
  )
}