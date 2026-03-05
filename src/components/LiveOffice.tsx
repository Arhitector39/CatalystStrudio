/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { OfficeRenderer } from '../render/OfficeRenderer';
import { agentSimulator } from '../net/AgentSimulator';
import { agentStore, AgentState } from '../state/AgentStore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Info, X } from 'lucide-react';

export default function LiveOffice() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<OfficeRenderer | null>(null);
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const init = async () => {
      const response = await fetch('/zones.json');
      const zonesConfig = await response.json();

      if (containerRef.current && !rendererRef.current) {
        rendererRef.current = new OfficeRenderer(containerRef.current, zonesConfig);
        await rendererRef.current.init();
      }
    };

    init();
    agentSimulator.start();

    const unsubscribe = agentStore.subscribe((updatedAgents) => {
      setAgents([...updatedAgents]);
    });

    return () => {
      unsubscribe();
      agentSimulator.stop();
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
      }
    };
  }, []);

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-[48px] overflow-hidden shadow-2xl border border-blue-50">
      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Поиск агента..."
              className="pl-9 pr-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-48 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#007AFF] shadow-sm">
            Активно: {agents.length}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="p-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full text-gray-400 hover:text-[#007AFF] transition-colors shadow-sm">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* PixiJS Container */}
      <div ref={containerRef} className="flex-1 w-full h-full cursor-crosshair" />

      {/* Side Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-white/90 backdrop-blur-xl border-l border-gray-100 p-8 shadow-2xl z-20"
          >
            <button 
              onClick={() => setSelectedAgent(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] border border-blue-100">
                  <Info size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-serif italic">{selectedAgent.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{selectedAgent.status}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Текущая задача</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedAgent.task}</p>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Прогресс</p>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#007AFF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedAgent.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent List Overlay (Bottom) */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto pb-4 no-scrollbar pointer-events-none">
        {filteredAgents.map(agent => (
          <button
            key={agent.agent_id}
            onClick={() => setSelectedAgent(agent)}
            className={`flex-shrink-0 px-4 py-3 bg-white/90 backdrop-blur-md border rounded-2xl flex items-center gap-3 shadow-lg hover:bg-white transition-all pointer-events-auto ${selectedAgent?.agent_id === agent.agent_id ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100'}`}
          >
            <div className={`w-2 h-2 rounded-full ${agent.status === 'error' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-[#1A1A1A] truncate w-24">{agent.name}</p>
              <p className="text-[8px] text-gray-400 uppercase tracking-widest">{agent.status}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
