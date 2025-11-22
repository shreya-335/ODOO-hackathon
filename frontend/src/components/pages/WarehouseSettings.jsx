"use client"

import { useState } from "react"

export default function WarehouseSettings() {
  const [warehouses, setWarehouses] = useState([
    { id: 1, name: "Main Warehouse", shortCode: "WH", address: "123 Main St, City" },
    { id: 2, name: "Branch Warehouse", shortCode: "BRH", address: "456 Branch Ave, Town" },
  ])

  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", shortCode: "", address: "" })

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">Warehouse Settings</h1>
        <p className="text-grey-600">This page contains the warehouse details & location.</p>
      </div>

      {/* Add Form */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-grey-900 mb-4">Add New Warehouse</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">Name</label>
              <input type="text" className="input-field" placeholder="Warehouse name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-700 mb-1">Short Code</label>
              <input type="text" className="input-field" placeholder="WH" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-1">Address</label>
            <textarea className="input-field" placeholder="Full address" rows="3"></textarea>
          </div>
          <button className="btn-primary">Add Warehouse</button>
        </div>
      </div>

      {/* Warehouse List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-grey-900 mb-4">Existing Warehouses</h2>
        <div className="space-y-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="border border-grey-200 rounded-lg p-4 hover:bg-grey-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-grey-900">{wh.name}</h3>
                  <p className="text-sm text-grey-600">Code: {wh.shortCode}</p>
                  <p className="text-sm text-grey-600">Address: {wh.address}</p>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-grey-600 mt-4 text-sm">This holds the multiple locations of warehouse, rooms etc..</p>
    </div>
  )
}
