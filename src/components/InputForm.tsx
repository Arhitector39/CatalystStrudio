/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Target, Users, Smartphone, Send, Loader2, Sparkles } from 'lucide-react';
import { ProjectInput } from '../types';

interface Props {
  onSubmit: (input: ProjectInput) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: Props) {
  const [theme, setTheme] = useState('');
  const [ageGroup, setAgeGroup] = useState('3-5 лет');
  const [parentalGoals, setParentalGoals] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['Планшет']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !parentalGoals) return;
    onSubmit({ theme, ageGroup, parentalGoals, platforms });
  };

  const togglePlatform = (p: string) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const fillTestData = () => {
    const samples = [
      {
        theme: 'Маленький светлячок по имени Люми, который потерял свой фонарик в Зачарованном Саду. Он встречает мудрую сову и игривых лягушек, которые помогают ему понять, что свет исходит изнутри.',
        age: '3-5 лет',
        goals: 'Развитие уверенности в себе, преодоление страха темноты, обучение взаимопомощи и дружбе.',
        platforms: ['Планшет', 'Телефон']
      },
      {
        theme: 'Космический кот Астро, путешествующий по планетам из сладостей. Ему нужно собрать ингредиенты для звездного пирога, решая простые математические задачки и изучая основы гравитации.',
        age: '5-7 лет',
        goals: 'Обучение счету, знакомство с базовыми понятиями физики и космоса, развитие логического мышления.',
        platforms: ['Планшет', 'Веб']
      },
      {
        theme: 'Подводное королевство, где маленькая рыбка Несси учится очищать океан от пластика. Она собирает команду друзей, чтобы построить коралловый риф будущего.',
        age: '7-10 лет',
        goals: 'Экологическое воспитание, осознанное потребление, лидерские качества и работа в команде.',
        platforms: ['Планшет']
      },
      {
        theme: 'Волшебная кухня бабушки Агаты, где овощи оживают и рассказывают свои истории. Ребенок помогает готовить суп, узнавая о пользе витаминов и здоровом питании.',
        age: '2-3 года',
        goals: 'Формирование здоровых пищевых привычек, развитие мелкой моторики через интерактив, расширение словарного запаса.',
        platforms: ['Планшет', 'Телефон']
      },
      {
        theme: 'Дракончик Гоша, который боится летать. Он отправляется в пешее путешествие через горы, где встречает разных существ и учится принимать свои особенности.',
        age: '3-5 лет',
        goals: 'Эмоциональный интеллект, принятие себя, борьба с тревожностью и развитие эмпатии.',
        platforms: ['Планшет', 'Телефон', 'Веб']
      }
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setTheme(randomSample.theme);
    setAgeGroup(randomSample.age);
    setParentalGoals(randomSample.goals);
    setPlatforms(randomSample.platforms);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-6xl font-serif italic mb-6">Story Tales Catalyst</h2>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Начните путь от идеи до полноценного проекта интерактивной книги. Опишите ваше видение, и наша команда ИИ-агентов возьмет на себя всё остальное.
        </p>
        <button
          type="button"
          onClick={fillTestData}
          className="mt-8 px-6 py-2 bg-[#F5F5F0] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all flex items-center gap-2 mx-auto"
        >
          <Sparkles size={12} />
          Заполнить магией
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 bg-white p-12 lg:p-20 rounded-[64px] shadow-xl border border-[#141414]/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BookOpen size={200} />
        </div>

        <div className="space-y-4 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <BookOpen size={14} />
            Мир, Герои и Сюжет
          </label>
          <textarea
            required
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Опишите вашу идею во всех красках..."
            className="w-full h-40 p-8 bg-[#FDFDFB] rounded-[32px] border border-[#141414]/5 focus:ring-2 focus:ring-[#5A5A40] transition-all resize-none text-lg leading-relaxed placeholder:text-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <Users size={14} />
              Возрастная группа
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['2-3 года', '3-5 лет', '5-7 лет', '7-10 лет'].map(age => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setAgeGroup(age)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    ageGroup === age 
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-md' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-[#5A5A40]/30'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <Smartphone size={14} />
              Целевые платформы
            </label>
            <div className="flex flex-wrap gap-2">
              {['Планшет', 'Телефон', 'Веб'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                    platforms.includes(p) 
                      ? 'bg-[#141414] text-white border-[#141414] shadow-md' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-[#141414]/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <Target size={14} />
            Педагогические цели
          </label>
          <textarea
            required
            value={parentalGoals}
            onChange={(e) => setParentalGoals(e.target.value)}
            placeholder="Чему книга должна научить ребенка?"
            className="w-full h-32 p-8 bg-[#FDFDFB] rounded-[32px] border border-[#141414]/5 focus:ring-2 focus:ring-[#5A5A40] transition-all resize-none text-lg leading-relaxed placeholder:text-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-8 bg-[#5A5A40] text-white rounded-full font-bold text-lg flex items-center justify-center gap-4 hover:bg-[#4A4A30] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-[#5A5A40]/30 group"
        >
          {isLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Запуск Catalyst...
            </>
          ) : (
            <>
              Запустить генерацию проекта
              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
