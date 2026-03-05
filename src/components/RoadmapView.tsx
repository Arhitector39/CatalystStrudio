/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Loader2, Flag, Circle } from 'lucide-react';
import { ProjectRoadmap } from '../types';

interface Props {
  roadmap: ProjectRoadmap;
  onNext: () => void;
  isLoading: boolean;
}

export default function RoadmapView({ roadmap, onNext, isLoading }: Props) {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#007AFF] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm"
        >
          <Flag size={12} />
          Этап 2: Стратегический План
        </motion.div>
        <h2 className="text-5xl font-serif italic mb-6 leading-tight">Путь к реализации</h2>
        <p className="text-gray-500 text-lg leading-relaxed font-medium opacity-80">
          Наш Project Manager сформировал детальный roadmap реализации вашего проекта.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block" />

        <div className="space-y-8">
          {roadmap.stages.map((stage, sIdx) => (
            <motion.div 
              key={sIdx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="relative md:pl-16"
            >
              <div className="absolute left-0 top-0 hidden md:flex w-12 h-12 bg-white border-2 border-[#007AFF] rounded-xl items-center justify-center z-10 shadow-md">
                <span className="text-lg font-bold text-[#007AFF]">{sIdx + 1}</span>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#007AFF]">
                      <Flag size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">{stage.name}</h3>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-[#007AFF] rounded-lg text-[9px] font-bold uppercase tracking-widest">
                    {stage.tasks.length} задач
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stage.tasks.map((task, tIdx) => (
                    <div 
                      key={tIdx} 
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3 group hover:border-[#007AFF]/30 transition-all"
                    >
                      <div className="mt-1 text-gray-300 group-hover:text-[#007AFF] transition-colors">
                        {task.priority === 'MVP' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-900 mb-1">{task.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                            {task.assignee}
                          </span>
                          {task.priority === 'MVP' && (
                            <span className="text-[8px] font-bold uppercase tracking-tighter bg-blue-100 text-[#007AFF] px-1.5 py-0.5 rounded">
                              MVP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="w-full max-w-md py-5 bg-[#007AFF] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#0066DD] transition-all shadow-xl disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Подготовка...
            </>
          ) : (
            <>
              Запустить Виртуальный Офис
              <ArrowRight size={24} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
