/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentInfo } from '../types';
import LiveOffice from './LiveOffice';

interface Props {
  agent: AgentInfo | null;
  action: string | null;
  progress: number;
}

export default function AgentProgress({ agent, action, progress }: Props) {
  return (
    <AnimatePresence mode="wait">
      {agent && (
        <>
          {/* Live Office Visualization in the Center */}
          <div className="fixed inset-0 flex items-center justify-center z-[50] pointer-events-none p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-5xl h-[70vh] pointer-events-auto"
            >
              <LiveOffice />
            </motion.div>
          </div>

          {/* Corner Notification */}
          <div className="fixed bottom-6 right-6 z-[100] pointer-events-none w-full max-w-sm">
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="bg-white rounded-3xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-gray-200 flex items-center gap-5 pointer-events-auto"
            >
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-[#007AFF] rounded-2xl blur-xl opacity-20 animate-pulse" />
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-16 h-16 rounded-2xl object-cover shadow-xl ring-4 ring-blue-100 relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-lg z-20" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col mb-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#007AFF] mb-0.5">
                    {agent.role}
                  </span>
                  <h4 className="text-lg font-serif italic text-[#1A1A1A] truncate">
                    {agent.name}
                  </h4>
                </div>
                
                <p className="text-gray-500 italic text-xs truncate mb-3">
                  {action || 'Обработка данных...'}
                </p>
                
                <div className="relative h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-[#007AFF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">
                    Catalyst
                  </p>
                  <p className="text-[8px] font-bold text-[#007AFF]">
                    {Math.round(progress)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
