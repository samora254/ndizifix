"use client"

import { useState } from "react"

export default function Page() {
  const [activeTab, setActiveTab] = useState<"overview" | "auth" | "features">("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NdiziFlix
            </h1>
            <p className="text-slate-400 text-sm mt-1">Streaming Entertainment Platform</p>
          </div>
          <div className="text-slate-400 text-sm">
            <p>Powered by Supabase & Expo</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold mb-6">Welcome to NdiziFlix</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            A modern streaming platform with secure authentication, personalized recommendations, and an extensive
            library of movies and series.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-2 mb-8 border-b border-slate-700">
            {(["overview", "auth", "features"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            {activeTab === "overview" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">About NdiziFlix</h3>
                <p className="text-slate-300">
                  NdiziFlix is a premium streaming platform built with modern technologies:
                </p>
                <ul className="space-y-2 text-slate-300 ml-4">
                  <li>
                    ✓ <strong>React Native + Expo</strong> - Cross-platform mobile app
                  </li>
                  <li>
                    ✓ <strong>Supabase</strong> - Secure authentication & database
                  </li>
                  <li>
                    ✓ <strong>Real-time Features</strong> - Watch progress tracking & favorites
                  </li>
                  <li>
                    ✓ <strong>Subscription Management</strong> - Premium tiers with paywall
                  </li>
                  <li>
                    ✓ <strong>Content Library</strong> - Movies, series, and curated recommendations
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "auth" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">Authentication</h3>
                <p className="text-slate-300 mb-4">
                  NdiziFlix uses Supabase authentication with the following features:
                </p>
                <ul className="space-y-3 text-slate-300 ml-4">
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Sign Up</strong> - Create account with email & password
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Sign In</strong> - Secure login with session persistence
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Password Reset</strong> - Email-based account recovery
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span>
                      <strong>Auto Token Refresh</strong> - Seamless session management
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">📱 Mobile App</h4>
                    <p className="text-slate-300 text-sm">Built with React Native & Expo for iOS and Android</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">🔐 Security</h4>
                    <p className="text-slate-300 text-sm">Row-level security, JWT tokens, and encrypted passwords</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">⭐ Favorites</h4>
                    <p className="text-slate-300 text-sm">Save and manage your favorite movies and series</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">📊 Analytics</h4>
                    <p className="text-slate-300 text-sm">Track watch history and get personalized recommendations</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">💳 Subscriptions</h4>
                    <p className="text-slate-300 text-sm">Multiple subscription tiers with premium features</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-400 mb-2">🎬 Content</h4>
                    <p className="text-slate-300 text-sm">Browse movies, series, and discover new releases</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Mobile App</h3>
          <p className="text-slate-300 mb-6">
            NdiziFlix is a mobile-first application designed for iOS and Android. This web page is informational only.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              Download on iOS
            </button>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors">
              Download on Android
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400">
          <p>&copy; 2025 NdiziFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
