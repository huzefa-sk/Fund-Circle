import Link from "next/link";

export default function Home() {
  return (
    <div className="text-white flex flex-col items-center justify-center text-center flex-1 gap-6 px-4 min-h-[80vh]">
      
      {/* Personalized Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-[-5vh]">
        Support My Engineering Projects
      </h1>

      {/* First-Person Description */}
      <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
        Hi, I'm Huzefa Shaikh. I build web applications, embedded systems, and hardware projects. If you find my open-source work or tutorials helpful, consider leaving a tip to fuel the next build!
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {/* Next.js Link pointing to our new route */}
        <Link href="/support">
          <button
            className="bg-gradient-to-br from-purple-600 to-blue-500 hover:scale-105 transition-transform duration-200 text-white font-semibold rounded-xl px-8 py-3.5 shadow-lg shadow-purple-500/20 w-full sm:w-auto"
          >
            Support My Work
          </button>
        </Link>

        {/* Portfolio Link */}
        <a
          href="https://github.com/huzefa-sk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="border border-white/20 hover:bg-white/10 transition-colors text-gray-300 font-medium px-8 py-3.5 rounded-xl w-full sm:w-auto"
          >
            My Github
          </button>
        </a>
      </div>

    </div>
  );
}