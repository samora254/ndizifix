'use client'

import * as React from 'react'
import { View, type ViewProps } from 'react-native'

import { cn } from '@/lib/utils'

interface ProgressProps extends ViewProps {
  value?: number
}

function Progress({
  className,
  value,
  ...props
}: ProgressProps) {
  return (
    <View
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <View
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: [{ translateX: `${-(100 - (value || 0))}%` }] }}
      />
    </View>
  )
}

export { Progress }
