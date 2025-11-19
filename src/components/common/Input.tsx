import * as React from 'react'
import cn from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: Size
  pill?: boolean // 둥근 캡슐
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      pill,
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? name
    const inputName = name

    const sizes: Record<Size, string> = {
      sm: 'h-9 text-sm px-3',
      md: 'h-10 text-base md:text-sm px-3',
      lg: 'h-12 text-base md:text-sm px-4',
    }

    const shape = pill ? 'rounded-full' : 'rounded-md'
    const iconPadding = (leftIcon ? ' pl-10' : '') + (rightIcon ? ' pr-10' : '')

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground/80">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground">
              {leftIcon}
            </span>
          )}
          {rightIcon && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground">
              {rightIcon}
            </span>
          )}

          <input
            id={inputId}
            name={inputName}
            ref={ref}
            className={cn(
              'w-full file:hidden outline-none placeholder:text-muted-foreground',
              'border border-input bg-background',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
              'disabled:cursor-not-allowed disabled:opacity-50',
              sizes[size],
              shape,
              iconPadding,
              className
            )}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error ?? helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
