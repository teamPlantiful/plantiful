import { ComponentPropsWithRef, ReactNode } from 'react'
import { X } from 'lucide-react'
import cn from '@/lib/cn'

interface CardProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border bg-card text-card-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  left?: ReactNode
  right?: ReactNode
  closable?: boolean
  onClose?: () => void
}

export function CardHeader({
  className,
  children,
  left,
  right,
  closable,
  onClose,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-center justify-between p-6 text-card-foreground', className)}
      {...props}
    >
      {left && <div className="mr-4">{left}</div>}
      <div className="flex-1 min-w-0 whitespace-pre-line wrap-break-word hyphens-auto">
        {children}
      </div>
      {(right || closable) && (
        <div className="ml-4 flex items-center gap-2">
          {right}
          {closable && (
            <button
              type="button"
              onClick={onClose}
              tabIndex={-1}
              className="absolute cursor-pointer right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="닫기"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface CardContentProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}
