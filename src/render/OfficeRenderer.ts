/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as PIXI from 'pixi.js';
import { AgentState, agentStore } from '../state/AgentStore';
import { Pathfinder, Point } from '../nav/Pathfinder';

export class OfficeRenderer {
  private app: PIXI.Application;
  private container: HTMLElement;
  private pathfinder: Pathfinder;
  private zones: any;
  private agentSprites: Map<string, PIXI.Container> = new Map();
  private gridGraphics: PIXI.Graphics;

  constructor(container: HTMLElement, zonesConfig: any) {
    this.container = container;
    this.zones = zonesConfig;
    this.app = new PIXI.Application();
    this.pathfinder = new Pathfinder(zonesConfig.width, zonesConfig.height, zonesConfig.gridSize);
    this.gridGraphics = new PIXI.Graphics();
  }

  public async init() {
    await this.app.init({
      width: this.zones.width,
      height: this.zones.height,
      background: '#f5f7ff',
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.container.appendChild(this.app.canvas);

    // Background
    const bg = new PIXI.Graphics()
      .rect(0, 0, this.zones.width, this.zones.height)
      .fill({ color: 0xffffff, alpha: 1 });
    this.app.stage.addChild(bg);

    // Draw zones for visualization
    this.zones.zones.forEach((zone: any) => {
      const g = new PIXI.Graphics()
        .rect(zone.rect.x, zone.rect.y, zone.rect.w, zone.rect.h)
        .stroke({ color: 0x007aff, width: 1, alpha: 0.2 })
        .fill({ color: 0x007aff, alpha: 0.05 });
      this.app.stage.addChild(g);

      const text = new PIXI.Text({
        text: zone.label,
        style: {
          fontSize: 10,
          fill: 0x007aff,
          fontWeight: 'bold',
          fontFamily: 'Inter'
        }
      });
      text.x = zone.rect.x + 5;
      text.y = zone.rect.y + 5;
      this.app.stage.addChild(text);
    });

    this.app.stage.addChild(this.gridGraphics);

    this.app.ticker.add((ticker) => {
      this.update(ticker.deltaTime);
    });

    agentStore.subscribe((agents) => {
      this.syncAgents(agents);
    });
  }

  private syncAgents(agents: AgentState[]) {
    agents.forEach((agent, index) => {
      let sprite = this.agentSprites.get(agent.agent_id);
      if (!sprite) {
        sprite = this.createAgentSprite(agent);
        this.agentSprites.set(agent.agent_id, sprite);
        this.app.stage.addChild(sprite);
      }

      // Determine target zone based on status
      const targetZoneId = this.mapStatusToZone(agent.status);
      const zone = this.zones.zones.find((z: any) => z.id === targetZoneId);
      if (zone) {
        // Pick a spot based on index to avoid stacking
        const spotIndex = index % zone.spots.length;
        const spot = zone.spots[spotIndex];
        
        // Add a small random offset to the spot
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        const finalTarget = { x: spot.x + offsetX, y: spot.y + offsetY };

        if (Math.abs(agent.targetPos.x - finalTarget.x) > 5 || Math.abs(agent.targetPos.y - finalTarget.y) > 5) {
          agent.targetPos = finalTarget;
          agent.path = this.pathfinder.findPath(agent.currentPos, agent.targetPos);
        }
      }
    });
  }

  private createAgentSprite(agent: AgentState): PIXI.Container {
    const container = new PIXI.Container();
    
    const body = new PIXI.Graphics()
      .circle(0, 0, 10)
      .fill({ color: 0x007aff })
      .stroke({ color: 0xffffff, width: 2 });
    
    const label = new PIXI.Text({
      text: agent.name.split(' ')[0],
      style: {
        fontSize: 8,
        fill: 0x333333,
        fontWeight: 'bold',
        fontFamily: 'Inter'
      }
    });
    label.anchor.set(0.5);
    label.y = 15;

    container.addChild(body);
    container.addChild(label);
    container.x = agent.currentPos.x;
    container.y = agent.currentPos.y;

    return container;
  }

  private mapStatusToZone(status: string): string {
    switch (status) {
      case 'idle': return Math.random() > 0.5 ? 'lounge' : 'kitchen';
      case 'planning': return 'whiteboard';
      case 'researching': return 'quiet_booths';
      case 'writing': return Math.random() > 0.5 ? 'desks_left' : 'desks_right';
      case 'meeting': return 'meeting_room';
      case 'done': return 'kitchen';
      case 'error': return 'support_corner';
      default: return 'lounge';
    }
  }

  private update(delta: number) {
    const agents = agentStore.getAgents();
    agents.forEach(agent => {
      const sprite = this.agentSprites.get(agent.agent_id);
      if (!sprite) return;

      if (agent.path.length > 0) {
        const target = agent.path[0];
        const dx = target.x - agent.currentPos.x;
        const dy = target.y - agent.currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const speed = 2 * delta;
        if (dist < speed) {
          agent.currentPos = target;
          agent.path.shift();
        } else {
          agent.currentPos.x += (dx / dist) * speed;
          agent.currentPos.y += (dy / dist) * speed;
        }

        sprite.x = agent.currentPos.x;
        sprite.y = agent.currentPos.y;
      }
    });
  }

  public destroy() {
    this.app.destroy(true, { children: true, texture: true });
  }
}
