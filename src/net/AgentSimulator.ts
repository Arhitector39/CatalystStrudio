/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { agentStore, AgentStatus } from '../state/AgentStore';
import { AGENTS, IDEATION_AGENTS } from '../types';

const STATUSES: AgentStatus[] = ['idle', 'planning', 'researching', 'writing', 'meeting', 'tool_call', 'done'];

export class AgentSimulator {
  private interval: any;

  public start() {
    // Initial agents from types
    const initialAgents = [
      ...Object.values(IDEATION_AGENTS),
      ...AGENTS
    ].map(a => ({
      agent_id: a.id,
      name: a.name,
      status: 'idle' as AgentStatus,
      progress: 0,
      task: 'Waiting for task...',
      currentPos: { x: 400 + (Math.random() - 0.5) * 100, y: 300 + (Math.random() - 0.5) * 100 },
      targetPos: { x: 400, y: 300 },
      path: []
    }));

    agentStore.updateAgents(initialAgents);

    this.interval = setInterval(() => {
      const agents = agentStore.getAgents();
      const updates = agents.map(agent => {
        // Randomly change status
        if (Math.random() > 0.95) {
          const newStatus = STATUSES[Math.floor(Math.random() * STATUSES.length)];
          return {
            agent_id: agent.agent_id,
            status: newStatus,
            progress: Math.min(100, agent.progress + Math.random() * 5)
          };
        }
        return {
          agent_id: agent.agent_id,
          progress: Math.min(100, agent.progress + Math.random() * 1)
        };
      });
      agentStore.updateAgents(updates);
    }, 1000);
  }

  public stop() {
    if (this.interval) clearInterval(this.interval);
  }
}

export const agentSimulator = new AgentSimulator();
