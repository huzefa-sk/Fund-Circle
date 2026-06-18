"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { data: session } = useSession();

    // Form States
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
    });


    useEffect(() => {
      
        async function getProfile(){
            const response = await fetch('/api/user/update')
            const data = await response.json()

            console.log(data)
            setFormData({
                username:data.values.username||"",
                bio:data.values.bio||""
            })
            

        }
        getProfile();
        
    }, [])
    

    // Image Preview States 
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ type: "", message: "" });
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (type === "profile") setProfileImage(imageUrl);
            if (type === "cover") setCoverImage(imageUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: "", message: "" });

        // Basic Validation
        if (formData.username.length < 3) {
            setStatus({ type: "error", message: "Username must be at least 3 characters." });
            setIsLoading(false);
            return;
        }

        try {

            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    bio: formData.bio
                })
            })

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({ type: "success", message: "Profile updated successfully" })
            }

            else {
                setStatus({ type: "error", message: result.message || "Failed to update" })
            }
        } catch (error) {

            console.error("Submission error:", error);
            setStatus({ type: "error", message: "A network error occurred. Please try again." });
        } finally {

            setIsLoading(false);
        }

    }


    return (
        <div className="max-h-[90vh]  bg-[#050505] flex justify-center p-4 font-sans custom-scrollbar ">

            {/* Centered Settings Card */}
            <div className="w-full max-h-full max-w-3xl  bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl  flex flex-col my-4">

                {/* Header & Navigation */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h1 className="text-xl font-bold text-white">Settings</h1>
                        <p className="text-sm text-gray-400">Manage your profile and account details.</p>
                    </div>
                    <Link href="/dashboard">
                        <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Dashboard
                        </button>
                    </Link>
                </div>

                {/* Form Content - Removed custom-scrollbar here */}
                <div className="p-6 md:p-8 max-h-full overflow-y-auto custom-scrollbar">

                    {/* Profile Preview Section */}
                    <div className="mb-10">
                        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Profile Preview</h2>
                        <div className="rounded-xl overflow-y-auto border border-white/10 bg-[#121212] relative">
                            {/* Cover Image Preview */}
                            <div className="h-32 w-full bg-white/5 relative">
                                {coverImage ? (
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-gray-600 text-sm">No Cover Image</div>
                                )}
                            </div>

                            {/* Avatar Preview */}
                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-10 border-4 border-[#121212] rounded-full overflow-hidden bg-[#1a1a1a] w-20 h-20">
                                    <img
                                        src={profileImage || session?.user?.image || "https://ui-avatars.com/api/?name=U&background=333&color=fff"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="pt-12">
                                    <h3 className="text-lg font-bold text-white">{session?.user?.name || "Your Name"}</h3>
                                    <p className="text-sm text-gray-400">@{formData.username || "username"}</p>
                                    <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap">
                                        {formData.bio || "Your bio will appear here."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* 1. Profile Information */}
                        <section className="space-y-6">
                            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/5 pb-2">1. Profile Information</h2>

                            {/* Image Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                                    <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white/[0.02] border-2 border-white/10 border-dashed rounded-xl appearance-none cursor-pointer hover:border-gray-400 hover:bg-white/[0.04] focus:outline-none">
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            <span className="text-sm font-medium text-gray-400">Upload Avatar</span>
                                        </span>
                                        <input type="file" name="profileImage" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "profile")} />
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                                    <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white/[0.02] border-2 border-white/10 border-dashed rounded-xl appearance-none cursor-pointer hover:border-gray-400 hover:bg-white/[0.04] focus:outline-none">
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            <span className="text-sm font-medium text-gray-400">Upload Cover</span>
                                        </span>
                                        <input type="file" name="coverImage" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "cover")} />
                                    </label>
                                </div>
                            </div>

                            {/* Text Inputs */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">@</span>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all placeholder:text-gray-600"
                                        placeholder="your_username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                {/* Removed custom-scrollbar here */}
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all placeholder:text-gray-600 resize-none"
                                    placeholder="Tell your supporters a little about yourself..."
                                ></textarea>
                            </div>
                        </section>

                        {/* 2. Account Information (Read Only) */}
                        <section className="space-y-6">
                            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider border-b border-white/5 pb-2">2. Account Information</h2>
                            <p className="text-xs text-gray-500 -mt-4 mb-4">These details are synced from your OAuth provider (Google/GitHub) and cannot be changed here.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={session?.user?.name || "Loading..."}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={session?.user?.email || "Loading..."}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-4 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Status Messages */}
                        {status.message && (
                            <div className={`p-4 rounded-xl text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                {status.message}
                            </div>
                        )}

                        {/* Footer / Save Button */}
                        <div className="pt-6 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-white text-black hover:bg-gray-200 font-medium px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}