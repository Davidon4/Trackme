// # Reddimon Tracking Integration Guide for React/Next.js

// ## Overview
// The Reddimon tracking script helps you track anonymous conversions (signups) from Reddit links in your React/Next.js applications. It automatically detects tracking parameters in URLs and tracks when users complete signup flows.

// ## How It Works
// 1. **URL Parameter Detection**: Captures tracking data from URL parameters like `reddimon_link_id`, UTM parameters
// 2. **Local Storage**: Persists tracking data for up to 30 days
// 3. **Session Tracking**: Creates unique session IDs for each browser session
// 4. **Automatic Detection**: Auto-detects signup forms and success pages
// 5. **Manual Tracking**: Provides API for manual conversion tracking

// ## Installation Methods

// ### Method 1: Script Tag (Recommended for Next.js)
// Add to your `pages/_document.js` or `app/layout.js`:

// ```jsx
// // pages/_document.js (Pages Router)
// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html>
//       <Head>
//         <script src="https://www.reddimon.com/reddimon-tracker.js" async />
//       </Head>
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

// // OR app/layout.js (App Router)
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <head>
//         <script src="https://www.reddimon.com/reddimon-tracker.js" async />
//       </head>
//       <body>{children}</body>
//     </html>
//   )
// }
// ```

// ### Method 2: Dynamic Import in useEffect
// ```jsx
// import { useEffect } from 'react';

// function App() {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://www.reddimon.com/reddimon-tracker.js';
//     script.async = true;
//     document.head.appendChild(script);
    
//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);
  
//   return <div>Your app content</div>;
// }
// ```

// ## Usage Examples

// ### 1. Automatic Tracking (Zero Configuration)
// The script automatically tracks forms with these action patterns:
// - `/signup`, `/register`, `/sign-up`, `/sign_up`, `/signin`, `/login`

// ```jsx
// // This form will be automatically tracked
// function SignupForm() {
//   return (
//     <form action="/signup" method="POST">
//       <input type="email" name="email" required />
//       <input type="password" name="password" required />
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// }
// ```

// ### 2. Manual Tracking for Custom Forms
// ```jsx
// import { useState } from 'react';

// function CustomSignupForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Your signup API call
//       const response = await fetch('/api/signup', {
//         method: 'POST',
//         body: JSON.stringify({ email, password })
//       });
      
//       if (response.ok) {
//         // Track successful signup
//         if (window.Reddimon) {
//           window.Reddimon.trackSignup();
//           // or window.Reddimon.track('signup');
//         }
        
//         // Redirect to success page
//         router.push('/welcome');
//       }
//     } catch (error) {
//       console.error('Signup failed:', error);
//     }
//   };
  
//   return (
//     <form onSubmit={handleSubmit}>
//       <input 
//         type="email" 
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required 
//       />
//       <input 
//         type="password" 
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required 
//       />
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// }
// ```

// ### 3. Tracking Different Conversion Types
// ```jsx
// // Track different types of conversions
// function handlePremiumUpgrade() {
//   if (window.Reddimon) {
//     window.Reddimon.track('premium_upgrade');
//   }
// }

// function handlePurchase() {
//   if (window.Reddimon) {
//     window.Reddimon.track('purchase');
//   }
// }

// function handleNewsletterSignup() {
//   if (window.Reddimon) {
//     window.Reddimon.track('newsletter_signup');
//   }
// }
// ```

// ### 4. React Hook for Tracking
// ```jsx
// import { useEffect, useCallback } from 'react';

// function useReddimonTracking() {
//   const trackConversion = useCallback((type = 'signup') => {
//     if (typeof window !== 'undefined' && window.Reddimon) {
//       return window.Reddimon.track(type);
//     }
//     return Promise.resolve({ success: false, reason: 'not_loaded' });
//   }, []);
  
//   const trackSignup = useCallback(() => {
//     return trackConversion('signup');
//   }, [trackConversion]);
  
//   const getTrackingData = useCallback(() => {
//     if (typeof window !== 'undefined' && window.Reddimon) {
//       return window.Reddimon.getTrackingData();
//     }
//     return {};
//   }, []);
  
//   return { trackConversion, trackSignup, getTrackingData };
// }

// // Usage in component
// function SignupPage() {
//   const { trackSignup } = useReddimonTracking();
  
//   const handleSuccessfulSignup = () => {
//     trackSignup();
//     router.push('/welcome');
//   };
  
//   return (
//     // Your signup form JSX
//   );
// }
// ```

// ### 5. Success Page Auto-Detection
// The script automatically tracks conversions on pages with these URL patterns:
// - Contains `/signup`, `/register`, `/sign-up`, `/signin`, `/login`
// - AND contains `success`, `confirm`, `welcome`, `dashboard`, or `account`

// Examples of auto-tracked URLs:
// - `/signup/success`
// - `/register/confirmation`
// - `/sign-up/welcome`
// - `/login/dashboard`

// ## TypeScript Support
// ```typescript
// // types/reddimon.d.ts
// declare global {
//   interface Window {
//     Reddimon?: {
//       track: (conversionType?: string) => Promise<{
//         success: boolean;
//         reason?: string;
//         error?: string;
//       }>;
//       trackSignup: () => Promise<{
//         success: boolean;
//         reason?: string;
//         error?: string;
//       }>;
//       getTrackingData: () => Record<string, any>;
//       getSessionId: () => string;
//     };
//   }
// }

// export {};
// ```

// ## Debug Mode
// Enable debug logging in development:

// ```javascript
// // In browser console or add to localStorage
// localStorage.setItem('reddimon_debug', 'true');
// // Force debug mode
// localStorage.setItem('reddimon_force_debug', 'true');
// ```

// ## Best Practices

// 1. **Load Early**: Include the script in your document head for better tracking coverage
// 2. **Check Availability**: Always check if `window.Reddimon` exists before calling methods
// 3. **Don't Block UI**: The tracking script won't throw errors or block your application
// 4. **Test in Development**: Use debug mode to verify tracking is working
// 5. **Manual Tracking**: For complex signup flows, use manual tracking for better accuracy

// ## Common Integration Patterns

// ### Next.js API Route Integration
// ```javascript
// // pages/api/signup.js
// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
  
//   try {
//     // Your signup logic
//     const user = await createUser(req.body);
    
//     // Return success - client will handle Reddimon tracking
//     res.status(200).json({ 
//       success: true, 
//       user: { id: user.id, email: user.email }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }
// ```

// ### React Router Integration
// ```jsx
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// function App() {
//   const location = useLocation();
  
//   useEffect(() => {
//     // Track when users land on success pages
//     if (location.pathname.includes('/signup/success')) {
//       if (window.Reddimon) {
//         window.Reddimon.trackSignup();
//       }
//     }
//   }, [location]);
  
//   return <div>Your app</div>;
// }
// ```

// The script handles all the complex tracking logic automatically while providing a simple API for manual tracking when needed.