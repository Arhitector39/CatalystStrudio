/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  Briefcase, 
  ChevronRight, 
  Loader2, 
  BookOpen, 
  Target, 
  Users, 
  Smartphone,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Stage, ProjectState, ProjectInput, IDEATION_AGENTS, AGENTS } from './types';
import { generateIdeation, generateRoadmap, generateOfficeOutputs, generateBook } from './services/geminiService';
import InputForm from './components/InputForm';
import IdeationView from './components/IdeationView';
import RoadmapView from './components/RoadmapView';
import OfficeView from './components/OfficeView';
import BookView from './components/BookView';
import AgentProgress from './components/AgentProgress';

export default function App() {
  const [state, setState] = useState<ProjectState>({
    input: null,
    ideation: null,
    roadmap: null,
    officeOutputs: [],
    bookContent: null,
    currentStage: Stage.INPUT,
    isGenerating: false,
    activeAgent: null,
    activeAction: null,
    error: null,
  });

  const [progress, setProgress] = useState(0);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleStart = async (input: ProjectInput) => {
    setState(prev => ({ ...prev, input, isGenerating: true, error: null }));
    
    try {
      // Sequence: Ideator A -> Ideator B -> Synthesizer
      setState(prev => ({ ...prev, activeAgent: IDEATION_AGENTS.ideatorA, activeAction: 'Придумываю первую концепцию...' }));
      setProgress(20);
      await delay(2000);
      
      setState(prev => ({ ...prev, activeAgent: IDEATION_AGENTS.ideatorB, activeAction: 'Разрабатываю альтернативный вариант...' }));
      setProgress(50);
      await delay(2000);
      
      setState(prev => ({ ...prev, activeAgent: IDEATION_AGENTS.synthesizer, activeAction: 'Синтезирую финальную идею...' }));
      setProgress(80);
      
      const ideation = await generateIdeation(input);
      setProgress(100);
      await delay(1000);

      setState(prev => ({ 
        ...prev, 
        ideation, 
        currentStage: Stage.IDEATION,
        isGenerating: false,
        activeAgent: null,
        activeAction: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Ошибка при генерации идей. Попробуйте еще раз.', isGenerating: false, activeAgent: null }));
    }
  };

  const proceedToPlanning = async () => {
    if (!state.ideation) return;
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      setState(prev => ({ 
        ...prev, 
        activeAgent: AGENTS.find(a => a.id === 'pm') || null, 
        activeAction: 'Формирую стратегический план реализации...' 
      }));
      setProgress(40);
      await delay(2000);
      
      const roadmap = await generateRoadmap(state.ideation.synthesized);
      setProgress(100);
      await delay(1000);

      setState(prev => ({ 
        ...prev, 
        roadmap, 
        currentStage: Stage.PLANNING,
        isGenerating: false,
        activeAgent: null,
        activeAction: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Ошибка при создании плана. Попробуйте еще раз.', isGenerating: false, activeAgent: null }));
    }
  };

  const proceedToOffice = async () => {
    if (!state.ideation || !state.roadmap) return;
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      // Simulate sequential specialist work
      const specialists = ['analyst', 'uxui', 'psychologist', 'architect'];
      for (let i = 0; i < specialists.length; i++) {
        const agent = AGENTS.find(a => a.id === specialists[i]);
        if (agent) {
          setState(prev => ({ ...prev, activeAgent: agent, activeAction: `Прорабатываю ${agent.role.toLowerCase()}...` }));
          setProgress(((i + 1) / specialists.length) * 80);
          await delay(1500);
        }
      }

      const officeOutputs = await generateOfficeOutputs(state.ideation.synthesized, state.roadmap);
      setProgress(100);
      await delay(1000);

      setState(prev => ({ 
        ...prev, 
        officeOutputs, 
        currentStage: Stage.OFFICE,
        isGenerating: false,
        activeAgent: null,
        activeAction: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Ошибка при работе специалистов. Попробуйте еще раз.', isGenerating: false, activeAgent: null }));
    }
  };

  const proceedToBookCreation = async () => {
    if (!state.ideation || !state.officeOutputs.length) return;
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      setState(prev => ({ 
        ...prev, 
        activeAgent: IDEATION_AGENTS.synthesizer, 
        activeAction: 'Собираю все наработки в финальную книгу...' 
      }));
      setProgress(50);
      
      const bookContent = await generateBook(state.ideation.synthesized, state.officeOutputs);
      setProgress(100);
      await delay(1000);

      setState(prev => ({ 
        ...prev, 
        bookContent, 
        currentStage: Stage.BOOK_CREATION,
        isGenerating: false,
        activeAgent: null,
        activeAction: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Ошибка при создании книги. Попробуйте еще раз.', isGenerating: false, activeAgent: null }));
    }
  };

  const reset = () => {
    setState({
      input: null,
      ideation: null,
      roadmap: null,
      officeOutputs: [],
      bookContent: null,
      currentStage: Stage.INPUT,
      isGenerating: false,
      activeAgent: null,
      activeAction: null,
      error: null,
    });
    setProgress(0);
  };

  const renderStage = () => {
    if (state.isGenerating) return null;

    switch (state.currentStage) {
      case Stage.INPUT:
        return <InputForm onSubmit={handleStart} isLoading={state.isGenerating} />;
      case Stage.IDEATION:
        return (
          <IdeationView 
            result={state.ideation!} 
            onNext={proceedToPlanning} 
            isLoading={state.isGenerating} 
          />
        );
      case Stage.PLANNING:
        return (
          <RoadmapView 
            roadmap={state.roadmap!} 
            onNext={proceedToOffice} 
            isLoading={state.isGenerating} 
          />
        );
      case Stage.OFFICE:
        return (
          <OfficeView 
            outputs={state.officeOutputs} 
            onNext={proceedToBookCreation} 
            isLoading={state.isGenerating} 
          />
        );
      case Stage.BOOK_CREATION:
        return <BookView book={state.bookContent!} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#141414] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#141414]/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={reset}>
            <div className="w-12 h-12 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#5A5A40]/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Catalyst</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Story Tales Studio</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { s: Stage.INPUT, n: 'Ввод', i: '01' },
              { s: Stage.IDEATION, n: 'Концепт', i: '02' },
              { s: Stage.PLANNING, n: 'План', i: '03' },
              { s: Stage.OFFICE, n: 'Офис', i: '04' },
              { s: Stage.BOOK_CREATION, n: 'Книга', i: '05' }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.s}>
                <div className={`flex items-center gap-3 text-sm font-bold transition-all ${state.currentStage === step.s ? 'text-[#5A5A40]' : 'text-gray-300'}`}>
                  <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-[10px] ${state.currentStage === step.s ? 'border-[#5A5A40] bg-[#5A5A40] text-white' : 'border-gray-200'}`}>
                    {step.i}
                  </span>
                  {step.n}
                </div>
                {idx < arr.length - 1 && <ChevronRight size={14} className="text-gray-200" />}
              </React.Fragment>
            ))}
          </nav>

          {state.currentStage !== Stage.INPUT && (
            <button 
              onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-[#141414] hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Сброс
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {state.error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-600">
            <AlertCircle size={24} />
            <p className="text-sm font-bold">{state.error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStage + (state.isGenerating ? '-gen' : '')}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>

        <AgentProgress 
          agent={state.activeAgent} 
          action={state.activeAction} 
          progress={progress} 
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414]/5 py-16 mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              <Sparkles size={18} />
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900">Story Tales Catalyst</p>
              <p className="text-gray-400">Виртуальный офис ИИ-агентов v2.0</p>
            </div>
          </div>
          <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Документация</a>
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Методология</a>
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Поддержка</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
