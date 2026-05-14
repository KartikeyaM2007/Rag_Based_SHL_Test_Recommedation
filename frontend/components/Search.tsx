'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServerStatus } from './ServerStatusProvider';
import WorkflowVisualizer, { WorkflowState } from './WorkflowVisualizer';

interface Assessment {
    url: string;
    name: string;
    adaptive_support: string;
    description: string;
    duration: number;
    remote_support: string;
    test_type: string[];
}

interface SearchResult {
    recommended_assessments: Assessment[];
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<WorkflowState>('idle');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const { isReady, statusMessage } = useServerStatus();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setStatus('querying');
        setError('');
        setResults(null);

        try {
            // Simulate progression since backend doesn't stream
            const timers = [
                setTimeout(() => setStatus('embedding'), 1000),
                setTimeout(() => setStatus('rag'), 2500),
            ];

            const response = await fetch(`/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query, top_k: 10 }),
            });

            timers.forEach(clearTimeout); // Clear simulated timers when actual response arrives

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            setResults(data);
            setStatus('done');
        } catch (err) {
            setError('An error occurred while fetching recommendations. Please try again.');
            console.error(err);
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
            {/* Left Column: Workflow Visualizer */}
            <div className="w-full lg:w-1/3">
                <div className="sticky top-8">
                    <WorkflowVisualizer status={status} />
                </div>
            </div>

            {/* Right Column: Search Interface */}
            <div className="w-full lg:w-2/3">
                <form onSubmit={handleSearch} className="mb-8 relative z-10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isReady ? "Describe the role (e.g., 'Java developer with collaboration skills')..." : statusMessage}
                            disabled={!isReady || loading}
                            className="flex-1 p-4 rounded-xl border border-gray-800 bg-black/50 backdrop-blur-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-[0_0_15px_rgba(59,130,246,0.1)] disabled:opacity-60 disabled:cursor-not-allowed placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={!isReady || loading}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="p-4 mb-6 bg-red-900/20 text-red-400 rounded-xl border border-red-800/50 relative z-10 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {results && (
                    <AnimatePresence>
                        <motion.div
                            className="space-y-6 relative z-10"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.07 } },
                            }}
                        >
                            <motion.div
                                className="flex items-center justify-between text-sm text-gray-400"
                                variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>Found {results.recommended_assessments.length} recommendations</p>
                            </motion.div>

                            <div className="grid gap-6">
                                {results.recommended_assessments.map((assessment, index) => (
                                    <motion.div
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 24, scale: 0.98 },
                                            visible: { opacity: 1, y: 0, scale: 1 },
                                        }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="p-6 bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                <a href={assessment.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                                    {assessment.name}
                                                </a>
                                            </h3>
                                        </div>

                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                            {assessment.description}
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                            <div className="flex items-center gap-2 text-sm bg-black/40 px-3 py-2 rounded-lg border border-gray-800">
                                                <span className="font-semibold text-gray-400">Duration:</span>
                                                <span className="text-gray-200">{assessment.duration} min</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-black/40 px-3 py-2 rounded-lg border border-gray-800">
                                                <span className="font-semibold text-gray-400">Remote:</span>
                                                <span className="text-gray-200">{assessment.remote_support}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm bg-black/40 px-3 py-2 rounded-lg border border-gray-800">
                                                <span className="font-semibold text-gray-400">Adaptive:</span>
                                                <span className="text-gray-200">{assessment.adaptive_support}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {assessment.test_type.map((type, i) => (
                                                <span key={i} className="px-3 py-1 text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-800/50 rounded-full">
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
