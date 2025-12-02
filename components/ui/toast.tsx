'use client'

import * as React from 'react'
import { View, Text, Pressable, type ViewProps, type TextProps } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

const ToastViewport = React.forwardRef<
  View,
  ViewProps
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg',
  {
    variants: {
      variant: {
        default: 'border bg-background',
        destructive: 'border-destructive bg-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ToastProps extends ViewProps, VariantProps<typeof toastVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<View, ToastProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Toast.displayName = 'Toast'

const ToastAction = React.forwardRef<
  View,
  ViewProps & { altText?: string }
>(({ className, ...props }, ref) => (
  <Pressable>
    <View
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3',
        className,
      )}
      {...props}
    />
  </Pressable>
))
ToastAction.displayName = 'ToastAction'

const ToastClose = React.forwardRef<
  View,
  ViewProps
>(({ className, ...props }, ref) => (
  <Pressable>
    <View
      ref={ref}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1',
        className,
      )}
      {...props}
    >
      <X className="h-4 w-4" />
    </View>
  </Pressable>
))
ToastClose.displayName = 'ToastClose'

const ToastTitle = React.forwardRef<
  Text,
  TextProps
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = React.forwardRef<
  Text,
  TextProps
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = 'ToastDescription'

type ToastPropsExport = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastPropsExport as ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
