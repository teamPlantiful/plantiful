'use client'

import React, { ReactNode } from 'react'
import cn from '../../lib/cn'

const baseStyle =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive-outline' // 삭제하기 버튼용
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: React.ElementType

  widthFull?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      as: Comp = 'button',
      type,
      className,
      widthFull = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const computedClassName = cn(
      baseStyle,

      variant === 'default' &&
        'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer',
      variant === 'destructive' &&
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer',
      variant === 'outline' &&
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer',
      variant === 'secondary' &&
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground cursor-pointer',
      variant === 'link' && 'text-primary underline-offset-4 hover:underline cursor-pointer',
      variant === 'destructive-outline' &&
        'border border-destructive bg-background text-destructive hover:text-black hover:bg-destructive/10 cursor-pointer',

      size === 'default' && 'h-10 px-4 py-2',
      size === 'sm' && 'h-9 px-3',
      size === 'lg' && 'h-11 px-8 text-base', // lg 사이즈만 폰트 크기 확대
      size === 'icon' && 'h-10 w-10',

      widthFull && 'w-full',

      className
    )

    const Component = Comp as any

    return (
      <Component
        ref={ref}
        type={type ?? (Comp === 'button' ? 'button' : undefined)}
        className={computedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              role="status"
              aria-label="loading"
            />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export default Button
