"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SalesMetrics() {
    const [todaySales, setTodaySales] = useState(2458.75)
    const [isUpdating, setIsUpdating] = useState(false)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.random() * 50
            setIsUpdating(true)
            setTodaySales((prev) => prev + change)
            setTimeout(() => setIsUpdating(false), 500)
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="stat-card group">
            <CardHeader className="stat-card-header bg-gradient-to-r from-green-500 to-emerald-600 pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5" />
                    Today&apos;s Sales
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "text-3xl font-bold transition-all duration-500",
                            isUpdating ? "text-green-600 scale-110" : "text-green-800",
                        )}
                    >
                        BDT {todaySales.toFixed(2)}
                    </div>
                    <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm">+12.5%</span>
                    </div>
                </div>
            </CardContent>
        </div>
    )
}
