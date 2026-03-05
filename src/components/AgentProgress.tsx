/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentInfo } from '../types';

interface Props {
  agent: AgentInfo | null;
  action: string | null;
  progress: number;
}

export default function AgentProgress({ agent, action, progress }: Props) {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-[60]">
      <AnimatePresence mode="wait">
        {agent && (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-[32px] p-6 shadow-2xl border border-[#141414]/5 flex items-center gap-4"
          >
            <div className="relative">
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                className="w-16 h-16 rounded-2xl object-cover shadow-inner"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-0.5">
                  {agent.role}
                </span>
                <h4 className="text-lg font-medium text-[#141414] truncate">
                  {agent.name}
                </h4>
              </div>
              <p className="text-sm text-gray-500 italic mt-1 truncate">
                {action || 'Обработка данных...'}
              </p>
              
              <div className="mt-4 h-1.5 w-full bg-[#F5F5F0] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#5A5A40]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
