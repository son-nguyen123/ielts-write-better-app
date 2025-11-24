import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface MarkdownProps {
  content: string
  className?: string
}

/**
 * Component for rendering markdown content from AI responses
 * Handles bold (**text**), italic (*text*), lists, and other markdown formatting
 */
export function Markdown({ content, className = "" }: MarkdownProps) {
  // Custom components for styling markdown elements
  const components: Components = {
    // Style paragraphs
    p: ({ children }) => (
      <p className="mb-2 last:mb-0">{children}</p>
    ),
    // Style strong/bold text
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    // Style emphasis/italic text
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    // Style unordered lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
    ),
    // Style ordered lists
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
    ),
    // Style list items
    li: ({ children }) => (
      <li className="ml-2">{children}</li>
    ),
    // Style headings
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold mb-2 mt-2 first:mt-0">{children}</h3>
    ),
    // Style code blocks
    code: ({ children, className }) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
      ) : (
        <code className="block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">{children}</code>
      )
    },
    // Style blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2 text-muted-foreground">
        {children}
      </blockquote>
    ),
  }

  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
