"use client"

import { useState } from "react"

export default function DeliveryDashboard({ setCurrentPage }) {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      reference: "WH/OUT/0001",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "12/1/2001",
      status: "Ready",
    },
    {
      id: 2,
      reference: "WH/OUT/0002",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "12/1/2001",
      status: "Ready",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Delivery</h1>
        <p className="text-grey-600">When user click on Delivery operations</p>
      </div>

      {/* Warehouse Label */}
      <div className="mb-6 text-grey-600 font-semibold">Chirag</div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button className="btn-primary">+ NEW</button>
        <input
          type="text"
          placeholder="Search by reference or contact..."
          className="input-field flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-purple-700">
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Reference</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">From</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">To</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Schedule Date</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="table-row">
                <td className="py-3 px-4 font-mono text-purple-600">{delivery.reference}</td>
                <td className="py-3 px-4">{delivery.from}</td>
                <td className="py-3 px-4">{delivery.to}</td>
                <td className="py-3 px-4">{delivery.contact}</td>
                <td className="py-3 px-4">{delivery.scheduleDate}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{delivery.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-grey-600 mt-4 text-sm">Populate all delivery orders</p>
    </div>
  )
}
