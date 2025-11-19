"use client"

import { useState, createContext, useContext } from "react"
import { TableOfContents } from "./table-of-contents"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  title: string
  level: number
}

interface PageWithTOCContextType {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const PageWithTOCContext = createContext<PageWithTOCContextType | null>(null)

export function usePageWithTOC() {
  const context = useContext(PageWithTOCContext)
  if (!context) {
    throw new Error("usePageWithTOC must be used within PageWithTOC")
  }
  return context
}

interface PageWithTOCProps {
  children: React.ReactNode
  tocItems?: TOCItem[]
  defaultCollapsed?: boolean
  className?: string
}

export function PageWithTOC({ 
  children, 
  tocItems,
  defaultCollapsed = false,
  className 
}: PageWithTOCProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <PageWithTOCContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen">
        {/* Sidebar - positioned on the left */}
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-300",
            isCollapsed ? "w-0" : "w-64"
          )}
        >
          <TableOfContents
            items={tocItems}
            defaultCollapsed={defaultCollapsed}
            onCollapsedChange={setIsCollapsed}
            variant="sidebar"
          />
        </div>

        {/* Main content area */}
        <div className={cn("flex-1 transition-all duration-300", className)}>
          {children}
        </div>
      </div>
    </PageWithTOCContext.Provider>
  )
}
