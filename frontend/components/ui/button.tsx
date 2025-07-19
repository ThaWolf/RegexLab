import { cva, type VariantProps } from "class-variance-authority"
import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-modern hover:shadow-modern-md transform hover:scale-105 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        primary: "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-modern hover:shadow-modern-md transform hover:scale-105 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-modern hover:shadow-modern-md transform hover:scale-105 focus-visible:ring-secondary-500 dark:focus-visible:ring-secondary-400",
        accent: "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-modern hover:shadow-modern-md transform hover:scale-105 focus-visible:ring-accent-500 dark:focus-visible:ring-accent-400",
        outline: "border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-modern hover:shadow-modern-md transform hover:scale-105 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        ghost: "text-text-primary-light dark:text-text-primary-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 py-3 text-base",
        xl: "h-14 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
