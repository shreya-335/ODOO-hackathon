"use client"

import { useState, useEffect } from "react"
import KPICard from "../KPICard"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function DashboardHome({ setCurrentPage }) {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    internalTransfers: 0,
  })
  const [recentReceipts, setRecentReceipts] = useState([])
  const [recentDeliveries, setRecentDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log("[v0] Fetching dashboard data from API")

      // Fetch all necessary data in parallel
      const [productsRes, receiptsRes, deliveriesRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/receipts`),
        fetch(`${API_URL}/api/deliveries`),
      ])

      const products = await productsRes.json()
      const receipts = await receiptsRes.json()
      const deliveries = await deliveriesRes.json()

      console.log("[v0] Dashboard data received:", { products, receipts, deliveries })

      // Calculate KPIs
      setKpis({
        totalProducts: products.length,
        lowStock: products.filter((p) => p.initialstock < 20).length,
        pendingReceipts: receipts.filter((r) => r.status === "Draft" || r.status === "Waiting").length,
        pendingDeliveries: deliveries.filter((d) => d.status === "Draft" || d.status === "Waiting").length,
        internalTransfers: deliveries.filter((d) => d.status === "Ready").length,
      })

      // Set recent items (last 3)
      setRecentReceipts(receipts.slice(0, 3))
      setRecentDeliveries(deliveries.slice(0, 3))

      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 mt-16">
        <div className="text-center text-gray-600">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your inventory operations dashboard</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          color="purple"
          icon="📦"
          onClick={() => setCurrentPage("stock")}
        />
        <KPICard title="Low Stock" value={kpis.lowStock} color="red" icon="⚠️" onClick={() => setCurrentPage("stock")} />
        <KPICard
          title="Pending Receipts"
          value={kpis.pendingReceipts}
          color="blue"
          icon="📥"
          onClick={() => setCurrentPage("receipts")}
        />
        <KPICard
          title="Pending Deliveries"
          value={kpis.pendingDeliveries}
          color="green"
          icon="📤"
          onClick={() => setCurrentPage("delivery")}
        />
        <KPICard
          title="Transfers"
          value={kpis.internalTransfers}
          color="yellow"
          icon="🔄"
          onClick={() => setCurrentPage("move-history")}
        />
      </div>

      {/* Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Receipts */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Receipts</h2>
            <button
              onClick={() => setCurrentPage("receipts")}
              className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentReceipts.length > 0 ? (
              recentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">{receipt.reference}</span>
                  <span className="text-gray-600 text-sm">{receipt.status}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No receipts found</p>
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
            <button
              onClick={() => setCurrentPage("delivery")}
              className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentDeliveries.length > 0 ? (
              recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">{delivery.reference}</span>
                  <span className="text-gray-600 text-sm">{delivery.status}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No deliveries found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
