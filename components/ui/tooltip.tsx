'use client'

import * as React from 'react'
import { View, Text, type ViewProps } from 'react-native'

import { cn } from '@/lib/utils'

interface TooltipProviderProps {
  delayDuration?: number
  children: React.ReactNode
}

function TooltipProvider({
  delayDuration = 0,
  children,
  ...props
}: TooltipProviderProps) {
  return <>{children}</>
}

interface TooltipProps {
  children: React.ReactNode
}

function Tooltip({ children }: TooltipProps) {
  return <>{children}</>
}

function TooltipTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>
}

interface TooltipContentProps extends ViewProps {
  sideOffset?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  hidden?: boolean
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <View
      className={cn(
        'bg-foreground z-50 rounded-md px-3 py-1.5',
        className,
      )}
      {...props}
    >
      <Text className="text-background text-xs">{children}</Text>
    </View>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
