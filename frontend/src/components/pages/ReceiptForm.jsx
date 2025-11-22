"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../../config"

export default function ReceiptForm({ setCurrentPage, receiptId = null }) {
  const [receipt, setReceipt] = useState({
    reference: "",
    receiveFrom: "",
    responsible: "",
    scheduleDate: "",
    status: "Draft",
    products: [],
  })

  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")

  useEffect(() => {
    fetchWarehouses()
    fetchProducts()
    if (receiptId) {
      fetchReceipt(receiptId)
    } else {
      generateReference()
      autoFillUser()
    }
  }, [receiptId])

  const generateReference = async () => {
    try {
      const response = await fetch(`${API_URL}/api/receipts/generate-reference`)
      const data = await response.json()
      setReceipt((prev) => ({ ...prev, reference: data.reference }))
    } catch (error) {
      console.error("[v0] Error generating reference:", error)
      const timestamp = Date.now()
      setReceipt((prev) => ({ ...prev, reference: `WH/IN/${timestamp}` }))
    }
  }

  const autoFillUser = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.name) {
      setReceipt((prev) => ({ ...prev, responsible: user.name }))
    }
  }

  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/warehouses`)
      const data = await response.json()
      setWarehouses(data)
    } catch (error) {
      console.error("[v0] Error fetching warehouses:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    }
  }

  const fetchReceipt = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/receipts/${id}`)
      const data = await response.json()
      setReceipt(data)
    } catch (error) {
      console.error("[v0] Error fetching receipt:", error)
    }
  }

  const addProduct = () => {
    if (!selectedProduct || !quantity) return

    const product = products.find((p) => p.id === Number.parseInt(selectedProduct))
    if (!product) return

    setReceipt((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: Number.parseInt(quantity),
        },
      ],
    }))

    setSelectedProduct("")
    setQuantity("")
  }

  const removeProduct = (index) => {
    setReceipt((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  const handleValidate = async () => {
    if (receipt.status !== "Draft") return

    try {
      const response = await fetch(`${API_URL}/api/receipts/${receiptId || "new"}`, {
        method: receiptId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...receipt, status: "Ready" }),
      })
      const data = await response.json()
      setReceipt((prev) => ({ ...prev, status: "Ready" }))
      alert("Receipt validated successfully!")
    } catch (error) {
      console.error("[v0] Error validating receipt:", error)
      alert("Error validating receipt")
    }
  }

  const handlePrint = () => {
    if (receipt.status !== "Done") {
      alert("You can only print receipts that are DONE")
      return
    }
    window.print()
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this receipt?")) {
      setCurrentPage("receipts")
    }
  }

  const handleDone = async () => {
    if (receipt.status !== "Ready") {
      alert("You must validate the receipt before marking it as done")
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/receipts/${receiptId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receipt),
      })
      const data = await response.json()
      setReceipt((prev) => ({ ...prev, status: "Done" }))
      alert("Receipt completed successfully!")
    } catch (error) {
      console.error("[v0] Error completing receipt:", error)
      alert("Error completing receipt")
    }
  }

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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-grey-900 mb-2">Receipt</h1>
          <p className="text-grey-600">When user click on receipt operations - By default land on List View</p>
        </div>
        <button onClick={() => setCurrentPage("receipts")} className="text-purple-600 hover:text-purple-700">
          ← Back to List
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setCurrentPage("receipts")} className="btn-secondary">
          New
        </button>
        <button
          onClick={handleValidate}
          disabled={receipt.status !== "Draft"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Validate
        </button>
        <button
          onClick={handlePrint}
          disabled={receipt.status !== "Done"}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Print
        </button>
        <button onClick={handleCancel} className="btn-secondary">
          Cancel
        </button>

        {/* Status Indicator */}
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-grey-600">
            <span className="font-semibold">Status Flow:</span> Draft → Ready → Done
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(receipt.status)}`}>
            {receipt.status}
          </span>
        </div>
      </div>

      {/* Receipt Form */}
      <div className="card mb-6">
        {/* Reference */}
        <div className="mb-6 p-6 bg-grey-50 rounded-lg">
          <h2 className="text-2xl font-bold text-purple-700 font-mono">{receipt.reference}</h2>
          <p className="text-sm text-grey-500 mt-1">Reference auto-generated</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6 p-6">
          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-2">Receive From</label>
            <input
              type="text"
              className="input-field"
              value={receipt.receiveFrom}
              onChange={(e) => setReceipt({ ...receipt, receiveFrom: e.target.value })}
              placeholder="Vendor/Supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-2">Responsible</label>
            <input
              type="text"
              className="input-field"
              value={receipt.responsible}
              onChange={(e) => setReceipt({ ...receipt, responsible: e.target.value })}
              placeholder="Person responsible"
            />
            <p className="text-xs text-grey-500 mt-1">Auto-filled with logged-in user</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-grey-700 mb-2">Schedule Date</label>
            <input
              type="date"
              className="input-field"
              value={receipt.scheduleDate}
              onChange={(e) => setReceipt({ ...receipt, scheduleDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="card">
        <div className="border-b-2 border-purple-700 p-4">
          <h3 className="text-xl font-bold text-purple-700">Products</h3>
        </div>

        {/* Add Product */}
        <div className="p-6 bg-grey-50 flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-grey-700 mb-2">Select Product</label>
            <select
              className="input-field"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">-- Select Product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  [{product.sku}] {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <label className="block text-sm font-semibold text-grey-700 mb-2">Quantity</label>
            <input
              type="number"
              className="input-field"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              min="1"
            />
          </div>

          <button onClick={addProduct} className="btn-primary">
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-grey-300">
                <th className="text-left py-3 px-4 font-semibold text-grey-700">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-grey-700">SKU</th>
                <th className="text-right py-3 px-4 font-semibold text-grey-700">Quantity</th>
                <th className="text-center py-3 px-4 font-semibold text-grey-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {receipt.products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-grey-500">
                    No products added yet. Add products above.
                  </td>
                </tr>
              ) : (
                receipt.products.map((product, index) => (
                  <tr key={index} className="border-b border-grey-200 hover:bg-grey-50">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 font-mono text-sm text-grey-600">[{product.sku}]</td>
                    <td className="py-3 px-4 text-right font-semibold">{product.quantity}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-grey-50 text-sm text-grey-600">
          <p>Auto fill with the current logged in users.</p>
          <p className="mt-1">On click, TODO, move to Ready</p>
          <p className="mt-1">on click, Validate move to Done</p>
        </div>
      </div>

      {/* Action Button at Bottom */}
      {receipt.status === "Ready" && (
        <div className="mt-6 flex justify-end">
          <button onClick={handleDone} className="btn-primary text-lg px-8 py-3">
            Mark as Done
          </button>
        </div>
      )}

      {/* Status Info Box */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-2">Status Workflow Guide:</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>
            <strong>Draft:</strong> Initial state - Add products and fill details
          </li>
          <li>
            <strong>Ready:</strong> Click Validate when ready to receive
          </li>
          <li>
            <strong>Done:</strong> Receipt completed and goods received
          </li>
        </ul>
        <p className="text-xs text-purple-600 mt-3">Print the receipt once it's DONE</p>
      </div>
    </div>
  )
}
