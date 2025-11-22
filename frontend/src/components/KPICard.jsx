"use client"

export default function KPICard({ title, value, color, icon, onClick }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    red: "bg-red-100 text-red-700 border-red-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  }

  return (
    <div onClick={onClick} className={`card cursor-pointer hover:shadow-md transition border-2 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
