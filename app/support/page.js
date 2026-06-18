import SupportForm from "@/components/SupportForm";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 w-full">
      
      {/* Navigation aid to let users easily go back */}
      <div className="w-full max-w-md mb-6">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 w-fit text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* The form component we built earlier */}
      <div className="w-full max-w-md">
        <SupportForm />
      </div>

    </div>
  );
}