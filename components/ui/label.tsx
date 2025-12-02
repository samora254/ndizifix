'use client'

import * as React from 'react'
import { Text, type TextProps } from 'react-native'

import { cn } from '@/lib/utils'

function Label({
  className,
  ...props
}: TextProps) {
  return (
    <Text
      className={cn(
        'text-sm leading-none font-medium select-none',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
