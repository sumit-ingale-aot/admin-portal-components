"use client"

import { ReactNode } from "react"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "../../components/ui/sidebar"
import { Actions, AppSidebar, SidebarNavGroup } from "./app-sidebar";
import { TooltipProvider } from "../ui/tooltip";

interface Props {
    children: ReactNode;
    groups: SidebarNavGroup[];
    roles: string[];
    actions: Actions[];
    user: {
        name: string
        email: string,
        profile?: string;
    },
    logo: string;
}

const DashboardLayout = ({ children, groups, roles, actions, user, logo }: Props) => {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar
                    actions={actions}
                    user={user}
                    logo={logo}
                    groups={groups}
                    roles={roles}
                />

                <SidebarInset>
                    <div className="flex h-screen flex-col overflow-hidden">
                        <header className="flex h-16 p-3 items-center border-b">
                            <SidebarTrigger />
                        </header>
                        <main className="flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default DashboardLayout
