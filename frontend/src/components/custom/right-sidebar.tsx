import { RightSidebarTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { useRightSidebar } from "@/contexts/RightSidebarContext"
import { LayoutDashboard, Plus } from "lucide-react"
import React from 'react'

type Props = {}

function RightSidebar({ }: Props) {
    const { content } = useRightSidebar()

    return (
        <Sidebar collapsible="icon" side='right'>
            <SidebarHeader className="border-sidebar-border mt-14">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <RightSidebarTrigger />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {content}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Plus />
                            <span>New Calendar</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default RightSidebar