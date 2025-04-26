"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PerformanceMetrics() {
    const [avgTime, setAvgTime] = useState(18)
    const [isUpdating, setIsUpdating] = useState(false)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
            if (avgTime + change > 0) {
                setIsUpdating(true)
                setAvgTime((prev) => Math.max(1, prev + change))
                setTimeout(() => setIsUpdating(false), 500)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [avgTime])

    return (
        <div className="stat-card group">
            <CardHeader className="stat-card-header bg-gradient-to-r from-blue-500 to-indigo-600 pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5" />
                    Avg. Fulfillment Time
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "text-3xl font-bold transition-all duration-500",
                            isUpdating ? "text-blue-600 scale-110" : "text-blue-800",
                        )}
                    >
                        {avgTime} min
                    </div>
                    <div className="text-sm text-muted-foreground bg-blue-50 px-2 py-1 rounded-full">Last hour</div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </CardContent>
        </div>
    )
}
