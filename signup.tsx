// import React, { useState, useEffect } from 'react';

// function SignupPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Restore tracking data after OAuth redirect
//   useEffect(() => {
//     // Check if we're coming back from OAuth
//     const urlParams = new URLSearchParams(window.location.search);
//     const isOAuthReturn = urlParams.get('oauth_success') === 'true';
    
//     if (isOAuthReturn) {
//       // Restore tracking data from sessionStorage or URL params
//       const tempTracking = sessionStorage.getItem('reddimon_temp');
//       if (tempTracking) {
//         const data = JSON.parse(tempTracking);
//         localStorage.setItem('reddimon_tracking_data', JSON.stringify({
//           ...data,
//           timestamp: Date.now()
//         }));
//         sessionStorage.removeItem('reddimon_temp');
        
//         // Track the conversion
//         setTimeout(() => {
//           if (window.Reddimon) {
//             window.Reddimon.trackSignup();
//           }
//         }, 100);
//       }
//     }
//   }, []);

//   // Handle email/password signup
//   const handleEmailSignup = async () => {
//     setIsLoading(true);
    
//     try {
//       const response = await fetch('/api/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
      
//       if (response.ok) {
//         // For email signup, tracking will happen automatically
//         // when user reaches confirmation page or dashboard
//         window.location.href = '/email-confirmation';
//       } else {
//         throw new Error('Signup failed');
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert('Signup failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Google OAuth signup
//   const handleGoogleSignup = () => {
//     // Preserve tracking data before OAuth redirect
//     const trackingData = window.Reddimon?.getTrackingData() || {};
    
//     if (trackingData.reddimon_link_id) {
//       // Store in sessionStorage (survives tab navigation)
//       sessionStorage.setItem('reddimon_temp', JSON.stringify(trackingData));
//     }
    
//     // Redirect to Google OAuth
//     window.location.href = '/auth/google';
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
//       {/* Google Signup */}
//       <button
//         onClick={handleGoogleSignup}
//         className="w-full mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
//       >
//         <svg className="w-5 h-5" viewBox="0 0 24 24">
//           <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//           <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//           <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//           <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//         </svg>
//         Continue with Google
//       </button>
      
//       <div className="relative mb-4">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white text-gray-500">or</span>
//         </div>
//       </div>
      
//       {/* Email Signup Form */}
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter your email"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Create a password"
//           />
//         </div>
        
//         <button
//           onClick={handleEmailSignup}
//           disabled={isLoading}
//           className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {isLoading ? 'Creating Account...' : 'Sign Up with Email'}
//         </button>
//       </div>
      
//       <p className="mt-4 text-sm text-gray-600 text-center">
//         Already have an account?{' '}
//         <a href="/login" className="text-blue-500 hover:underline">
//           Sign in
//         </a>
//       </p>
//     </div>
//   );
// }

// // Example confirmation page component
// function EmailConfirmationPage() {
//   useEffect(() => {
//     // This page will be auto-tracked if URL contains "confirm"
//     // Or manually track here:
//     if (window.Reddimon) {
//       window.Reddimon.trackSignup();
//     }
//   }, []);

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
//       <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
//       <p className="text-gray-600 mb-4">
//         We've sent a confirmation link to your email address. 
//         Please click the link to activate your account.
//       </p>
//       <div className="text-sm text-gray-500">
//         Didn't receive the email? Check your spam folder or{' '}
//         <button className="text-blue-500 hover:underline">
//           resend confirmation
//         </button>
//       </div>
//     </div>
//   );
// }

// // Example dashboard component (auto-tracked)
// function Dashboard() {
//   useEffect(() => {
//     // This will be auto-tracked since URL contains "dashboard"
//     console.log('Dashboard loaded - conversion should be tracked automatically');
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto mt-8 p-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard!</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-2">Getting Started</h3>
//           <p className="text-gray-600">Complete your profile setup</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-2">Recent Activity</h3>
//           <p className="text-gray-600">No recent activity</p>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-2">Quick Actions</h3>
//           <p className="text-gray-600">Start exploring features</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;