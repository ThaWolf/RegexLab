import type { InputHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-text-primary-light dark:text-text-primary-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark ring-offset-background-light dark:ring-offset-background-dark transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 focus-visible:border-primary-500 dark:focus-visible:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-modern",
        className
      )}
      {...props}
    />
  )
}
