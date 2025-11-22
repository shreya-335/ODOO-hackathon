"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiSearch, FiList, FiGrid, FiEye } from "react-icons/fi"
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
      console.error("Error fetching receipts:", error)
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
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#714B67" }}>
          Receipts
        </h1>
        <p style={{ color: "#8F8F9F" }}>When user click on Receipt operations - By default land on List View</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setCurrentPage("receipt-create")} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" />
          NEW
        </button>
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#8F8F9F" }} />
          <input
            type="text"
            placeholder="Search receipt by reference & contacts..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            viewMode === "list" ? "font-semibold shadow-sm" : ""
          }`}
          style={{
            backgroundColor: viewMode === "list" ? "#E4D8F5" : "#E5E5E7",
            color: viewMode === "list" ? "#714B67" : "#4A4A4A",
          }}
        >
          <FiList className="w-5 h-5" />
          List
        </button>
        <button
          onClick={() => setViewMode("kanban")}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            viewMode === "kanban" ? "font-semibold shadow-sm" : ""
          }`}
          style={{
            backgroundColor: viewMode === "kanban" ? "#E4D8F5" : "#E5E5E7",
            color: viewMode === "kanban" ? "#714B67" : "#4A4A4A",
          }}
        >
          <FiGrid className="w-5 h-5" />
          Kanban
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: "#8F8F9F" }}>Loading receipts...</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: "#714B67" }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  Reference
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  From
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  To
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8" style={{ color: "#8F8F9F" }}>
                    No receipts found. Click NEW to create one.
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="table-row">
                    <td className="py-3 px-4 font-mono" style={{ color: "#714B67" }}>
                      {receipt.reference}
                    </td>
                    <td className="py-3 px-4" style={{ color: "#8F8F9F" }}>
                      {new Date(receipt.createdat).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                      {receipt.receivefrom || "N/A"}
                    </td>
                    <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                      {receipt.warehouseid || "vendor"}
                    </td>
                    <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                      WH/Stock1
                    </td>
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
                        className="flex items-center gap-1 text-sm font-semibold transition-colors"
                        style={{ color: "#714B67" }}
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-4 text-sm" style={{ color: "#8F8F9F" }}>
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
            <h3 className="font-bold text-lg mb-4" style={{ color: "#4A4A4A" }}>
              Draft
            </h3>
            {filteredReceipts
              .filter((r) => r.status === "Draft")
              .map((receipt) => (
                <div
                  key={receipt.id}
                  className="p-4 rounded mb-3 border-l-4"
                  style={{ backgroundColor: "#E5E5E7", borderColor: "#8F8F9F" }}
                >
                  <p className="font-mono text-sm" style={{ color: "#714B67" }}>
                    {receipt.reference}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8F8F9F" }}>
                    {receipt.receivefrom || "No contact"}
                  </p>
                </div>
              ))}
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4 text-blue-700">Ready</h3>
            {filteredReceipts
              .filter((r) => r.status === "Ready")
              .map((receipt) => (
                <div key={receipt.id} className="p-4 bg-blue-50 rounded mb-3 border-l-4 border-blue-400">
                  <p className="font-mono text-sm" style={{ color: "#714B67" }}>
                    {receipt.reference}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8F8F9F" }}>
                    {receipt.receivefrom || "No contact"}
                  </p>
                </div>
              ))}
          </div>

          <div className="card">
            <h3 className="font-bold text-lg mb-4 text-green-700">Done</h3>
            {filteredReceipts
              .filter((r) => r.status === "Done")
              .map((receipt) => (
                <div key={receipt.id} className="p-4 bg-green-50 rounded mb-3 border-l-4 border-green-400">
                  <p className="font-mono text-sm" style={{ color: "#714B67" }}>
                    {receipt.reference}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#8F8F9F" }}>
                    {receipt.receivefrom || "No contact"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
