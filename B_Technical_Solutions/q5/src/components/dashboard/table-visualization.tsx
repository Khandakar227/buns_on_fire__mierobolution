"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Coffee, DollarSign, Users } from "lucide-react"

interface TableData {
    id: number
    tableNumber: string
    capacity: number
    isOccupied: boolean
    hasOrder: boolean
    isPaid: boolean
    orderTotal?: number
    lastOccupied?: Date
}

export default function TableVisualization() {
    const [tables, setTables] = useState<TableData[]>([])
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null)

    // Initialize tables with useEffect to avoid hydration mismatch
    useEffect(() => {
        // Generate dummy table data
        const dummyTables = Array.from({ length: 12 }, (_, i) => {
            const isOccupied = Math.random() > 0.3
            const hasOrder = isOccupied && Math.random() > 0.2
            const isPaid = hasOrder && Math.random() > 0.5

            const lastOccupied = new Date()
            lastOccupied.setHours(lastOccupied.getHours() - Math.floor(Math.random() * 5))

            return {
                id: i + 1,
                tableNumber: `Table ${i + 1}`,
                capacity: Math.floor(Math.random() * 4) + 2,
                isOccupied,
                hasOrder,
                isPaid,
                orderTotal: hasOrder ? Math.floor(Math.random() * 100) + 20 : undefined,
                lastOccupied: isOccupied ? undefined : lastOccupied,
            }
        })

        setTables(dummyTables)
    }, [])

    // Simulate real-time updates
    useEffect(() => {
        if (tables.length === 0) return

        const interval = setInterval(() => {
            setTables((prev) =>
                prev.map((table) => {
                    // 10% chance to change table status
                    if (Math.random() < 0.1) {
                        if (table.isOccupied) {
                            // 30% chance for occupied table to become free
                            if (Math.random() < 0.3) {
                                const lastOccupied = new Date()
                                return {
                                    ...table,
                                    isOccupied: false,
                                    hasOrder: false,
                                    isPaid: false,
                                    orderTotal: undefined,
                                    lastOccupied,
                                }
                            }
                            // 20% chance for occupied table to get an order
                            else if (!table.hasOrder && Math.random() < 0.2) {
                                return {
                                    ...table,
                                    hasOrder: true,
                                    orderTotal: Math.floor(Math.random() * 100) + 20,
                                }
                            }
                            // 40% chance for table with order to pay
                            else if (table.hasOrder && !table.isPaid && Math.random() < 0.4) {
                                return {
                                    ...table,
                                    isPaid: true,
                                }
                            }
                        } else {
                            // 20% chance for free table to become occupied
                            if (Math.random() < 0.2) {
                                return {
                                    ...table,
                                    isOccupied: true,
                                    lastOccupied: undefined,
                                }
                            }
                        }
                    }
                    return table
                }),
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [tables])

    const getTableStatusClass = (table: TableData) => {
        if (!table.isOccupied) return "bg-gray-100 border-gray-300 hover:bg-gray-200"
        if (table.isPaid) return "bg-green-100 border-green-300 hover:bg-green-200"
        if (table.hasOrder) return "bg-amber-100 border-amber-300 hover:bg-amber-200"
        return "bg-blue-100 border-blue-300 hover:bg-blue-200"
    }

    const getTableStatusText = (table: TableData) => {
        if (!table.isOccupied) return "Available"
        if (table.isPaid) return "Paid"
        if (table.hasOrder) return "Ordered"
        return "Seated"
    }

    return (
        <div className="bistro-card">
            <CardHeader className="stat-card-header bg-gradient-to-r from-amber-500 to-amber-600 pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                    <Coffee className="h-5 w-5" />
                    Table Status
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            className={cn(
                                "relative border-2 rounded-lg p-3 cursor-pointer transition-all hover:scale-105 shadow-sm",
                                getTableStatusClass(table),
                                selectedTable?.id === table.id ? "ring-2 ring-amber-500" : "",
                            )}
                            onClick={() => setSelectedTable(table)}
                        >
                            <div className="text-center font-medium">{table.tableNumber}</div>
                            <div className="text-xs text-center flex items-center justify-center gap-1">
                                <Users className="h-3 w-3" />
                                {table.capacity}
                            </div>
                            {table.hasOrder && table.orderTotal && (
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1 text-xs flex items-center animate-pulse-slow">
                                    <DollarSign className="h-3 w-3" />
                                    {table.orderTotal}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {selectedTable && (
                    <div className="mt-6 p-4 border border-amber-200 rounded-lg bg-amber-50/50">
                        <h3 className="font-medium text-lg bistro-heading">{selectedTable.tableNumber} Details</h3>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="text-sm font-medium text-amber-900">Status:</div>
                            <div>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "bistro-badge",
                                        getTableStatusClass(selectedTable),
                                        "border font-normal text-xs px-3 py-1",
                                    )}
                                >
                                    {getTableStatusText(selectedTable)}
                                </Badge>
                            </div>

                            <div className="text-sm font-medium text-amber-900">Capacity:</div>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-amber-700" />
                                <span>{selectedTable.capacity} people</span>
                            </div>

                            {selectedTable.isOccupied && selectedTable.hasOrder && (
                                <>
                                    <div className="text-sm font-medium text-amber-900">Order Total:</div>
                                    <div className="flex items-center gap-1 font-medium">
                                        <DollarSign className="h-3 w-3 text-green-600" />
                                        {selectedTable.orderTotal}
                                    </div>

                                    <div className="text-sm font-medium text-amber-900">Payment Status:</div>
                                    <div>
                                        {selectedTable.isPaid ? (
                                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                                Paid
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                                Unpaid
                                            </Badge>
                                        )}
                                    </div>
                                </>
                            )}

                            {!selectedTable.isOccupied && selectedTable.lastOccupied && (
                                <>
                                    <div className="text-sm font-medium text-amber-900">Last Occupied:</div>
                                    <div className="text-sm text-muted-foreground">{selectedTable.lastOccupied.toLocaleTimeString()}</div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </div>
    )
}
