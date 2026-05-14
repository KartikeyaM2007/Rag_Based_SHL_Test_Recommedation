'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Globe, BrainCircuit, Database, ListChecks, CheckCircle2 } from 'lucide-react';

export type WorkflowState = 'idle' | 'querying' | 'embedding' | 'rag' | 'done';

const NODES = [
  {
    id: 'user',
    label: 'User Query',
    sublabel: 'Input received',
    icon: User,
    activeOn: ['querying', 'embedding', 'rag', 'done'],
    processingOn: ['querying'],
  },
  {
    id: 'api',
    label: 'API Gateway',
    sublabel: 'FastAPI → Render',
    icon: Globe,
    activeOn: ['querying', 'embedding', 'rag', 'done'],
    processingOn: ['querying'],
  },
  {
    id: 'hyde',
    label: 'HyDE Expansion',
    sublabel: 'Gemini query rewrite',
    icon: BrainCircuit,
    activeOn: ['embedding', 'rag', 'done'],
    processingOn: ['embedding'],
  },
  {
    id: 'retrieval',
    label: 'Hybrid Retrieval',
    sublabel: 'Vector + TF-IDF fused',
    icon: Database,
    activeOn: ['rag', 'done'],
    processingOn: ['rag'],
  },
  {
    id: 'rerank',
    label: 'LLM Rerank',
    sublabel: 'Gemini reranker + output',
    icon: ListChecks,
    activeOn: ['done'],
    processingOn: [],
  },
];

function NodeDot({
  node,
  status,
  index,
}: {
  node: (typeof NODES)[0];
  status: WorkflowState;
  index: number;
}) {
  const isActive = node.activeOn.includes(status);
  const isProcessing = node.processingOn.includes(status);
  const isDone = status === 'done' || (isActive && !isProcessing);

  return (
    <div className="flex items-center gap-4 relative z-10">
      {/* Icon bubble */}
      <div className="relative flex-shrink-0">
        {/* Outer glow ring when processing */}
        {isProcessing && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-blue-500/30"
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        )}

        <motion.div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
            isProcessing
              ? 'border-blue-400 bg-blue-900/60 text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.7)]'
              : isDone && status !== 'idle'
              ? 'border-gray-600 bg-gray-800/80 text-gray-300'
              : 'border-gray-800 bg-gray-900/60 text-gray-600'
          }`}
          initial={false}
          animate={isProcessing ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ repeat: isProcessing ? Infinity : 0, duration: 1.4 }}
        >
          {isDone && status !== 'idle' && !isProcessing ? (
            <CheckCircle2 size={20} className="text-green-400" />
          ) : (
            <node.icon size={20} />
          )}
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-semibold text-sm transition-colors duration-300 ${
            isProcessing
              ? 'text-blue-300'
              : isDone && status !== 'idle'
              ? 'text-gray-200'
              : 'text-gray-600'
          }`}
        >
          {node.label}
        </span>
        <span
          className={`text-xs transition-colors duration-300 ${
            isProcessing
              ? 'text-blue-500'
              : isDone && status !== 'idle'
              ? 'text-green-500'
              : 'text-gray-700'
          }`}
        >
          {isProcessing ? 'Processing...' : isDone && status !== 'idle' ? node.sublabel : '—'}
        </span>
      </div>
    </div>
  );
}

function ConnectionLine({
  active,
  animating,
}: {
  active: boolean;
  animating: boolean;
}) {
  return (
    <div className="relative ml-6 w-0.5 h-9 bg-gray-800">
      {/* Fill line on completion */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-blue-600"
        initial={{ height: '0%' }}
        animate={{ height: active ? '100%' : '0%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
      {/* Animated particle when filling */}
      {animating && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,1)]"
          initial={{ top: '-4px', opacity: 1 }}
          animate={{ top: 'calc(100% - 4px)', opacity: [1, 1, 0] }}
          transition={{ duration: 0.6, ease: 'linear', repeat: Infinity }}
        />
      )}
    </div>
  );
}

export default function WorkflowVisualizer({ status }: { status: WorkflowState }) {
  // Track which connections are "passed"
  const connectionActive = [
    status !== 'idle', // 0→1
    ['embedding', 'rag', 'done'].includes(status), // 1→2
    ['rag', 'done'].includes(status), // 2→3
    status === 'done', // 3→4
  ];

  const connectionAnimating = [
    status === 'querying', // flowing 0→1
    status === 'embedding', // flowing 1→2
    status === 'rag', // flowing 2→3
    false,
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden w-full">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none rounded-2xl" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-500"
          animate={
            status !== 'idle' && status !== 'done'
              ? { opacity: [1, 0.3, 1] }
              : { opacity: 1 }
          }
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest">
          Pipeline Trace
        </h2>
        {status === 'done' && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto text-xs text-green-400 font-semibold"
          >
            ✓ Complete
          </motion.span>
        )}
      </div>

      {/* Node list with connectors */}
      <div className="flex flex-col">
        {NODES.map((node, i) => (
          <div key={node.id}>
            <NodeDot node={node} status={status} index={i} />
            {i < NODES.length - 1 && (
              <ConnectionLine
                active={connectionActive[i]}
                animating={connectionAnimating[i]}
              />
            )}
          </div>
        ))}
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mt-6 p-3 bg-green-900/30 border border-green-700/50 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-300 text-sm font-semibold">Results Ready</p>
              <p className="text-green-600 text-xs">All pipeline stages completed</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle hint */}
      <AnimatePresence>
        {status === 'idle' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center text-xs text-gray-700"
          >
            Awaiting search query...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
