"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Unified State
  const [profileData, setProfileData] = useState({ username: "", bio: "" });
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Single useEffect to fetch everything
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Profile (User)
        const profileRes = await fetch('/api/user/update');
        const profileResult = await profileRes.json();
        
        if (profileResult.success && profileResult.values) {
          setProfileData({
            username: profileResult.values.username || "",
            bio: profileResult.values.bio || "",
          });
        }

        // 2. Fetch Ledger (Supports)
        const supportRes = await fetch('/api/support');
        const supportResult = await supportRes.json();
        
        if (supportResult.success && supportResult.data) {
          setContributions(supportResult.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only run the fetch if we know exactly who the user is
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  return (
    <div className="max-h-full bg-[#050505] flex justify-center p-4 font-sans selection:bg-purple-500/30">
      <div className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Top Half: Profile & Header */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

            <div className="flex items-center gap-4">
              <img
                src={session?.user?.image || "https://ui-avatars.com/api/?name=U&background=6B21A8&color=fff"}
                alt="Profile"
                className="w-16 h-16 rounded-full border border-white/10 object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {session?.user?.name || "Supporter"}
                </h1>

                {profileData.username && (
                  <p className="text-sm font-medium text-purple-400 mb-1">
                    @{profileData.username}
                  </p>
                )}

                <p className="text-sm text-gray-400 max-w-md line-clamp-2">
                  {profileData.bio || "No bio provided."}
                </p>
              </div>
            </div>

            <Link href="/settings">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 transition-colors px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 mt-4 sm:mt-0">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Settings
              </button>
            </Link>

          </div>
        </div>

        {/* Bottom Half: Contribution History */}
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Support History</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : contributions.length > 0 ? (
            <div className="custom-scrollbar space-y-3 max-h-96 overflow-y-auto pr-2">
              {contributions.map((item) => (
                <div key={item._id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-purple-400">₹{item.amount}</span>
                    <span className="text-sm text-gray-400">from <span className="font-semibold text-white">{item.name}</span></span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {item.message ? (
                    <p className="text-sm text-gray-300 italic leading-relaxed">&quot;{item.message}&quot;</p>
                  ) : (
                    <p className="text-sm text-gray-600 italic">No message attached.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/[0.01] rounded-xl border border-dashed border-white/10">
              <p className="text-gray-400">No contributions yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}