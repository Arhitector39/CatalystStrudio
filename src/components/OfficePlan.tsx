/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { AgentInfo } from '../types';

interface Props {
  activeAgent: AgentInfo | null;
  progress: number;
}

export default function OfficePlan({ activeAgent, progress }: Props) {
  // Define desk positions for a circular/grid office layout
  const desks = [
    // Top Row: Ideation & Strategy
    { id: 'ideatorA', x: 100, y: 80, label: 'Creative A' },
    { id: 'ideatorB', x: 200, y: 80, label: 'Creative B' },
    { id: 'synthesizer', x: 300, y: 80, label: 'Synthesis' },
    { id: 'product', x: 400, y: 80, label: 'Product' },
    { id: 'psychologist', x: 500, y: 80, label: 'Psychology' },

    // Middle Row: Management & Design
    { id: 'pm', x: 100, y: 220, label: 'Project Mgmt' },
    { id: 'analyst', x: 200, y: 220, label: 'Analytics' },
    { id: 'uxui', x: 300, y: 220, label: 'Design' },
    { id: 'architect', x: 400, y: 220, label: 'Architecture' },
    { id: 'qa', x: 500, y: 220, label: 'Quality' },

    // Bottom Row: Engineering & Growth
    { id: 'frontend', x: 80, y: 360, label: 'Frontend' },
    { id: 'backend', x: 160, y: 360, label: 'Backend' },
    { id: 'ios', x: 240, y: 360, label: 'iOS' },
    { id: 'android', x: 320, y: 360, label: 'Android' },
    { id: 'devops', x: 400, y: 360, label: 'DevOps' },
    { id: 'marketing', x: 480, y: 360, label: 'Marketing' },
    { id: 'aso', x: 540, y: 360, label: 'ASO' },
  ];

  return (
    <div className="relative w-full max-w-2xl aspect-[4/3] mx-auto pointer-events-none opacity-80">
      <svg viewBox="0 0 600 500" className="w-full h-full">
        {/* Outer Walls */}
        <motion.path
          d="M 50 50 L 550 50 L 550 450 L 50 450 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-gray-400"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Inner Partitions */}
        <motion.path
          d="M 300 50 L 300 150 M 50 200 L 550 200 M 300 350 L 300 450"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-300"
        />

        {/* Desks */}
        {desks.map((desk) => {
          const isActive = activeAgent?.id === desk.id;
          
          return (
            <g key={desk.id} className="transition-all duration-500">
              {/* Desk Outline */}
              <motion.rect
                x={desk.x - 30}
                y={desk.y - 20}
                width="60"
                height="40"
                rx="2"
                fill={isActive ? "rgba(0, 122, 255, 0.05)" : "none"}
                stroke="currentColor"
                strokeWidth={isActive ? "1" : "0.5"}
                className={isActive ? "text-[#007AFF]" : "text-gray-300"}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              
              {/* Desk Label */}
              <text
                x={desk.x}
                y={desk.y + 35}
                textAnchor="middle"
                className={`text-[7px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? "fill-[#007AFF]" : "fill-gray-400"}`}
              >
                {desk.label}
              </text>

              {/* Active Indicator */}
              {isActive && (
                <g>
                  <motion.circle
                    cx={desk.x}
                    cy={desk.y}
                    r="25"
                    fill="none"
                    stroke="#007AFF"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle
                    cx={desk.x}
                    cy={desk.y}
                    r="3"
                    fill="#007AFF"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  {/* Progress Bar */}
                  <g transform={`translate(${desk.x - 20}, ${desk.y + 10})`}>
                    <rect width="40" height="1.5" rx="0.75" fill="#F3F4F6" />
                    <motion.rect 
                      width={40 * (progress / 100)} 
                      height="1.5" 
                      rx="0.75" 
                      fill="#007AFF" 
                      initial={{ width: 0 }}
                      animate={{ width: 40 * (progress / 100) }}
                    />
                  </g>
                </g>
              )}
            </g>
          );
        })}

        {/* Connection Lines (Networking) */}
        <motion.path
          d="M 150 100 Q 300 50 450 100 M 300 150 L 300 300 M 100 300 L 500 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          className="text-gray-300 opacity-60"
        />
      </svg>
      
      {/* Legend */}
      <div className="absolute top-0 left-0 p-4">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Virtual Office Layout</p>
        <p className="text-[8px] text-gray-400 uppercase tracking-widest mt-1">Status: {activeAgent ? 'Agent Active' : 'Standby'}</p>
      </div>
    </div>
  );
}
