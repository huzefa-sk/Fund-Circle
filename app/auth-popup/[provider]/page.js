"use client";

import { signIn } from "next-auth/react";
import { useEffect, use } from "react"; // Added 'use' for Next.js 15+

export default function ProviderPopup({ params }) {
  // If you are on Next.js 15, params is a Promise. We 'use' it to get the values.
  const resolvedParams = use(params); 
  const provider = resolvedParams.provider;

  useEffect(() => {
    if (provider) {
      // This MUST be a string like "google" or "github"
      signIn(provider, { callbackUrl: "/auth-success" });
    }
  }, [provider]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'white' }}>
      <p>Redirecting to {provider}...</p>
    </div>
  );
}