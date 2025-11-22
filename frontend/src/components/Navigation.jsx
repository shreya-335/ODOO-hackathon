"use client"

import { useState } from "react"

export default function Navigation({ currentPage, setCurrentPage, userInfo, onLogout, sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(null)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "stock", label: "Stock", icon: "📦" },
    { id: "receipts", label: "Receipts", icon: "📥" },
    { id: "delivery", label: "Delivery", icon: "📤" },
    { id: "move-history", label: "Move History", icon: "🔄" },
    { id: "settings", label: "Settings", icon: "⚙️", submenu: true },
  ]

  const settings = [
    { id: "warehouse", label: "Warehouse" },
    { id: "location", label: "Location" },
  ]

  return (
    <>
      {/* Header Bar */}
      <div className="bg-white border-b border-grey-200 h-16 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-grey-600 hover:text-purple-700 transition"
          >
            ☰
          </button>
          <h2 className="text-xl font-bold text-purple-700">Stock Master</h2>
        </div>

        <button
          onClick={() => setCurrentPage("profile")}
          className="flex items-center gap-2 text-grey-600 hover:text-purple-700 transition"
        >
          👤 {userInfo?.name}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-grey-200 pt-20 transition-all duration-300 fixed left-0 top-0 bottom-0 overflow-y-auto`}
      >
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.submenu) {
                    setDropdownOpen(dropdownOpen === item.id ? null : item.id)
                  } else {
                    setCurrentPage(item.id)
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "text-grey-600 hover:bg-grey-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
                {item.submenu && sidebarOpen && <span className="ml-auto">{dropdownOpen === item.id ? "▼" : "▶"}</span>}
              </button>

              {/* Submenu */}
              {item.submenu && dropdownOpen === item.id && sidebarOpen && (
                <div className="ml-4 space-y-1 mt-1">
                  {settings.map((setting) => (
                    <button
                      key={setting.id}
                      onClick={() => setCurrentPage(setting.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                        currentPage === setting.id
                          ? "bg-purple-50 text-purple-700 font-semibold"
                          : "text-grey-600 hover:bg-grey-50"
                      }`}
                    >
                      {setting.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-grey-200 mt-auto">
          <button onClick={onLogout} className="w-full btn-secondary text-sm">
            {sidebarOpen ? "Logout" : "↪"}
          </button>
        </div>
      </div>

      {/* Main Content Offset */}
      <style>{`
        body { padding-left: ${sidebarOpen ? "256px" : "80px"}; }
      `}</style>
    </>
  )
}
