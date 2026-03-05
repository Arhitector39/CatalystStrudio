/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { ProjectInput } from '../types';

interface Props {
  onSubmit: (input: ProjectInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState<ProjectInput>({
    theme: '',
    ageGroup: '3-5 лет',
    parentalGoals: '',
    platforms: ['Web Responsive'],
  });

  const fillTestData = () => {
    const themes = [
      'Космическое приключение маленького робота Болта, который ищет запчасти для своего друга на планетах из сладостей.',
      'Тайна заколдованного леса, где говорящие грибы помогают лисенку Люми найти дорогу домой.',
      'Путешествие капельки воды по всему миру: от океана до облаков и обратно в горный ручей.',
      'История о необычной дружбе кота Астро и маленького дракончика, который боится летать.',
      'Приключения в стране забытых игрушек, где старый мишка учит новых друзей ценить дружбу.'
    ];
    const ages = ['2-3 года', '3-5 лет', '5-7 лет', '7-10 лет'];
    const goals = [
      'Развитие эмпатии, доброты и умения помогать окружающим в трудных ситуациях.',
      'Изучение основ экологии и важности бережного отношения к природе и водным ресурсам.',
      'Преодоление страха темноты и неизвестности через игру и воображение.',
      'Укрепление уверенности в себе и принятие своих уникальных особенностей.',
      'Понимание важности честности и ответственности за свои поступки.'
    ];

    setInput({
      theme: themes[Math.floor(Math.random() * themes.length)],
      ageGroup: ages[Math.floor(Math.random() * ages.length)],
      parentalGoals: goals[Math.floor(Math.random() * goals.length)],
      platforms: ['Web Responsive'],
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-serif italic mb-2 text-[#1A1A1A]">Начните проект</h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Опишите вашу идею, и наши ИИ-агенты превратят её в полноценную интерактивную историю.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fillTestData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#007AFF] rounded-xl font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 shadow-sm whitespace-nowrap self-start md:self-auto"
          >
            <Sparkles size={16} />
            Заполнить магией
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Тема истории</label>
            <textarea
              value={input.theme}
              onChange={(e) => setInput({ ...input, theme: e.target.value })}
              placeholder="Например: Маленький лисенок ищет дорогу домой через волшебный лес..."
              className="w-full p-6 bg-gray-50 border border-gray-100 focus:border-[#007AFF]/20 focus:bg-white rounded-2xl min-h-[140px] text-base transition-all outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Возрастная группа</label>
              <input
                type="text"
                value={input.ageGroup}
                onChange={(e) => setInput({ ...input, ageGroup: e.target.value })}
                placeholder="Например: 5-7 лет"
                className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-[#007AFF]/20 focus:bg-white rounded-xl text-base transition-all outline-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Цели обучения</label>
              <input
                type="text"
                value={input.parentalGoals}
                onChange={(e) => setInput({ ...input, parentalGoals: e.target.value })}
                placeholder="Например: Развитие эмпатии"
                className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-[#007AFF]/20 focus:bg-white rounded-xl text-base transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Платформа</label>
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#007AFF] shadow-sm">
                  <Smartphone size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1A1A1A]">Web Responsive</p>
                  <p className="text-xs text-gray-500">Оптимизировано для мобильных устройств</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-[#007AFF] rounded-lg text-[9px] font-bold uppercase tracking-widest">
                По умолчанию
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSubmit(input)}
            disabled={isLoading || !input.theme}
            className="w-full py-5 bg-[#007AFF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-[#0066DD] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Запуск...
              </>
            ) : (
              <>
                Запустить проект
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
