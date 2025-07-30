"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Brain, FileText, Home, Timer, Users, LogOut, PanelLeftClose, PanelLeft, FileUp } from "lucide-react"
import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  badge?: string;
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onCollapse?: (collapsed: boolean) => void;
}

export function DashboardNav({ className, onCollapse, ...props }: DashboardNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.(!isCollapsed);
  }

  const navSections: NavSection[] = [
    {
      title: "General",
      items: [
        {
          label: 'Home',
          icon: Home,
          href: '/home',
        },
        {
          label: 'Profile',
          icon: Users,
          href: '/profile',
        },
      ]
    },
    {
      title: "Study Tools", 
      items: [
        {
          label: 'Planner',
          icon: BookOpen,
          href: '/study-plan',
        },
        {
          label: 'Resources',
          icon: Brain,
          href: '/resources',
        },
        {
          label: 'Scriba',
          icon: FileUp,
          href: '/pdf',
        },
        {
          label: 'Timer',
          icon: Timer,
          href: '/timer',
        },
        {
          label: 'Notes',
          icon: FileText,
          href: '/notes',
        },
      ]
    },
    {
      title: "Account",
      items: [
        {
          label: 'Log out',
          icon: LogOut,
          href: '#',
          onClick: () => signOut({ callbackUrl: '/' })
        }
      ]
    }
  ]

  return (
    <nav 
      className={cn(
        "relative h-full overflow-y-auto transition-all duration-300",
        // Glass effect styling
        "bg-white/10 backdrop-blur-md border-r border-white/20",
        "shadow-xl shadow-black/20",
        isCollapsed ? "md:w-20" : "md:w-64",
        className
      )} 
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative px-3 py-2 text-white">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className={cn("mb-6", isCollapsed ? "px-2" : "px-4")}>
            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                  <AvatarImage 
                    src={session?.user?.image || "/images/default-avatar.png"} 
                    alt={session?.user?.name || '@user'} 
                  />
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {session?.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/30 shadow-sm" />
              </div>
              {!isCollapsed && session?.user?.name && (
                <p className="mt-3 text-sm font-medium text-center text-white/90 drop-shadow-sm">
                  Welcome, {session.user.name}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full flex items-center justify-center gap-2 text-white/80 hover:text-white",
                "hover:bg-white/10 border border-white/20 backdrop-blur-sm",
                "transition-all duration-200 shadow-sm",
                isCollapsed && "px-0"
              )}
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </Button>
          </div>
          
          {navSections.map((section, idx) => (
            <div key={section.title} className={cn(
              "py-2",
              idx !== 0 && "mt-6",
              isCollapsed && "px-0"
            )}>
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider drop-shadow-sm">
                  {section.title}
                </h3>
              )}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={item.onClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
                      "hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-[1.02]",
                      "border border-transparent hover:border-white/20",
                      pathname === item.href 
                        ? "text-white bg-white/20 backdrop-blur-sm border-white/30 shadow-lg scale-[1.02]" 
                        : "text-white/80 hover:text-white",
                      isCollapsed 
                        ? "justify-center px-2 py-3" 
                        : "px-4 py-3"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 drop-shadow-sm",
                      pathname === item.href ? "text-white" : "text-white/80"
                    )} />
                    {!isCollapsed && <span className="drop-shadow-sm">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto text-xs bg-purple-500/80 text-white px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-100">
          <div className="bg-black/30 backdrop-blur-md border-t border-white/20 shadow-2xl">
            <div className="flex justify-around items-center overflow-x-auto py-4 px-2">
              {navSections.flatMap(section => section.items).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 min-w-[70px] rounded-xl transition-all duration-200 ease-in-out z-1",
                    "hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105",
                    "border border-transparent hover:border-white/20",
                    pathname === item.href 
                      ? "text-white bg-white/20 backdrop-blur-sm border-white/30 shadow-lg scale-105" 
                      : "text-white/80 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 drop-shadow-sm" />
                  <span className="text-xs mt-1 font-medium drop-shadow-sm">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 text-xs bg-purple-500/80 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}