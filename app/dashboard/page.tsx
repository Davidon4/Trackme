"use client"



export default function DashboardPage() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-gray-600">Complete your profile setup</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <p className="text-gray-600">No recent activity</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <p className="text-gray-600">Start exploring features</p>
          </div>
        </div>
      </div>
    </div>
  )
}
