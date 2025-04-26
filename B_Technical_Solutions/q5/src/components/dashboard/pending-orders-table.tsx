"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock } from 'lucide-react'
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "paid"

interface OrderItem {
    name: string
    quantity: number
    status: OrderStatus
}

interface Order {
    id: number
    tableNumber: string
    tableId: number
    items: OrderItem[]
    orderTime: Date
    status: OrderStatus
    paymentStatus: "unpaid" | "paid"
    paymentMethod?: "cash" | "credit" | "debit" | "mobile"
    isNew?: boolean
}

// Dummy data generator
const generateDummyOrders = (): Order[] => {
    const menuItems = [
        "Cappuccino",
        "Latte",
        "Espresso",
        "Mocha",
        "Americano",
        "Croissant",
        "Avocado Toast",
        "Pancakes",
        "Eggs Benedict",
        "Caesar Salad",
        "Club Sandwich",
        "Pasta Carbonara",
    ]

    const statuses: OrderStatus[] = ["pending", "preparing", "ready", "delivered"]
    const paymentMethods: ("cash" | "credit" | "debit" | "mobile")[] = ["cash", "credit", "debit", "mobile"]

    return Array.from({ length: 8 }, (_, i) => {
        const itemCount = Math.floor(Math.random() * 4) + 1
        const items: OrderItem[] = Array.from({ length: itemCount }, () => ({
            name: menuItems[Math.floor(Math.random() * menuItems.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)],
        }))

        const orderTime = new Date()
        orderTime.setMinutes(orderTime.getMinutes() - Math.floor(Math.random() * 60))

        const status: OrderStatus = items.every((item) => item.status === "ready")
            ? "ready"
            : items.some((item) => item.status === "preparing")
                ? "preparing"
                : "pending"

        const paymentStatus: "paid" | "unpaid" = Math.random() > 0.7 ? "paid" : "unpaid"

        return {
            id: 1000 + i,
            tableNumber: `Table ${Math.floor(Math.random() * 12) + 1}`,
            tableId: Math.floor(Math.random() * 12) + 1,
            items,
            orderTime,
            status,
            paymentStatus,
            paymentMethod: paymentStatus === "paid" ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
        }
    }).sort((a, b) => a.orderTime.getTime() - b.orderTime.getTime())
}

export default function PendingOrdersTable() {
    const [orders, setOrders] = useState<Order[]>([])

    // Initialize orders with useEffect to avoid hydration mismatch
    useEffect(() => {
        setOrders(generateDummyOrders())
    }, [])

    // Format time difference
    const getTimeSince = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Just now"
        if (diffMins === 1) return "1 minute ago"
        return `${diffMins} minutes ago`
    }

    // Get status badge
    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                        Pending
                    </Badge>
                )
            case "preparing":
                return (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        Preparing
                    </Badge>
                )
            case "ready":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Ready
                    </Badge>
                )
            case "delivered":
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                        Delivered
                    </Badge>
                )
            case "paid":
                return (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                        Paid
                    </Badge>
                )
        }
    }

    // Get payment status badge
    const getPaymentBadge = (status: "unpaid" | "paid", method?: string) => {
        if (status === "paid") {
            return (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Paid ({method})
                </Badge>
            )
        }
        return (
            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                Unpaid
            </Badge>
        )
    }

    // Update order status
    const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id === orderId) {
                    // If new status is "paid", update payment status too
                    const paymentStatus = newStatus === "paid" ? "paid" : order.paymentStatus
                    const paymentMethod = newStatus === "paid" ? "credit" : order.paymentMethod

                    return {
                        ...order,
                        status: newStatus,
                        paymentStatus,
                        paymentMethod,
                        items: order.items.map((item) => ({ ...item, status: newStatus }))
                    }
                }
                return order
            }),
        )

        toast.success(`Order #${orderId} marked as ${newStatus}`)
    }

    // Get available status transitions
    const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
        switch (currentStatus) {
            case "pending":
                return ["preparing"]
            case "preparing":
                return ["ready"]
            case "ready":
                return ["delivered"]
            case "delivered":
                return ["paid"]
            default:
                return []
        }
    }

    // Simulate real-time updates
    useEffect(() => {
        if (orders.length === 0) return

        const interval = setInterval(() => {
            // 20% chance to add a new order
            if (Math.random() < 0.2) {
                const newOrder = {
                    ...generateDummyOrders()[0],
                    id: 1000 + Math.floor(Math.random() * 1000),
                    orderTime: new Date(),
                    status: "pending" as OrderStatus,
                    paymentStatus: "unpaid" as const,
                    isNew: true,
                }

                setOrders((prev) => [newOrder, ...prev.slice(0, 7)])

                toast.success(`New order #${newOrder.id} added`)
                // Animate the new order row


                // Remove the "new" flag after animation
                setTimeout(() => {
                    setOrders((prev) => prev.map((order) => (order.id === newOrder.id ? { ...order, isNew: false } : order)))
                }, 2000)
            }

            // 30% chance to update an existing order
            if (Math.random() < 0.3 && orders.length > 0) {
                const orderToUpdate = orders.find((o) => o.status !== "paid")
                if (orderToUpdate) {
                    const newStatus: OrderStatus =
                        orderToUpdate.status === "pending"
                            ? "preparing"
                            : orderToUpdate.status === "preparing"
                                ? "ready"
                                : orderToUpdate.status === "ready"
                                    ? "delivered"
                                    : "paid"

                    updateOrderStatus(orderToUpdate.id, newStatus)

                    // Remove paid orders after a delay
                    if (newStatus === "paid") {
                        setTimeout(() => {
                            setOrders((prev) => prev.filter((o) => o.id !== orderToUpdate.id))
                        }, 5000)
                    }
                }
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [orders])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id} className={cn("transition-all duration-500", order.isNew ? "bg-amber-50" : "")}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.tableNumber}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="text-sm">
                                        {item.quantity}x {item.name}
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {getTimeSince(order.orderTime)}
                            </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPaymentBadge(order.paymentStatus, order.paymentMethod)}</TableCell>
                        <TableCell>
                            {order.status !== "paid" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Update Status
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {getAvailableStatuses(order.status).map((status) => (
                                            <DropdownMenuItem key={status} onClick={() => updateOrderStatus(order.id, status)}>
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                {orders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No pending orders at the moment
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
