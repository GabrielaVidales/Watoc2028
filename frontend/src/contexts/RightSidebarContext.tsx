import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface RightSidebarContextType {
    showTriggerButton: boolean
    setShowTriggerButton: (b: boolean) => void
    collapsible: "icon" | "none" | "offcanvas"
    setCollapsible: (value: "icon" | "none" | "offcanvas") => void
    defaultOpen: boolean
    setDefaultOpen: (b: boolean) => void
    width: string
    setWidth: (s: string) => void
    content: ReactNode | null
    setRightSidebarContent: (content: ReactNode | null) => void
    clearRightSidebarContent: () => void
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined)

export function RightSidebarProvider({ children }: { children: ReactNode }) {
    const [defaultOpen, setDefaultOpen] = useState(false)
    const [showTriggerButton, setShowTriggerButton] = useState(false)
    const [collapsible, setCollapsible] = useState<"icon" | "none" | "offcanvas">('icon')
    const [content, setContent] = useState<ReactNode | null>(null)
    const [width, setWidth] = useState<string>('20rem')

    const setRightSidebarContent = (newContent: ReactNode | null) => {
        setContent(newContent)
    }

    const clearRightSidebarContent = () => {
        setContent(null)
    }

    return (
        <RightSidebarContext.Provider
            value={{
                showTriggerButton,
                setShowTriggerButton,
                collapsible,
                setCollapsible,
                defaultOpen,
                setDefaultOpen,
                width,
                setWidth,
                content,
                setRightSidebarContent,
                clearRightSidebarContent,
            }}
        >
            {children}
        </RightSidebarContext.Provider>
    )
}

export function useRightSidebar() {
    const context = useContext(RightSidebarContext)
    if (!context) {
        throw new Error('useRightSidebar debe usarse dentro de RightSidebarProvider')
    }
    return context
}