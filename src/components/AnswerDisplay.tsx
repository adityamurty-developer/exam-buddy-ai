import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface AnswerDisplayProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function AnswerDisplay({ content, isStreaming, className }: AnswerDisplayProps) {
  if (!content) return null;

  return (
    <div className={cn("prose prose-slate max-w-none", className)}>
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-lg font-display font-semibold text-foreground mt-6 mb-3 pb-2 border-b border-border">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-display font-semibold text-foreground mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed mb-3">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-4 text-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-4 text-foreground">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-foreground">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-primary">{children}</strong>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm">
                  <code className="text-foreground">{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-secondary-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm whitespace-pre">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-1" />
      )}
    </div>
  );
}
