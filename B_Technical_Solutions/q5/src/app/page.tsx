import { Suspense } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import OrdersOverview from "@/components/dashboard/orders-overview"
import SalesMetrics from "@/components/dashboard/sales-metrics"
import PerformanceMetrics from "@/components/dashboard/performance-metrics"
import TableStatus from "@/components/dashboard/table-status"
import TableVisualization from "@/components/dashboard/table-visualization"
import { Skeleton } from "@/components/ui/skeleton"
import PendingOrdersTable from "@/components/dashboard/pending-orders-table"
import TopSellingItemsList from "@/components/dashboard/top-selling-items-list"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <OrdersOverview />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <SalesMetrics />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <PerformanceMetrics />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <TableStatus />
            </Suspense>
          </div>

          <div className="mb-6">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <TableVisualization />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <PendingOrders />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <TopSellingItems />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function PendingOrders() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">Pending Orders</h2>
      <div className="overflow-auto max-h-[500px]">
        <PendingOrdersTable />
      </div>
    </div>
  )
}

function TopSellingItems() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold text-amber-800 mb-4">Top Selling Items</h2>
      <TopSellingItemsList />
    </div>
  )
}
