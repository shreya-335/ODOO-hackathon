"use client"

export default function KPICard({ title, value, color, icon: Icon, onClick }) {
  const colorStyles = {
    purple: {
      bg: "#E4D8F5",
      text: "#714B67",
      border: "#C4ACE3",
    },
    red: {
      bg: "#FEE2E2",
      text: "#DC2626",
      border: "#FCA5A5",
    },
    blue: {
      bg: "#DBEAFE",
      text: "#2563EB",
      border: "#93C5FD",
    },
    green: {
      bg: "#D1FAE5",
      text: "#059669",
      border: "#6EE7B7",
    },
    yellow: {
      bg: "#FEF3C7",
      text: "#D97706",
      border: "#FCD34D",
    },
  }

  const style = colorStyles[color]

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer border-2 hover:scale-105"
      style={{ borderColor: style.border }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "#8F8F9F" }}>
            {title}
          </p>
          <p className="text-4xl font-bold" style={{ color: style.text }}>
            {value}
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: style.bg }}>
          <Icon className="w-6 h-6" style={{ color: style.text }} />
        </div>
      </div>
    </div>
  )
}
