/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Briefcase, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  Layout, 
  Code, 
  ShieldCheck, 
  BarChart3, 
  Megaphone,
  BrainCircuit,
  Settings,
  Sparkles,
  Loader2,
  User
} from 'lucide-react';
import { AgentOutput, AGENTS } from '../types';

interface Props {
  outputs: AgentOutput[];
  onNext: () => void;
  isLoading: boolean;
}

const AGENT_ICONS: Record<string, any> = {
  analyst: Briefcase,
  pm: Settings,
  product: BrainCircuit,
  uxui: Layout,
  psychologist: BrainCircuit,
  ios: Code,
  android: Code,
  frontend: Code,
  backend: Code,
  architect: ShieldCheck,
  qa: CheckCircle2,
  devops: Settings,
  aso: BarChart3,
  marketing: Megaphone,
  target: BarChart3,
  data_analyst: BarChart3,
};

export default function OfficeView({ outputs, onNext, isLoading }: Props) {
  const [selectedAgentId, setSelectedAgentId] = useState(outputs[0]?.agentId || '');

  const selectedOutput = outputs.find(o => o.agentId === selectedAgentId);
  const selectedAgentInfo = AGENTS.find(a => a.id === selectedAgentId);
  const Icon = selectedOutput ? (AGENT_ICONS[selectedOutput.agentId] || User) : User;

  return (
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-serif italic mb-6">Виртуальный Офис</h2>
        <p className="text-gray-500 leading-relaxed">
          Наши специалисты проработали каждый аспект вашего проекта. Выберите агента, чтобы увидеть результаты.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 bg-gray-50 rounded-3xl mb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-4">Команда проекта</h3>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {outputs.map((output) => {
                const agent = AGENTS.find(a => a.id === output.agentId);
                const AgentIcon = AGENT_ICONS[output.agentId] || User;
                const isSelected = selectedAgentId === output.agentId;

                return (
                  <button
                    key={output.agentId}
                    onClick={() => setSelectedAgentId(output.agentId)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
                      isSelected 
                        ? 'bg-white shadow-md border border-[#141414]/5 text-[#5A5A40]' 
                        : 'hover:bg-white/60 text-gray-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#5A5A40] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      <AgentIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{agent?.name || output.role}</p>
                      <p className="text-[10px] uppercase tracking-tighter opacity-60 truncate">{output.role}</p>
                    </div>
                    {isSelected && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedOutput && selectedAgentInfo ? (
              <motion.div
                key={selectedAgentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[48px] border border-[#141414]/5 shadow-sm p-10 lg:p-16 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Icon size={160} />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                    <img 
                      src={selectedAgentInfo.avatar} 
                      alt={selectedAgentInfo.name} 
                      className="w-24 h-24 rounded-3xl object-cover shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-3xl font-bold mb-1">{selectedAgentInfo.name}</h3>
                      <p className="text-[#5A5A40] font-bold uppercase tracking-widest text-xs mb-4">{selectedOutput.role}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle2 size={12} /> В сети
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <FileText size={12} /> Отчет готов
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="p-8 bg-[#FDFDFB] rounded-[32px] border border-[#141414]/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Цели и задачи</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedOutput.goals}</p>
                    </div>
                    <div className="p-8 bg-[#FDFDFB] rounded-[32px] border border-[#141414]/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Ключевые решения</h4>
                      <ul className="space-y-3">
                        {selectedOutput.decisions.map((decision, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5A5A40] flex-shrink-0" />
                            {decision}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-[#141414]/5 pt-12">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                      <FileText size={14} /> Артефакты и наработки
                    </h4>
                    <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:italic">
                      <Markdown>{selectedOutput.artifacts}</Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-20 text-gray-400 italic">
                Выберите специалиста для просмотра деталей
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center pt-12">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="px-16 py-6 bg-[#141414] text-white rounded-full font-bold flex items-center gap-4 hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 group"
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Создание книги...
            </>
          ) : (
            <>
              Собрать финальную книгу
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
