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
    <div className="max-w-4xl mx-auto space-y-16 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="px-4 py-1.5 bg-blue-50 text-[#007AFF] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block border border-blue-100">
          Финальный Проект
        </span>
        <h2 className="text-5xl font-serif italic mb-6 leading-tight text-[#1A1A1A]">{book.title}</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light italic">
          {book.summary}
        </p>
      </motion.div>

      <div className="space-y-12">
        {book.chapters.map((chapter, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="bg-blue-50/50 p-8 text-[#1A1A1A] flex items-center justify-between border-b border-blue-100">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-serif italic text-[#007AFF] opacity-30">0{idx + 1}</span>
                <h3 className="text-xl font-serif italic">{chapter.title}</h3>
              </div>
              <Layers size={20} className="text-[#007AFF] opacity-20" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 lg:p-10 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#007AFF] flex items-center gap-2">
                  <Book size={14} /> Сценарий и Текст
                </h4>
                <div className="prose prose-sm prose-stone max-w-none prose-p:leading-relaxed prose-p:text-gray-700">
                  <Markdown>{chapter.content}</Markdown>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex flex-col divide-y divide-gray-100">
                <div className="p-8 space-y-4 bg-blue-50/30">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#007AFF] flex items-center gap-2">
                    <Sparkles size={14} /> Интерактивная Механика
                  </h4>
                  <p className="text-gray-700 leading-relaxed italic text-base">
                    {chapter.interaction}
                  </p>
                </div>

                <div className="p-8 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 text-[#007AFF] rounded-xl flex items-center justify-center">
              <Code size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">Технический Манифест</h3>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Архитектура и Стек</p>
            </div>
          </div>
          <div className="prose prose-sm prose-stone max-w-none prose-headings:font-serif prose-headings:italic prose-p:text-gray-600">
            <Markdown>{book.technicalManifest}</Markdown>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-[40px] border border-blue-50 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-[#007AFF] rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif italic text-[#1A1A1A]">Маркетинговый Кит</h3>
                <p className="text-[9px] text-blue-400 uppercase tracking-widest font-bold">Стратегия и Продвижение</p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:italic prose-strong:text-[#007AFF]">
              <Markdown>{book.marketingKit}</Markdown>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center pt-8">
        <button 
          onClick={() => window.print()}
          className="w-full max-w-md py-5 bg-white border border-gray-200 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm text-[#1A1A1A]"
        >
          Экспортировать проект
        </button>
      </div>
    </div>
  );
}
