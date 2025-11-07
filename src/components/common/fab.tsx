'use client'

import React, { ReactNode } from 'react'
import Button, { ButtonProps } from './button'
import cn from '../../lib/cn'
import { Plus } from 'lucide-react'

interface FabProps
  extends Omit<
    ButtonProps,
    'variant' | 'size' | 'as' | 'widthFull' | 'leftIcon' | 'rightIcon' | 'isLoading'
  > {
  icon?: ReactNode
  children?: never
}

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(({ className, icon, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="destructive"
      size="icon"
      className={cn(
        'fixed bottom-8 right-8',
        'h-14 w-14',
        'rounded-3xl',
        'shadow-lg',
        'animate-pulse-glow',
        'transition-all duration-200 ease-in-out',
        'hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {icon || <Plus className="h-6 w-6" strokeWidth={2.5} />}
    </Button>
  )
})

Fab.displayName = 'Fab'

export default Fab
