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
  User,
  Clock,
  Target
} from 'lucide-react';
import { AgentOutput, AGENTS } from '../types';

interface Props {
  outputs: AgentOutput[];
  onNext: () => void;
  isLoading: boolean;
}

const AGENT_ICONS: Record<string, any> = {
  analyst: BarChart3,
  pm: Briefcase,
  product: Layout,
  uxui: Layout,
  psychologist: BrainCircuit,
  ios: Code,
  android: Code,
  frontend: Code,
  backend: Settings,
  architect: Settings,
  qa: ShieldCheck,
  devops: Settings,
  aso: Megaphone,
  marketing: Megaphone,
  target: Megaphone,
  data_analyst: BarChart3,
};

export default function OfficeView({ outputs, onNext, isLoading }: Props) {
  const [selectedAgentId, setSelectedAgentId] = useState(outputs[0]?.agentId || '');

  const selectedOutput = outputs.find(o => o.agentId === selectedAgentId);
  const selectedAgentInfo = AGENTS.find(a => a.id === selectedAgentId);
  const Icon = selectedOutput ? (AGENT_ICONS[selectedOutput.agentId] || User) : User;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#007AFF] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm"
        >
          <Briefcase size={12} />
          Этап 3: Виртуальный офис
        </motion.div>
        <h2 className="text-5xl font-serif italic mb-6 leading-tight">Команда в работе</h2>
        <p className="text-gray-500 text-lg leading-relaxed font-medium opacity-80">
          Результаты работы узкоспециализированных ИИ-агентов.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4 px-2">Специалисты</h3>
            <div className="space-y-1">
              {outputs.map((output) => {
                const AgentIcon = AGENT_ICONS[output.agentId] || User;
                const isSelected = selectedAgentId === output.agentId;

                return (
                  <button
                    key={output.agentId}
                    onClick={() => setSelectedAgentId(output.agentId)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left group ${
                      isSelected 
                        ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-200' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      <AgentIcon size={16} />
                    </div>
                    <span className="flex-1 text-xs font-medium truncate">{output.role}</span>
                    {isSelected && <ChevronRight size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {selectedOutput ? (
              <motion.div
                key={selectedAgentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Light Header Card */}
                <div className="bg-white rounded-[32px] p-8 text-[#1A1A1A] shadow-xl border border-blue-50 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                        <Icon size={32} className="text-[#007AFF]" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-serif italic mb-0.5">{selectedOutput.role}</h3>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-[9px]">Отчет специалиста</p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Цели</h4>
                      <p className="text-lg leading-relaxed text-gray-700">{selectedOutput.goals}</p>
                    </div>
                  </div>
                </div>

                {/* Key Decisions */}
                <section className="space-y-4">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 px-2">
                    <Clock size={12} /> Ключевые решения
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOutput.decisions.map((decision, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-gray-700 leading-relaxed">{decision}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Artifacts */}
                <section className="space-y-4">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 px-2">
                    <FileText size={12} /> Артефакты и детализация
                  </h4>
                  <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 lg:p-10">
                    <div className="prose prose-sm prose-stone max-w-none prose-headings:font-serif prose-headings:italic prose-p:leading-relaxed">
                      <Markdown>{selectedOutput.artifacts}</Markdown>
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-16 text-gray-400 italic bg-white rounded-[32px] border border-dashed border-gray-200">
                Выберите специалиста для просмотра деталей
              </div>
            )}
          </AnimatePresence>

          <div className="flex justify-center pt-2">
            <button
              onClick={onNext}
              disabled={isLoading}
              className="w-full py-5 bg-[#007AFF] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#0066DD] transition-all shadow-xl disabled:opacity-50 group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Создание книги...
                </>
              ) : (
                <>
                  Создать книгу
                  <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
