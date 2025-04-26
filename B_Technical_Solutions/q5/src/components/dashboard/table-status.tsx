"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TableStatus() {
    const [occupiedTables, setOccupiedTables] = useState(8)
    const [totalTables, setTotalTables] = useState(12)
    const [isUpdating, setIsUpdating] = useState(false)

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
            if (occupiedTables + change >= 0 && occupiedTables + change <= totalTables) {
                setIsUpdating(true)
                setOccupiedTables((prev) => Math.max(0, Math.min(totalTables, prev + change)))
                setTimeout(() => setIsUpdating(false), 500)
            }
        }, 15000)

        return () => clearInterval(interval)
    }, [occupiedTables, totalTables])

    return (
        <div className="stat-card group">
            <CardHeader className="stat-card-header bg-gradient-to-r from-purple-500 to-violet-600 pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Coffee className="h-5 w-5" />
                    Table Status
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div
                        className={cn(
                            "text-3xl font-bold transition-all duration-500",
                            isUpdating ? "text-purple-600 scale-110" : "text-purple-900",
                        )}
                    >
                        {occupiedTables}/{totalTables}
                    </div>
                    <div className="text-sm text-muted-foreground bg-purple-50 px-2 py-1 rounded-full">Tables occupied</div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </CardContent>
        </div>
    )
}
