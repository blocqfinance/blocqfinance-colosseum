"use client"

import Image from "next/image"
import { cn } from "./utils"

interface BlocqSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}


// Alternative pulse animation version
export function BlocqSpinnerPulse({ size = "xl", className }: BlocqSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative animate-pulse", sizeClasses[size])}>
        <Image src="/Brand.svg" alt="Loading..." fill className="object-contain" priority />
      </div>
    </div>
  )
}

