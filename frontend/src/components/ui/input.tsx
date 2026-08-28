import * as React from "react"

import { cn } from "@/lib/utils"

interface Variants {
  variant?: 'default' | 'inline'
}

function Input({ className, type, variant = 'default', ...props }: React.ComponentProps<"input"> & Variants) {
  const baseClassNames = variant === 'default'
    ? cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary-dark selection:text-primary-foreground dark:bg-input/50 border-input h-9 w-full min-w-0 rounded-md border bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-primary-light focus-visible:ring-primary-light/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      className
    )
    : cn(
      "rounded-none border-b border-t-0 border-x-0 px-0 focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-indigo-600 aria-invalid:ring-0 aria-invalid:border-x-0 aria-invalid:border-t-0 aria-invalid:border-b-destructive transition-all outline-none",
      className
    )

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        baseClassNames,
        className
      )}
      {...props}
    />
  )
}

export { Input }

