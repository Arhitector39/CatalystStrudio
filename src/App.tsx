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
  ArrowLeft,
  X,
  Zap
} from 'lucide-react';
import { Stage, ProjectState, ProjectInput, IDEATION_AGENTS, AGENTS, UserStats, PLAN_LIMITS } from './types';
import { generateIdeation, generateRoadmap, generateOfficeOutputs, generateBook } from './services/geminiService';
import InputForm from './components/InputForm';
import IdeationView from './components/IdeationView';
import RoadmapView from './components/RoadmapView';
import OfficeView from './components/OfficeView';
import BookView from './components/BookView';
import AgentProgress from './components/AgentProgress';
import AuthModal from './components/AuthModal';
import BillingInfo from './components/BillingInfo';

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

  const [userStats, setUserStats] = useState<UserStats>({
    plan: 'FREE',
    storiesCreated: 0,
    tokensUsed: 0,
    balance: 0,
    totalSpent: 0,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [lastRequestCost, setLastRequestCost] = useState<{ tokens: number; usd: number } | null>(null);

  const [progress, setProgress] = useState(0);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const trackUsage = (tokens: number) => {
    const costPerToken = 0.00002; // Base cost
    const margin = 1.3; // +30%
    const userCost = tokens * costPerToken * margin;
    
    setLastRequestCost({ tokens, usd: userCost });
    setUserStats(prev => ({
      ...prev,
      tokensUsed: prev.tokensUsed + tokens,
      totalSpent: prev.totalSpent + userCost,
      balance: Math.max(0, prev.balance - userCost)
    }));
  };

  const handleStart = async (input: ProjectInput) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    const limits = PLAN_LIMITS[userStats.plan];
    if (userStats.storiesCreated >= limits.maxStories) {
      setState(prev => ({ ...prev, error: 'Лимит историй исчерпан для вашего плана. Пожалуйста, обновите план.' }));
      return;
    }

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
      trackUsage(1500); // Simulated token count
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
      
      setUserStats(prev => ({ ...prev, storiesCreated: prev.storiesCreated + 1 }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Ошибка при генерации идей. Попробуйте еще раз.', isGenerating: false, activeAgent: null }));
    }
  };

  const handleLogin = (method: string) => {
    console.log('Logging in with', method);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    // In a real app, we would fetch user stats from Firebase here
    if (userStats.balance === 0) {
      setUserStats(prev => ({ ...prev, balance: 10 })); // Give some initial balance for demo
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
      trackUsage(2500); // Simulated token count
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
      trackUsage(8000); // Simulated token count
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
      trackUsage(12000); // Simulated token count
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
    <div className="min-h-screen flex flex-col text-ink font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/60 backdrop-blur-xl sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-[#007AFF] rounded-lg flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <h1 className="text-base font-bold tracking-tight text-[#1A1A1A]">Catalyst</h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-4">
            {[
              { s: Stage.INPUT, n: 'Ввод', i: '01' },
              { s: Stage.IDEATION, n: 'Идеи', i: '02' },
              { s: Stage.PLANNING, n: 'План', i: '03' },
              { s: Stage.OFFICE, n: 'Офис', i: '04' },
              { s: Stage.BOOK_CREATION, n: 'Книга', i: '05' }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.s}>
                <div className={`flex items-center gap-2 text-xs font-medium transition-all ${state.currentStage === step.s ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] ${state.currentStage === step.s ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-gray-200'}`}>
                    {step.i}
                  </span>
                  {step.n}
                </div>
                {idx < arr.length - 1 && <ChevronRight size={10} className="text-gray-200" />}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button 
                onClick={() => setIsBillingOpen(!isBillingOpen)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-[#007AFF] hover:bg-blue-100 transition-all flex items-center gap-2"
              >
                <Zap size={14} />
                ${userStats.balance.toFixed(2)}
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#1A1A1A] text-white hover:bg-black transition-all shadow-sm"
              >
                Войти
              </button>
            )}
            
            <button 
              onClick={reset}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-[#1A1A1A] transition-all flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Сброс
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-8 md:py-12">
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

        {/* Billing Sidebar/Modal */}
        <AnimatePresence>
          {isBillingOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBillingOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="relative z-10"
              >
                <BillingInfo 
                  stats={userStats} 
                  onTopUp={() => setUserStats(prev => ({ ...prev, balance: prev.balance + 50 }))}
                  onUpgrade={(plan) => setUserStats(prev => ({ ...prev, plan }))}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={handleLogin} 
        />

        {/* Last Request Cost Toast */}
        <AnimatePresence>
          {lastRequestCost && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <Zap size={16} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Стоимость</p>
                <p className="text-xs font-bold text-[#1A1A1A]">
                  {lastRequestCost.tokens.toLocaleString()} • ${lastRequestCost.usd.toFixed(4)}
                </p>
              </div>
              <button 
                onClick={() => setLastRequestCost(null)}
                className="ml-2 text-gray-300 hover:text-gray-500"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-gray-400">
            © 2026 Story Tales Catalyst. Виртуальный офис ИИ-агентов.
          </p>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-[#007AFF] transition-colors">Документация</a>
            <a href="#" className="hover:text-[#007AFF] transition-colors">Методология</a>
            <a href="#" className="hover:text-[#007AFF] transition-colors">Поддержка</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
