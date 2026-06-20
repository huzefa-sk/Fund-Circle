"use client";
import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    // 1. Check if the main window is still listening
    if (window.opener) {
      // 2. Broadcast a success message to the main window
      window.opener.postMessage("oauth-login-success", window.location.origin);
      
      // 3. Close the popup
      window.close();
    } else {
      // Fallback just in case they opened this link directly without a popup
      window.location.replace("/dashboard");
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'white' }}>
      <p>Login successful! Closing...</p>
    </div>
  );
}