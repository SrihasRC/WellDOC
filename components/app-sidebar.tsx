"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChartBar,
  IconDashboard,
  IconUsers,
  IconStethoscope,
  IconBrain,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
  {
    title: "Risk Prediction", 
    url: "/risk-prediction",
    icon: IconBrain,
  },
  {
    title: "Cohort View",
    url: "/cohort",
    icon: IconUsers,
  },
  {
    title: "Model Analytics",
    url: "/analytics",
    icon: IconChartBar,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: "", // No avatar
    role: user.role,
    department: user.department
  } : {
    name: "Guest User",
    email: "guest@welldoc.com",
    avatar: "",
    role: "Guest",
    department: "N/A"
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconStethoscope className="!size-5" />
                <span className="text-base font-semibold">WellDoc</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
