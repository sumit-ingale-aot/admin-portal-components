"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { UserDropdown } from "./user-dropdown"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../components/ui/collapsible"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "../../components/ui/sidebar"
import type { LucideIcon } from "lucide-react"



export interface Actions {
    name: string;
    icon: LucideIcon;
    action: () => void;
    className?: string
}

export interface SidebarNavItem {
    label: string
    href: string
    icon: LucideIcon

    badge?: string | number

    roles?: string[]

    children?: SidebarNavItem[]
}

export interface SidebarNavGroup {
    title: string
    items: SidebarNavItem[]
}

import {
    Building2,
    ChevronRight,
    LogOut,
} from "lucide-react"
import Image from "next/image"
import { cn } from "../../lib/utils"

// ───────────────────────────────────────────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────────────────────────────────────────

interface Workspace {
    id: string
    name: string
}

interface AppSidebarProps {
    roles: string[],
    showActionsInFooter: boolean;
    groups: SidebarNavGroup[]

    workspaces?: Workspace[]

    user: {
        name: string
        email: string;
        profile?: string
    },
    logo: string;
    actions: Actions[];
    sidebarHeaderClass?: string

}

// ───────────────────────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────────────────────

function hasAccess(
    itemRoles?: string[],
    userRoles: string[] = [],
): boolean {
    // Public item
    if (!itemRoles || itemRoles.length === 0) {
        return true
    }

    return itemRoles.some((role) =>
        userRoles.includes(role),
    )
}


/**
 * Recursively filters sidebar items based on user roles
 */
function filterItem(
    item: SidebarNavItem,
    roles: string[],
): SidebarNavItem | null {
    // User cannot access parent
    if (!hasAccess(item.roles, roles)) {
        return null
    }

    // Leaf node
    if (!item.children?.length) {
        return item
    }

    // Filter children recursively
    const visibleChildren = item.children
        .map((child) => filterItem(child, roles))
        .filter(Boolean) as SidebarNavItem[]

    return {
        ...item,
        children: visibleChildren,
    }
}

// ───────────────────────────────────────────────────────────────────────────────
// NAV ITEM
// ───────────────────────────────────────────────────────────────────────────────

function NavItem({
    item,
    roles,
}: {
    item: SidebarNavItem
    roles: string[]
}) {
    const pathname = usePathname()

    const isChildActive =
        item.children?.some((child) =>
            pathname === child.href || pathname.startsWith(`${child.href}/`),
        ) ?? false

    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

    const [open, setOpen] = useState(isChildActive)

    const Icon = item.icon

    // ───────────────────────────────────────────────────────────────────────────
    // PARENT ITEM WITH CHILDREN
    // ───────────────────────────────────────────────────────────────────────────

    if (item.children && item.children.length > 0) {
        return (
            <Collapsible
                open={open}
                onOpenChange={setOpen}
                asChild
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={isActive || isChildActive}
                            tooltip={item.label}
                            className={cn(
                                "w-full",
                                (isActive || isChildActive) &&
                                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            )}
                        >
                            <Icon className="size-4 shrink-0" />

                            <span className="flex-1 truncate">
                                {item.label}
                            </span>

                            {item.badge !== undefined && !open && (
                                <span className="mr-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                    {item.badge}
                                </span>
                            )}

                            <ChevronRight
                                className={`ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""
                                    }`}
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => {
                                const ChildIcon = child.icon

                                const childActive =
                                    pathname === child.href || pathname.startsWith(`${child.href}/`)

                                return (
                                    <SidebarMenuSubItem
                                        key={child.href}
                                    >
                                        <SidebarMenuSubButton
                                            asChild
                                            isActive={childActive}
                                            className={cn(
                                                childActive &&
                                                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                            )}
                                        >
                                            <Link href={child.href}>
                                                <ChildIcon className="size-3.5 shrink-0" />

                                                <span>
                                                    {child.label}
                                                </span>

                                                {child.badge !==
                                                    undefined && (
                                                        <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                                            {child.badge}
                                                        </span>
                                                    )}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )
                            })}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    // ───────────────────────────────────────────────────────────────────────────
    // LEAF ITEM
    // ───────────────────────────────────────────────────────────────────────────

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
                className={cn(
                    isActive &&
                    "bg-primary! text-primary-foreground! hover:bg-primary!/90 hover:text-primary-foreground!"
                )}
            >
                <Link href={item.href}>
                    <Icon className="size-4 shrink-0" />

                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>

            {item.badge !== undefined && (
                <SidebarMenuBadge>
                    {item.badge}
                </SidebarMenuBadge>
            )}
        </SidebarMenuItem>
    )
}

// ───────────────────────────────────────────────────────────────────────────────
// APP SIDEBAR
// ───────────────────────────────────────────────────────────────────────────────

export function AppSidebar({
    roles,
    groups,
    showActionsInFooter,
    user,
    logo,
    actions,
    sidebarHeaderClass
}: AppSidebarProps) {

    // Filter groups/items based on roles
    const visibleGroups = groups
        .map((group) => ({
            ...group,

            items: group.items
                .map((item) =>
                    filterItem(item, roles),
                )
                .filter(Boolean) as SidebarNavItem[],
        }))
        .filter((group) => group.items.length > 0)

    return (
        <Sidebar className=" border-r border-border !bg-transparent">
            {/* ─────────────────────────────────────────────────────────────── */}
            {/* WORKSPACE SWITCHER */}
            {/* ─────────────────────────────────────────────────────────────── */}

            <SidebarHeader className={`h-16 ${sidebarHeaderClass ? sidebarHeaderClass : ""}`}>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-center py-2">
                        <Image src={logo} width={120} height={50} alt="logo" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* SIDEBAR CONTENT */}
            {/* ─────────────────────────────────────────────────────────────── */}

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {visibleGroups.flatMap((group) => group.items).map((item) => (
                            <NavItem
                                key={item.href}
                                item={item}
                                roles={roles}
                            />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* USER FOOTER */}
            {/* ─────────────────────────────────────────────────────────────── */}

            {
                showActionsInFooter &&
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <UserDropdown user={user} actions={actions} isSidebar={true} />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            }
        </Sidebar>
    )
}