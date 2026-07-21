import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarMenuButton } from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChevronDown } from "lucide-react"
import { Actions } from "./app-sidebar"
import { cn } from "../../lib/utils"

export interface UserDropdownProps {
    user: {
        name: string
        email: string
        profile?: string
    }
    actions: Actions[]
    className?: string
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    isSidebar?: boolean
    userNameClassName?: string
    userEmailClassName?: string
    avatarClassName?: string
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function UserDropdown({ 
    user, 
    actions, 
    className, 
    side = "top", 
    align = "center", 
    isSidebar = false,
    userNameClassName,
    userEmailClassName,
    avatarClassName
}: UserDropdownProps) {
    const triggerContent = (
        <>
            <Avatar className={cn("size-6", avatarClassName)}>
                <AvatarImage
                    src={user?.profile}
                    alt={user?.name || "User"}
                    className="grayscale"
                />
                <AvatarFallback className="text-xs">
                    {initials(user?.name || "User")}
                </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-col leading-none text-left">
                <span className={cn("truncate text-sm font-medium", userNameClassName)}>
                    {user?.name}
                </span>

                <span className={cn("truncate text-xs opacity-70", userEmailClassName)}>
                    {user?.email}
                </span>
            </div>

            <ChevronDown className="ml-auto size-4 shrink-0 opacity-70" />
        </>
    )

    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                {isSidebar ? (
                    <SidebarMenuButton className={cn("h-10", className)}>
                        {triggerContent}
                    </SidebarMenuButton>
                ) : (
                    <button className={cn("flex items-center gap-2 h-10 px-2 rounded-md transition-colors hover:bg-black/10 dark:hover:bg-white/10 outline-none w-full", className)}>
                        {triggerContent}
                    </button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side={side}
                align={align}
                className="w-[--radix-popper-anchor-width]"
            >
                {actions.map((action, idx) => {
                    const Icon = action.icon
                    return (
                        <DropdownMenuItem key={idx} onClick={action.action} className={`${action?.className ? action.className : ""} cursor-pointer`}>
                            <Icon className="mr-2 size-4" />
                            {action.name}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
