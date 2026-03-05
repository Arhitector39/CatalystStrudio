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
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-serif italic mb-6">Этап 1: Генерация и Синтез</h2>
        <p className="text-gray-500 leading-relaxed">
          Наши Идеаторы предложили разные подходы, а Синтезатор объединил их в единую мощную концепцию.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[40px] border border-[#141414]/5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Lightbulb size={120} />
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Идеатор A</h3>
              <p className="font-bold text-lg">Креативный подход</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none">
            <Markdown>{result.ideatorA}</Markdown>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[40px] border border-[#141414]/5 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles size={120} />
          </div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Идеатор B</h3>
              <p className="font-bold text-lg">Альтернативный взгляд</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none">
            <Markdown>{result.ideatorB}</Markdown>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#5A5A40] text-white p-12 rounded-[56px] shadow-2xl shadow-[#5A5A40]/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Combine size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-widest text-[10px] text-white/60">Синтезатор Концепций</h3>
              <p className="text-3xl font-serif italic">Итоговая Концепция</p>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <Markdown>{result.synthesized}</Markdown>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onNext}
              disabled={isLoading}
              className="px-12 py-5 bg-white text-[#5A5A40] rounded-full font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Создание плана...
                </>
              ) : (
                <>
                  Перейти к планированию
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
