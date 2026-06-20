"use client";

import { useEffect } from "react";

export default function AuthSuccess() {
  useEffect(() => {
    console.log("opener:", window.opener);

    try {
      if (window.opener && !window.opener.closed) {
        console.log("popup flow");
        window.opener.location.href = "/dashboard";
        window.close();
      } else {
        console.log("normal flow");
        window.location.replace("/dashboard");
      }
    } catch (error) {
      console.log(error);
      window.location.replace("/dashboard");
    }
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'white' }}>
      <p>Login successful! Redirecting...</p>
    </div>
  );
}