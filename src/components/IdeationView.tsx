/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Sparkles, ArrowRight, Lightbulb, Zap, Combine, Loader2 } from 'lucide-react';
import { IdeationResult } from '../types';

interface Props {
  result: IdeationResult;
  onNext: () => void;
  isLoading: boolean;
}

export default function IdeationView({ result, onNext, isLoading }: Props) {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#007AFF] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm"
        >
          <Zap size={12} />
          Этап 1: Генерация и Синтез
        </motion.div>
        <h2 className="text-5xl font-serif italic mb-6 leading-tight">Ваша идея обретает форму</h2>
        <p className="text-gray-500 text-lg leading-relaxed font-medium opacity-80">
          Наши Идеаторы предложили разные подходы, а Синтезатор объединил их в единую мощную концепцию.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Lightbulb size={100} />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[9px] text-gray-400">Идеатор A</h3>
              <p className="font-bold text-base">Креативный подход</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none">
            <Markdown>{result.ideatorA}</Markdown>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles size={100} />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[9px] text-gray-400">Идеатор B</h3>
              <p className="font-bold text-base">Альтернативный взгляд</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none">
            <Markdown>{result.ideatorB}</Markdown>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white text-[#1A1A1A] p-10 lg:p-14 rounded-[48px] shadow-xl border border-blue-50 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-50/30 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
              <Combine size={32} className="text-[#007AFF]" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px] text-blue-400">Синтезатор Концепций</h3>
              <p className="text-4xl font-serif italic leading-tight">Итоговая Концепция</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none mb-12 leading-relaxed text-gray-700 
            prose-strong:text-[#007AFF] prose-strong:font-bold
            prose-headings:text-[#1A1A1A] prose-headings:font-serif prose-headings:italic">
            <Markdown>{result.synthesized}</Markdown>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={isLoading}
              className="w-full max-w-md py-5 bg-[#007AFF] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#0066DD] transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Создание плана...
                </>
              ) : (
                <>
                  Перейти к планированию
                  <ArrowRight size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
