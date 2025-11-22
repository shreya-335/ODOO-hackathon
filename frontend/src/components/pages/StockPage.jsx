"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiFilter, FiEdit } from "react-icons/fi"
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
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
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
        <div className="text-center" style={{ color: "#8F8F9F" }}>
          Loading products...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#714B67" }}>
          Stock Management
        </h1>
        <p style={{ color: "#8F8F9F" }}>Warehouse details & location</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#8F8F9F" }} />
          <input
            type="text"
            placeholder="Search products..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: "#8F8F9F" }} />
          <select
            className="input-field pl-10 pr-8"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2" style={{ borderColor: "#714B67" }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                Product
              </th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                SKU
              </th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                Category
              </th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                On Hand
              </th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: "#714B67" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                    {product.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm" style={{ color: "#8F8F9F" }}>
                    {product.sku}
                  </td>
                  <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                    {product.category}
                  </td>
                  <td className="py-3 px-4" style={{ color: "#4A4A4A" }}>
                    {product.onHand}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="flex items-center gap-1 text-sm font-semibold transition-colors"
                      style={{ color: "#714B67" }}
                    >
                      <FiEdit className="w-4 h-4" />
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center" style={{ color: "#8F8F9F" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center mt-4 text-sm" style={{ color: "#8F8F9F" }}>
        User must be able to update the stock from here.
      </p>
    </div>
  )
}
