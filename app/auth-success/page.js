"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = "/dashboard";

        setTimeout(() => {
          window.close();
        }, 500);
      }
    } catch (error) {
      window.location.replace("/dashboard");
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'white' }}>
      <p>Login successful! Redirecting...</p>
    </div>
  );
}