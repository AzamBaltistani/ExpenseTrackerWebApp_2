import { Calendar, Home, Inbox, Search } from "lucide-react";
import { Link } from "react-router";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/ExpenseTrackerWebApp_2/",
        icon: Home,
    },
    {
        title: "Incomes",
        url: "/incomes",
        icon: Calendar,
    },
    {
        title: "Expenses",
        url: "/expenses",
        icon: Inbox,
    },
    {
        title: "Search and Filter",
        url: "/search",
        icon: Search,
    }
]

function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="">Expense Tracker</SidebarGroupLabel>
                    <SidebarSeparator className="mt-1" />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar