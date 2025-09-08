"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  User, 
  BarChart3, 
  Heart, 
  Activity
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Cohort View", href: "/cohort", icon: Users },
  { name: "Patients", href: "/patients", icon: User },
  { name: "Analytics", href: "/analytics", icon: Activity },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-sidebar-border">
          <Heart className="h-8 w-8 text-chart-1 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">WellDoc</h1>
            <p className="text-sm text-muted-foreground">Risk Prediction Engine</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                asChild
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">Dr. Sarah Wilson</p>
              <p className="text-xs text-muted-foreground">Attending Physician</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
