"use client"

import { useEffect } from 'react'

export default function DashboardPage() {
  useEffect(() => {
    // Check if we're coming back from OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const isOAuthReturn = urlParams.get('oauth_success') === 'true';
    
    if (isOAuthReturn) {
      // Restore tracking data from sessionStorage
      const tempTracking = sessionStorage.getItem('reddimon_temp');
      if (tempTracking) {
        const data = JSON.parse(tempTracking);
        localStorage.setItem('reddimon_tracking_data', JSON.stringify({
          ...data,
          timestamp: Date.now()
        }));
        sessionStorage.removeItem('reddimon_temp');
        
        // Track the conversion
        setTimeout(() => {
          if (window.Reddimon) {
            window.Reddimon.trackSignup();
          }
        }, 100);
      }
    }
  }, []);

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
