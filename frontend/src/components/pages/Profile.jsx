"use client"

export default function Profile({ userInfo, onLogout }) {
  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-grey-900 mb-2">My Profile</h1>
        <p className="text-grey-600">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="card max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center text-3xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-grey-900">{userInfo?.name}</h2>
          <p className="text-grey-600">{userInfo?.email}</p>
        </div>

        <div className="space-y-3 border-t border-grey-200 pt-6">
          <button className="w-full text-left px-4 py-3 rounded hover:bg-grey-50 text-grey-700">Change Password</button>
          <button className="w-full text-left px-4 py-3 rounded hover:bg-grey-50 text-grey-700">
            Account Settings
          </button>
          <button onClick={onLogout} className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
