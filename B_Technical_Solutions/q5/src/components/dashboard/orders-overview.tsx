"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OrdersOverview() {
    const [pendingOrders, setPendingOrders] = useState(12)
    const [isUpdating, setIsUpdating] = useState(false)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
            if (pendingOrders + change >= 0) {
                setIsUpdating(true)
                setPendingOrders((prev) => Math.max(0, prev + change))
                setTimeout(() => setIsUpdating(false), 500)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [pendingOrders])

    return (
        <div className="stat-card group">
            <CardHeader className="stat-card-header bg-gradient-to-r from-amber-500 to-amber-600 pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                    <ClipboardList className="h-5 w-5" />
                    Pending Orders
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "text-4xl font-bold transition-all duration-500",
                            isUpdating ? "text-amber-600 scale-110" : "text-amber-900",
                        )}
                    >
                        {pendingOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">Updated just now</div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-amber-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </CardContent>
        </div>
    )
}
