"use client"

import { useEffect, useState } from "react"
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  title: string
  level: number // 1 for main headings, 2 for subheadings
}

interface TableOfContentsProps {
  items?: TOCItem[]
  className?: string
  defaultCollapsed?: boolean
  onToggle?: (collapsed: boolean) => void
}

export function TableOfContents({ 
  items, 
  className,
  defaultCollapsed = false,
  onToggle
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [tocItems, setTocItems] = useState<TOCItem[]>(items || [])
  
  // Notify parent of toggle state changes
  useEffect(() => {
    onToggle?.(isCollapsed)
  }, [isCollapsed, onToggle])

  // Auto-detect headings from the page if items not provided
  useEffect(() => {
    if (items && items.length > 0) {
      setTocItems(items)
      return
    }

    // Auto-detect headings from the DOM
    const headings = document.querySelectorAll('h1, h2, h3, [data-toc-title]')
    const detectedItems: TOCItem[] = []

    headings.forEach((heading) => {
      const title = heading.getAttribute('data-toc-title') || heading.textContent || ""
      if (!title || title.trim() === "") return

      // Skip if this heading is inside the TOC itself
      if (heading.closest('[data-toc-container]')) return

      let id = heading.id
      if (!id) {
        // Generate ID from title if not present
        id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        heading.id = id
      }

      const tagName = heading.tagName.toLowerCase()
      let level = 1
      if (tagName === 'h2' || heading.getAttribute('data-toc-level') === '2') {
        level = 2
      } else if (tagName === 'h3' || heading.getAttribute('data-toc-level') === '3') {
        level = 3
      }

      detectedItems.push({ id, title, level })
    })

    setTocItems(detectedItems)
  }, [items])

  // Track active section based on scroll position
  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -35% 0px" }
    )

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [tocItems])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -120 // Offset for fixed headers (TopNav 64px + SecondaryNav ~56px)
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <div
      data-toc-container
      className={cn(
        "fixed top-[7.5rem] left-4 z-30 transition-all duration-300",
        isCollapsed ? "w-12" : "w-64",
        className
      )}
    >
      <div className="rounded-lg border bg-card shadow-lg">
        <div className="flex items-center justify-between p-3 border-b">
          {!isCollapsed && (
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Contents
            </h3>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("h-8 w-8 p-0", isCollapsed && "mx-auto")}
            aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <ScrollArea className="h-[calc(100vh-12rem)] max-h-[600px]">
            <div className="p-3 space-y-1">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full text-left text-sm py-2 px-3 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    item.level === 2 && "pl-6",
                    item.level === 3 && "pl-9",
                    activeId === item.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
