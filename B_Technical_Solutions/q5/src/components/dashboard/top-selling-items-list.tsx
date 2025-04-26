"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MenuItem {
    name: string
    category: string
    count: number
    percentage: number
}

export default function TopSellingItemsList() {
    const [items, setItems] = useState<MenuItem[]>([
        { name: "Cappuccino", category: "beverage", count: 42, percentage: 85 },
        { name: "Avocado Toast", category: "main", count: 38, percentage: 76 },
        { name: "Latte", category: "beverage", count: 35, percentage: 70 },
        { name: "Croissant", category: "appetizer", count: 30, percentage: 60 },
        { name: "Eggs Benedict", category: "main", count: 28, percentage: 56 },
    ])

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setItems((prev) => {
                return prev
                    .map((item) => {
                        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
                        const newCount = Math.max(1, item.count + change)
                        return {
                            ...item,
                            count: newCount,
                            percentage: Math.min(100, Math.floor(newCount / 0.5)),
                        }
                    })
                    .sort((a, b) => b.count - a.count)
            })
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "beverage":
                return "text-blue-600"
            case "appetizer":
                return "text-amber-600"
            case "main":
                return "text-green-600"
            case "dessert":
                return "text-purple-600"
            default:
                return "text-gray-600"
        }
    }

    const getProgressColor = (category: string) => {
        switch (category) {
            case "beverage":
                return "bg-blue-600"
            case "appetizer":
                return "bg-amber-600"
            case "main":
                return "bg-green-600"
            case "dessert":
                return "bg-purple-600"
            default:
                return "bg-gray-600"
        }
    }

    return (
        <div className="space-y-6">
            {items.map((item, index) => (
                <div key={index} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-medium">{item.name}</span>
                            <span
                                className={cn(
                                    "text-xs ml-2 px-1.5 py-0.5 rounded-full",
                                    getCategoryColor(item.category),
                                    `bg-${item.category === "beverage" ? "blue" : item.category === "appetizer" ? "amber" : item.category === "main" ? "green" : "purple"}-50`,
                                )}
                            >
                                {item.category}
                            </span>
                        </div>
                        <span className="text-sm font-medium">{item.count} orders</span>
                    </div>
                    <Progress
                        value={item.percentage}
                        className="h-2 bg-gray-100 group-hover:h-3 transition-all"
                    />
                </div>
            ))}
        </div>
    )
}
