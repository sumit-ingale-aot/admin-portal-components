"use client"

import { ReactNode } from "react"

import {
    SidebarInset,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
} from "../../components/ui/sidebar"
import { Actions, AppSidebar, SidebarNavGroup } from "./app-sidebar";
import { TooltipProvider } from "../ui/tooltip";
import { UserDropdown } from "./user-dropdown";

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
    showActionsInFooter?: boolean
    headerClass?: string;
    sidebarHeaderClass?: string
    userNameClassName?: string
    userEmailClassName?: string
    avatarClassName?: string
}



const DashboardLayout = ({ 
    children, 
    groups, 
    roles, 
    actions, 
    user, 
    logo, 
    showActionsInFooter = false, 
    headerClass, 
    sidebarHeaderClass,
    userNameClassName,
    userEmailClassName,
    avatarClassName
}: Props) => {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar
                    showActionsInFooter={showActionsInFooter}
                    actions={actions}
                    user={user}
                    logo={logo}
                    groups={groups}
                    roles={roles}
                    sidebarHeaderClass={sidebarHeaderClass}
                    userNameClassName={userNameClassName}
                    userEmailClassName={userEmailClassName}
                    avatarClassName={avatarClassName}
                />

                <SidebarInset>
                    <div className="flex h-screen flex-col overflow-hidden">
                        <header className={`flex h-16 p-3 items-center justify-between border-b ${headerClass ? headerClass : ""}`}>
                            <SidebarTrigger />

                            {
                                !showActionsInFooter && (
                                    <UserDropdown
                                        user={user}
                                        actions={actions}
                                        className="w-fit max-w-[250px]"
                                        side="bottom"
                                        align="end"
                                        userNameClassName={userNameClassName}
                                        userEmailClassName={userEmailClassName}
                                        avatarClassName={avatarClassName}
                                    />
                                )
                            }

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
