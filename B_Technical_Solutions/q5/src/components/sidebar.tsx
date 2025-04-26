"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, ClipboardList, Coffee, Home, LayoutDashboard, Menu, Settings, Users, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const routes = [
        {
            name: "Dashboard",
            path: "/",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: "Orders",
            path: "/orders",
            icon: <ClipboardList className="h-5 w-5" />,
        },
        {
            name: "Tables",
            path: "/tables",
            icon: <Coffee className="h-5 w-5" />,
        },
        {
            name: "Menu",
            path: "/menu",
            icon: <Home className="h-5 w-5" />,
        },
        {
            name: "Staff",
            path: "/staff",
            icon: <Users className="h-5 w-5" />,
        },
        {
            name: "Reports",
            path: "/reports",
            icon: <BarChart3 className="h-5 w-5" />,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: <Settings className="h-5 w-5" />,
        },
    ]

    return (
        <>
            {/* Mobile Sidebar Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-amber-900">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-gradient-to-b from-amber-50 to-orange-50 p-0">
                    <div className="flex h-16 items-center border-b px-6">
                        <div className="flex items-center gap-2">
                            <Coffee className="h-6 w-6 text-amber-700" />
                            <span className="text-xl font-bold text-amber-900">Bistro 92</span>
                        </div>
                    </div>
                    <nav className="grid gap-1 p-4">
                        {routes.map((route) => (
                            <Link
                                key={route.path}
                                href={route.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-amber-900 transition-all hover:bg-amber-100",
                                    pathname === route.path ? "bg-amber-100 font-medium" : "text-amber-700",
                                )}
                            >
                                {route.icon}
                                {route.name}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden w-60 h-screen border-r bg-gradient-to-b from-amber-50 to-orange-50 md:block">
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-2">
                        <Coffee className="h-6 w-6 text-amber-700" />
                        <span className="text-xl font-bold text-amber-900">Bistro 92</span>
                    </div>
                </div>
                <nav className="grid gap-1 p-4">
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            href={route.path}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-amber-900 transition-all hover:bg-amber-100",
                                pathname === route.path ? "bg-amber-100 font-medium" : "text-amber-700",
                            )}
                        >
                            {route.icon}
                            {route.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    )
}
