"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

type Props = {
  text: string;
  className?: string;
};

export function CardContent({ text, className }: Props) {
  return (
    <div className={`card-markdown ${className ?? ""}`}>
      <ReactMarkdown
        rehypePlugins={[
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          p: ({ children }) => (
            <p className="leading-relaxed mb-3 last:mb-0">{children}</p>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-foreground/[0.08] text-[0.88em] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-3 rounded-lg bg-black/40 dark:bg-black/60 p-3 overflow-x-auto text-xs leading-relaxed">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => (
            <h1 className="text-base font-semibold mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-semibold mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-medium mb-1.5">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-foreground/20 pl-3 italic text-foreground/80 my-2">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
