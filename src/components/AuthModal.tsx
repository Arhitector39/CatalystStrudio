/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Github, Apple, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (method: 'google' | 'apple' | 'email') => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[32px] p-10 shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-6 w-full max-w-md relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#1A1A1A] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007AFF] mb-0">
              <LogIn size={32} />
            </div>

            <div>
              <h3 className="text-2xl font-serif italic mb-2">Авторизация</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Войдите, чтобы сохранить ваши проекты и получить доступ к расширенным планам.
              </p>
            </div>

            <div className="w-full space-y-2.5">
              <button 
                onClick={() => onLogin('google')}
                className="w-full py-3.5 px-6 bg-white border border-gray-100 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Войти через Google
              </button>
              
              <button 
                onClick={() => onLogin('apple')}
                className="w-full py-3.5 px-6 bg-[#1A1A1A] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
              >
                <Apple size={18} />
                Войти через Apple
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">или</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <button 
                onClick={() => onLogin('email')}
                className="w-full py-3.5 px-6 bg-blue-50 text-[#007AFF] rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-blue-100 transition-all border border-blue-100"
              >
                <Mail size={18} />
                Войти через Почту
              </button>
            </div>

            <p className="text-[9px] text-gray-400 max-w-[200px]">
              Продолжая, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
