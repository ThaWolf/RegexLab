import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}

export default function MDXProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
