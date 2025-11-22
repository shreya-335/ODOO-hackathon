"use client"

import { useState, useEffect } from "react"
import { FiPackage, FiAlertTriangle, FiDownload, FiUpload, FiRepeat } from "react-icons/fi"
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
      const [productsRes, receiptsRes, deliveriesRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/receipts`),
        fetch(`${API_URL}/api/deliveries`),
      ])

      const products = await productsRes.json()
      const receipts = await receiptsRes.json()
      const deliveries = await deliveriesRes.json()

      setKpis({
        totalProducts: products.length,
        lowStock: products.filter((p) => p.initialstock < 20).length,
        pendingReceipts: receipts.filter((r) => r.status === "Draft" || r.status === "Waiting").length,
        pendingDeliveries: deliveries.filter((d) => d.status === "Draft" || d.status === "Waiting").length,
        internalTransfers: deliveries.filter((d) => d.status === "Ready").length,
      })

      setRecentReceipts(receipts.slice(0, 3))
      setRecentDeliveries(deliveries.slice(0, 3))

      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 mt-16">
        <div className="text-center" style={{ color: "#8F8F9F" }}>
          Loading dashboard data...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#2E2E2E" }}>
          Dashboard
        </h1>
        <p style={{ color: "#8F8F9F" }}>Welcome to your inventory operations dashboard</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          color="purple"
          icon={FiPackage}
          onClick={() => setCurrentPage("stock")}
        />
        <KPICard
          title="Low Stock"
          value={kpis.lowStock}
          color="red"
          icon={FiAlertTriangle}
          onClick={() => setCurrentPage("stock")}
        />
        <KPICard
          title="Pending Receipts"
          value={kpis.pendingReceipts}
          color="blue"
          icon={FiDownload}
          onClick={() => setCurrentPage("receipts")}
        />
        <KPICard
          title="Pending Deliveries"
          value={kpis.pendingDeliveries}
          color="green"
          icon={FiUpload}
          onClick={() => setCurrentPage("delivery")}
        />
        <KPICard
          title="Transfers"
          value={kpis.internalTransfers}
          color="yellow"
          icon={FiRepeat}
          onClick={() => setCurrentPage("move-history")}
        />
      </div>

      {/* Summary Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Receipts */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#2E2E2E" }}>
              Recent Receipts
            </h2>
            <button
              onClick={() => setCurrentPage("receipts")}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#714B67" }}
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentReceipts.length > 0 ? (
              recentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex justify-between py-3 border-b" style={{ borderColor: "#E5E5E7" }}>
                  <span className="font-medium" style={{ color: "#4A4A4A" }}>
                    {receipt.reference}
                  </span>
                  <span className={`badge badge-${receipt.status.toLowerCase()}`}>{receipt.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#8F8F9F" }}>
                No receipts found
              </p>
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: "#2E2E2E" }}>
              Recent Deliveries
            </h2>
            <button
              onClick={() => setCurrentPage("delivery")}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#714B67" }}
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentDeliveries.length > 0 ? (
              recentDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: "#E5E5E7" }}
                >
                  <span className="font-medium" style={{ color: "#4A4A4A" }}>
                    {delivery.reference}
                  </span>
                  <span className={`badge badge-${delivery.status.toLowerCase()}`}>{delivery.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm" style={{ color: "#8F8F9F" }}>
                No deliveries found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
