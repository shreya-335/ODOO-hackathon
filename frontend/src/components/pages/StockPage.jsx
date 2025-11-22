"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../../config"

export default function StockPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")

  const categories = ["All", "Furniture", "Raw Materials", "Electronics"]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log("[v0] Fetching products from API")
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      console.log("[v0] Products received:", data)
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "All" || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="p-8 mt-16">
        <div className="text-center text-gray-600">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Stock Management</h1>
        <p className="text-gray-600">Warehouse details & location</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="input-field flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="input-field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-purple-700">
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">SKU</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">On Hand</th>
              <th className="text-left py-3 px-4 font-semibold text-purple-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-600">{product.sku}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.onHand}</td>
                  <td className="py-3 px-4">
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold">Update</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-600 mt-4 text-sm">User must be able to update the stock from here.</p>
    </div>
  )
}
