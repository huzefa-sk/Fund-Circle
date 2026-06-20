"use client";
import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    if (window.opener) {
     // Broadcast a success message to the main window
      window.opener.postMessage("oauth-login-success", window.location.origin);
      
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