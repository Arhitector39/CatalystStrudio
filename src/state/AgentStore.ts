/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point } from '../nav/Pathfinder';

export type AgentStatus = 'idle' | 'planning' | 'researching' | 'writing' | 'meeting' | 'tool_call' | 'error' | 'done';

export interface AgentState {
  agent_id: string;
  name: string;
  status: AgentStatus;
  progress: number;
  task: string;
  currentPos: Point;
  targetPos: Point;
  path: Point[];
}

export class AgentStore {
  private agents: Map<string, AgentState> = new Map();
  private listeners: Set<(agents: AgentState[]) => void> = new Set();

  public updateAgents(updates: Partial<AgentState>[]) {
    updates.forEach(update => {
      if (!update.agent_id) return;
      const existing = this.agents.get(update.agent_id);
      if (existing) {
        this.agents.set(update.agent_id, { ...existing, ...update });
      } else {
        // New agent
        this.agents.set(update.agent_id, {
          agent_id: update.agent_id,
          name: update.name || 'Unknown',
          status: update.status || 'idle',
          progress: update.progress || 0,
          task: update.task || '',
          currentPos: update.currentPos || { x: 400, y: 300 },
          targetPos: update.targetPos || { x: 400, y: 300 },
          path: update.path || []
        });
      }
    });
    this.notify();
  }

  public getAgents(): AgentState[] {
    return Array.from(this.agents.values());
  }

  public subscribe(listener: (agents: AgentState[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const agents = this.getAgents();
    this.listeners.forEach(l => l(agents));
  }
}

export const agentStore = new AgentStore();
