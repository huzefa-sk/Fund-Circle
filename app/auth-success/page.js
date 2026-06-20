"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    try {
        window.opener.location.href = "/dashboard";
        window.close();
      
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