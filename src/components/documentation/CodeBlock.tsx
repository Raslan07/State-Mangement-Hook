import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import type { CodeSnippet } from '../../types'

interface CodeBlockProps {
  snippet: CodeSnippet
}

export function CodeBlock({ snippet }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current)
    }
  }, [snippet.code])

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{snippet.title ?? 'Code example'}</span>
        <span className="code-block-language">{snippet.language}</span>
      </div>
      <pre>
        <code ref={codeRef} className={`language-${snippet.language}`}>
          {snippet.code}
        </code>
      </pre>
    </div>
  )
}