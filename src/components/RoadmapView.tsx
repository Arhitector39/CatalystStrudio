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
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-serif italic mb-6">Этап 2: Стратегический План</h2>
        <p className="text-gray-500 leading-relaxed">
          Наш Project Manager сформировал детальный roadmap реализации вашего проекта.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block" />

        <div className="space-y-12">
          {roadmap.stages.map((stage, sIdx) => (
            <motion.div 
              key={sIdx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.1 }}
              className="relative md:pl-24"
            >
              {/* Stage Marker */}
              <div className="absolute left-0 top-0 hidden md:flex w-16 h-16 bg-white border-4 border-[#5A5A40] rounded-2xl items-center justify-center z-10 shadow-lg">
                <span className="text-xl font-bold text-[#5A5A40]">{sIdx + 1}</span>
              </div>

              <div className="bg-white p-10 rounded-[48px] border border-[#141414]/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-[#5A5A40]">
                      <Flag size={24} />
                    </div>
                    <h3 className="text-2xl font-bold">{stage.name}</h3>
                  </div>
                  <div className="px-4 py-1.5 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {stage.tasks.length} задач
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stage.tasks.map((task, tIdx) => (
                    <div 
                      key={tIdx} 
                      className="p-6 bg-[#FDFDFB] rounded-3xl border border-[#141414]/5 flex items-start gap-4 group hover:border-[#5A5A40]/20 transition-colors"
                    >
                      <div className="mt-1 text-gray-300 group-hover:text-[#5A5A40] transition-colors">
                        {task.priority === 'MVP' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">{task.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {task.assignee}
                          </span>
                          {task.priority === 'MVP' && (
                            <span className="text-[8px] font-bold uppercase tracking-tighter bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
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

      <div className="flex justify-center pt-8">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="px-16 py-5 bg-[#5A5A40] text-white rounded-full font-bold flex items-center gap-3 hover:bg-[#4A4A30] transition-all shadow-2xl shadow-[#5A5A40]/30 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Подготовка офиса...
            </>
          ) : (
            <>
              Запустить Виртуальный Офис
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
