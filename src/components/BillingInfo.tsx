/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Zap, Info, PlusCircle } from 'lucide-react';
import { UserStats, PlanType, PLAN_LIMITS } from '../types';

interface Props {
  stats: UserStats;
  onTopUp: () => void;
  onUpgrade: (plan: PlanType) => void;
}

export default function BillingInfo({ stats, onTopUp, onUpgrade }: Props) {
  const limits = PLAN_LIMITS[stats.plan];
  const storiesRemaining = limits.maxStories - stats.storiesCreated;

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100 flex flex-col gap-8 w-full max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#007AFF] shadow-sm">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">План: {stats.plan}</h3>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Текущий статус</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#007AFF]">${stats.balance.toFixed(2)}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Баланс</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xl font-bold text-[#1A1A1A]">{stats.storiesCreated}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Историй</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xl font-bold text-[#1A1A1A]">{stats.tokensUsed.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Токенов</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-bold text-gray-600">Лимит историй</p>
          <p className="text-xs font-bold text-[#007AFF]">
            {limits.maxStories === Infinity ? 'Безлимитно' : `${stats.storiesCreated} / ${limits.maxStories}`}
          </p>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#007AFF]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (stats.storiesCreated / (limits.maxStories || 1)) * 100)}%` }}
          />
        </div>
        {storiesRemaining <= 0 && limits.maxStories !== Infinity && (
          <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 px-1">
            <Info size={10} /> Лимит исчерпан. Перейдите на PRO или ULTRA.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {limits.topUpAllowed && (
          <button 
            onClick={onTopUp}
            className="w-full py-3.5 bg-[#007AFF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0066DD] transition-all shadow-lg shadow-blue-200"
          >
            <PlusCircle size={16} />
            Пополнить баланс
          </button>
        )}
        
        {stats.plan !== 'ULTRA' && (
          <button 
            onClick={() => onUpgrade(stats.plan === 'FREE' ? 'PRO' : 'ULTRA')}
            className="w-full py-3.5 bg-white border border-[#007AFF]/20 text-[#007AFF] rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
          >
            Улучшить план
          </button>
        )}
      </div>

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 mb-1.5 text-[#007AFF]">
          <CreditCard size={14} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Цены</p>
        </div>
        <p className="text-[9px] text-gray-500 leading-relaxed">
          Стоимость запросов рассчитывается как себестоимость токенов + 30% сервисный сбор.
        </p>
      </div>
    </div>
  );
}
