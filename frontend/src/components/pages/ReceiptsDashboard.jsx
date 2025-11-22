"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../../config"

export default function ReceiptsDashboard({ setCurrentPage }) {
  const [receipts, setReceipts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("list") // 'list' or 'kanban'

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/receipts`)
      const data = await response.json()
      setReceipts(data)
    } catch (error) {
      console.error("[v0] Error fetching receipts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (receipt.receivefrom && receipt.receivefrom.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-grey-200 text-grey-700"
      case "Ready":
        return "bg-blue-100 text-blue-700"
      case "Done":
        return "bg-green-100 text-green-700"
      default:
        return "bg-grey-200 text-grey-700"
    }
  }

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Receipts</h1>
        <p className="text-grey-600">When user click on Receipt operations - By default land on List View</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setCurrentPage("receipt-create")} className="btn-primary">
          + NEW
        </button>
        <input
          type="text"
          placeholder="Allow user to search receipt based on reference & contacts..."
          className="input-field flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${viewMode === "list" ? "bg-purple-700 text-white" : "bg-grey-200 text-grey-700"}`}
        >
          📋 List
        </button>
        <button
          onClick={() => setViewMode("kanban")}
          className={`px-4 py-2 rounded ${viewMode === "kanban" ? "bg-purple-700 text-white" : "bg-grey-200 text-grey-700"}`}
        >
          📊 Kanban
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-grey-600">Loading receipts...</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-purple-700">
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Reference</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">From</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">To</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-grey-500">
                    No receipts found. Click NEW to create one.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="table-row">
                    <td className="py-3 px-4 font-mono text-purple-600">{receipt.reference}</td>
                    <td className="py-3 px-4 text-grey-600">{new Date(receipt.createdat).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{receipt.receivefrom || "N/A"}</td>
                    <td className="py-3 px-4">{receipt.warehouseid || "vendor"}</td>
                    <td className="py-3 px-4">WH/Stock1</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(receipt.status)}`}
                      >
                        {receipt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setCurrentPage(`receipt-edit-${receipt.id}`)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-4 text-grey-600 text-sm">
            <p>Populate all work orders added to manufacturing order</p>
            <p className="mt-2">
              <strong>In event should be display in green</strong>
            </p>
            <p>
              <strong>Out moves should be display in red</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* Kanban View */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4 text-grey-700">Draft</h3>
            {filteredReceipts
              .filter((r) => r.status === "Draft")
              .map((receipt) => (
                <div key={receipt.id} className="p-4 bg-grey-50 rounded mb-3 border-l-4 border-grey-400">
                  <p className="font-mono text-sm text-purple-600">{receipt.reference}</p>
                  <p className="text-xs text-grey-600 mt-1">{receipt.receivefrom || "No contact"}</p>
                </div>
              ))}
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4 text-blue-700">Ready</h3>
            {filteredReceipts
              .filter((r) => r.status === "Ready")
              .map((receipt) => (
                <div key={receipt.id} className="p-4 bg-blue-50 rounded mb-3 border-l-4 border-blue-400">
                  <p className="font-mono text-sm text-purple-600">{receipt.reference}</p>
                  <p className="text-xs text-grey-600 mt-1">{receipt.receivefrom || "No contact"}</p>
                </div>
              ))}
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4 text-green-700">Done</h3>
            {filteredReceipts
              .filter((r) => r.status === "Done")
              .map((receipt) => (
                <div key={receipt.id} className="p-4 bg-green-50 rounded mb-3 border-l-4 border-green-400">
                  <p className="font-mono text-sm text-purple-600">{receipt.reference}</p>
                  <p className="text-xs text-grey-600 mt-1">{receipt.receivefrom || "No contact"}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
