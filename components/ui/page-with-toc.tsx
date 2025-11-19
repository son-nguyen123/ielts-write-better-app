"use client"

import { useState, useCallback } from "react"
import { TableOfContents } from "./table-of-contents"
import { cn } from "@/lib/utils"

interface PageWithTOCProps {
  children: React.ReactNode
  className?: string
}

export function PageWithTOC({ children, className }: PageWithTOCProps) {
  const [isTOCCollapsed, setIsTOCCollapsed] = useState(false)

  const handleTOCToggle = useCallback((collapsed: boolean) => {
    setIsTOCCollapsed(collapsed)
  }, [])

  return (
    <>
      <TableOfContents onToggle={handleTOCToggle} />
      <div
        className={cn(
          "transition-all duration-300",
          // Add left margin when TOC is expanded, smaller margin when collapsed
          isTOCCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-72",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}
