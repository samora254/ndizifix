"use client"

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#FFFFFF",
        padding: "24px",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          marginBottom: "8px",
          letterSpacing: "2px",
        }}
      >
        <span style={{ color: "#22C55E" }}>NDIZI</span>
        <span style={{ color: "#EF4444" }}>FLIX</span>
      </h1>

      <div
        style={{
          width: "120px",
          height: "4px",
          backgroundColor: "#F59E0B",
          borderRadius: "2px",
          margin: "16px 0 32px 0",
        }}
      />

      <p
        style={{
          fontSize: "18px",
          color: "#888",
          marginBottom: "32px",
          maxWidth: "500px",
          lineHeight: "1.6",
        }}
      >
        Welcome to NdiziFlix - Your streaming entertainment platform with Supabase authentication.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "32px",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1A1A1A",
            borderRadius: "12px",
            border: "1px solid #2A2A2A",
          }}
        >
          <h3 style={{ marginBottom: "8px", color: "#22C55E" }}>✅ Auth Ready</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Sign in/up with Supabase email & password authentication</p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#1A1A1A",
            borderRadius: "12px",
            border: "1px solid #2A2A2A",
          }}
        >
          <h3 style={{ marginBottom: "8px", color: "#22C55E" }}>✅ Features</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Watch movies, series, track progress & manage your list</p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#1A1A1A",
            borderRadius: "12px",
            border: "1px solid #2A2A2A",
          }}
        >
          <h3 style={{ marginBottom: "8px", color: "#22C55E" }}>✅ Secure</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Screenshot protection & secure password recovery</p>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#1A1A1A",
            borderRadius: "12px",
            border: "1px solid #2A2A2A",
          }}
        >
          <h3 style={{ marginBottom: "8px", color: "#22C55E" }}>✅ Database</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Powered by Supabase PostgreSQL backend</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "48px",
          padding: "24px",
          backgroundColor: "#1A1A1A",
          borderRadius: "12px",
          maxWidth: "600px",
          border: "1px solid #2A2A2A",
        }}
      >
        <h2 style={{ marginBottom: "16px", color: "#FFFFFF" }}>🚀 Getting Started</h2>
        <div style={{ textAlign: "left", fontSize: "14px", color: "#888", lineHeight: "1.8" }}>
          <p style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#22C55E" }}>1. Create Account:</strong> Use the sign-up page to register
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#22C55E" }}>2. Sign In:</strong> Login with your credentials
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#22C55E" }}>3. Subscribe:</strong> Choose a subscription plan
          </p>
          <p style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#22C55E" }}>4. Explore:</strong> Browse movies, series & build your list
          </p>
          <p style={{ marginBottom: "0" }}>
            <strong style={{ color: "#22C55E" }}>5. Reset Password:</strong> Use email recovery if needed
          </p>
        </div>
      </div>

      <p
        style={{
          marginTop: "48px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        This is an Expo React Native app. Download on iOS/Android to experience the full app.
      </p>
    </div>
  )
}
