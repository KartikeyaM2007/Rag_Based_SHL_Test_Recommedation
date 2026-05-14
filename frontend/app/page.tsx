import Search from '../components/Search';

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 relative">
          {/* Subtle glow behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-blue-600/20 blur-[100px] pointer-events-none" />
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            RAG Assessment <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Recommender</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Find the perfect assessment for your role using AI-powered semantic search and reasoning.
          </p>
        </div>

        <Search />
      </main>

      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>© 2025 SHL Assessment Recommender. Powered by Gemini & Hybrid Search.</p>
      </footer>
    </div>
  );
}
