import { RightSidebarTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { useRightSidebar } from "@/contexts/RightSidebarContext"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import React from 'react'

function RightSidebar() {
    const { content, collapsible = 'icon', showTriggerButton = true } = useRightSidebar()

    return (
        <Sidebar collapsible={collapsible} side='right'>
            <SidebarHeader className={cn(
                "border-sidebar-border",
                showTriggerButton ? "mt-14" : "mt-10"
            )}>
                {showTriggerButton && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <RightSidebarTrigger />
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarHeader>
            {content}
        </Sidebar>
    )
}

export default RightSidebar