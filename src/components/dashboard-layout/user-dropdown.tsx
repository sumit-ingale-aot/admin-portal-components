import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarMenuButton } from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChevronDown } from "lucide-react"
import { Actions } from "./app-sidebar"

export interface UserDropdownProps {
    user: {
        name: string
        email: string
        profile?: string
    }
    actions: Actions[]
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function UserDropdown({ user, actions }: UserDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10">
                    <Avatar className="size-6">
                        <AvatarImage
                            src={user?.profile}
                            alt={user?.name || "User"}
                            className="grayscale"
                        />
                        <AvatarFallback className="text-xs">
                            {initials(user?.name || "User")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-col leading-none">
                        <span className="truncate text-sm font-medium">
                            {user?.name}
                        </span>

                        <span className="truncate text-xs text-muted-foreground">
                            {user?.email}
                        </span>
                    </div>

                    <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side="top"
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
