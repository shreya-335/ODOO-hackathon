"use client"

import { useState } from "react"

export default function MoveHistory() {
  const [moves, setMoves] = useState([
    {
      id: 1,
      reference: "WH/IN/0001",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "vendor",
      to: "Distinct Gull",
      quantity: 50,
      status: "Ready",
    },
    {
      id: 2,
      reference: "WH/OUT/0002",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "WH/Stock1",
      to: "vendor",
      quantity: 30,
      status: "Ready",
    },
    {
      id: 3,
      reference: "WH/OUT/0002",
      date: "12/1/2001",
      contact: "Azure Interior",
      from: "WH/Stock2",
      to: "vendor",
      quantity: 25,
      status: "Ready",
    },
  ])

  const [viewMode, setViewMode] = useState("list") // list or kanban

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Move History</h1>
        <p className="text-grey-600">When user click on Move History</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6 items-center">
        <button className="btn-primary">+ NEW</button>
        <input type="text" placeholder="Search..." className="input-field flex-1" />
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

      {/* Table View */}
      {viewMode === "list" && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-purple-700">
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Reference</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">From</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">To</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-purple-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move) => (
                <tr key={move.id} className="table-row">
                  <td className="py-3 px-4 font-mono text-purple-600">{move.reference}</td>
                  <td className="py-3 px-4 text-grey-600">{move.date}</td>
                  <td className="py-3 px-4">{move.contact}</td>
                  <td className="py-3 px-4">{move.from}</td>
                  <td className="py-3 px-4">{move.to}</td>
                  <td className="py-3 px-4">{move.quantity}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{move.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Draft", "Waiting", "Ready"].map((status) => (
            <div key={status} className="bg-white rounded-lg border border-grey-200 p-4">
              <h3 className="font-semibold text-grey-900 mb-4">{status}</h3>
              <div className="space-y-3">
                {moves
                  .filter((m) => m.status === status)
                  .map((move) => (
                    <div key={move.id} className="bg-grey-50 p-3 rounded border border-grey-200">
                      <p className="font-mono text-sm text-purple-600 mb-1">{move.reference}</p>
                      <p className="text-sm text-grey-600">{move.contact}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-grey-600 mt-6 text-sm">
        Populate all moves done between the from - To location in inventory
        <br />
        In event should be display in green. Out moves should be display in red
      </p>
    </div>
  )
}
