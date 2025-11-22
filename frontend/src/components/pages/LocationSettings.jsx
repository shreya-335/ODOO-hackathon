"use client"

import { useState } from "react"

export default function LocationSettings({ setCurrentPage }) {
  const [locations, setLocations] = useState([{ id: 1, name: "VISHAL", shortCode: "VS", warehouse: "WH" }])

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Location</h1>
        <p className="text-grey-600">This page contains the warehouse details & location.</p>
      </div>

      {/* Add Form */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-grey-900 mb-4">Add New Location</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">Name:</label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">Short Code:</label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">Warehouse:</label>
              <select className="input-field">
                <option>WH</option>
              </select>
            </div>
          </div>
          <button className="btn-primary">Add Location</button>
        </div>
      </div>

      {/* Locations List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-grey-900 mb-4">Existing Locations</h2>
        <div className="space-y-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="border border-grey-200 rounded-lg p-4 flex justify-between items-center hover:bg-grey-50"
            >
              <div>
                <h3 className="font-semibold text-grey-900">{loc.name}</h3>
                <p className="text-sm text-grey-600">
                  Code: {loc.shortCode} | Warehouse: {loc.warehouse}
                </p>
              </div>
              <button
                onClick={() => setCurrentPage("warehouse")}
                className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
              >
                View Warehouse
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-grey-600 mt-4 text-sm">This holds the multiple locations of warehouse, rooms etc..</p>
    </div>
  )
}
