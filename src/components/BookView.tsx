/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { Book, Sparkles, Code, Megaphone, Layers, ChevronRight } from 'lucide-react';
import { BookContent } from '../types';

interface Props {
  book: BookContent;
}

export default function BookView({ book }: Props) {
  return (
    <div className="max-w-5xl mx-auto space-y-24 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="px-4 py-1.5 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 inline-block">
          Финальный Проект
        </span>
        <h2 className="text-7xl font-serif italic mb-8 leading-tight">{book.title}</h2>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light italic">
          {book.summary}
        </p>
      </motion.div>

      <div className="space-y-16">
        {book.chapters.map((chapter, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[64px] border border-[#141414]/5 shadow-sm overflow-hidden"
          >
            <div className="bg-[#141414] p-10 text-white flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-5xl font-serif italic opacity-30">0{idx + 1}</span>
                <h3 className="text-2xl font-medium">{chapter.title}</h3>
              </div>
              <Layers size={24} className="opacity-20" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-12 lg:p-16 space-y-6 border-b lg:border-b-0 lg:border-r border-[#141414]/5">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <Book size={14} /> Сценарий и Текст
                </h4>
                <div className="prose prose-lg prose-stone max-w-none prose-p:leading-relaxed prose-p:text-gray-700">
                  <Markdown>{chapter.content}</Markdown>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex flex-col divide-y divide-[#141414]/5">
                <div className="p-12 space-y-6 bg-[#FDFDFB]">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5A5A40] flex items-center gap-2">
                    <Sparkles size={14} /> Интерактивная Механика
                  </h4>
                  <p className="text-gray-600 leading-relaxed italic">
                    {chapter.interaction}
                  </p>
                </div>

                <div className="p-12 space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <Layers size={14} /> Визуальное Решение
                  </h4>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {chapter.visuals}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#F5F5F0] p-12 rounded-[48px] border border-[#141414]/5"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white text-[#141414] rounded-2xl flex items-center justify-center shadow-sm">
              <Code size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Технический Манифест</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Архитектура и Стек</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none prose-headings:font-serif prose-headings:italic">
            <Markdown>{book.technicalManifest}</Markdown>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#141414] p-12 rounded-[48px] text-white"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10">
              <Megaphone size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Маркетинговый Кит</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest">Стратегия и Продвижение</p>
            </div>
          </div>
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-serif prose-headings:italic">
            <Markdown>{book.marketingKit}</Markdown>
          </div>
        </motion.div>
      </div>

      <div className="text-center pt-12">
        <button 
          onClick={() => window.print()}
          className="px-12 py-5 bg-white border border-[#141414]/10 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#F5F5F0] transition-all shadow-sm"
        >
          Экспортировать проект
        </button>
      </div>
    </div>
  );
}
