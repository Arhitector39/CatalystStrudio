/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Stage {
  INPUT = 'INPUT',
  IDEATION = 'IDEATION',
  PLANNING = 'PLANNING',
  OFFICE = 'OFFICE',
  BOOK_CREATION = 'BOOK_CREATION',
}

export interface ProjectInput {
  theme: string;
  ageGroup: string;
  parentalGoals: string;
  platforms: string[];
}

export interface IdeationResult {
  ideatorA: string;
  ideatorB: string;
  synthesized: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dependencies: string[];
  priority: 'MVP' | 'Future';
}

export interface RoadmapStage {
  name: string;
  tasks: Task[];
}

export interface ProjectRoadmap {
  stages: RoadmapStage[];
}

export interface AgentOutput {
  agentId: string;
  role: string;
  goals: string;
  decisions: string[];
  artifacts: string; // Markdown content
}

export interface BookContent {
  title: string;
  summary: string;
  chapters: {
    title: string;
    content: string;
    interaction: string;
    visuals: string;
  }[];
  technicalManifest: string;
  marketingKit: string;
}

export interface AgentInfo {
  id: string;
  role: string;
  name: string;
  avatar: string;
}

export interface ProjectState {
  input: ProjectInput | null;
  ideation: IdeationResult | null;
  roadmap: ProjectRoadmap | null;
  officeOutputs: AgentOutput[];
  bookContent: BookContent | null;
  currentStage: Stage;
  isGenerating: boolean;
  activeAgent: AgentInfo | null;
  activeAction: string | null;
  error: string | null;
}

export const AGENTS: AgentInfo[] = [
  { id: 'analyst', role: 'Бизнес-аналитик', name: 'Александр В.', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'pm', role: 'Project Manager', name: 'Елена К.', avatar: 'https://picsum.photos/seed/elena/100/100' },
  { id: 'product', role: 'Product Manager', name: 'Дмитрий С.', avatar: 'https://picsum.photos/seed/dmitry/100/100' },
  { id: 'uxui', role: 'UX/UI Дизайнер', name: 'Мария Л.', avatar: 'https://picsum.photos/seed/maria/100/100' },
  { id: 'psychologist', role: 'Психолог', name: 'Анна М.', avatar: 'https://picsum.photos/seed/anna/100/100' },
  { id: 'ios', role: 'iOS-разработчик', name: 'Игорь П.', avatar: 'https://picsum.photos/seed/igor/100/100' },
  { id: 'android', role: 'Android-разработчик', name: 'Артем Б.', avatar: 'https://picsum.photos/seed/artem/100/100' },
  { id: 'frontend', role: 'Frontend-разработчик', name: 'Ольга Н.', avatar: 'https://picsum.photos/seed/olga/100/100' },
  { id: 'backend', role: 'Backend-разработчик', name: 'Сергей В.', avatar: 'https://picsum.photos/seed/sergey/100/100' },
  { id: 'architect', role: 'Архитектор систем', name: 'Виктор Г.', avatar: 'https://picsum.photos/seed/victor/100/100' },
  { id: 'qa', role: 'QA-инженер', name: 'Наталья Д.', avatar: 'https://picsum.photos/seed/natalia/100/100' },
  { id: 'devops', role: 'DevOps-инженер', name: 'Константин Ф.', avatar: 'https://picsum.photos/seed/konst/100/100' },
  { id: 'aso', role: 'ASO-специалист', name: 'Юлия Р.', avatar: 'https://picsum.photos/seed/yulia/100/100' },
  { id: 'marketing', role: 'Маркетолог', name: 'Павел Т.', avatar: 'https://picsum.photos/seed/pavel/100/100' },
  { id: 'target', role: 'Таргетолог', name: 'Ксения О.', avatar: 'https://picsum.photos/seed/ksenia/100/100' },
  { id: 'data_analyst', role: 'Продуктовый аналитик', name: 'Максим Е.', avatar: 'https://picsum.photos/seed/maxim/100/100' },
];

export const IDEATION_AGENTS = {
  ideatorA: { id: 'ideatorA', role: 'Креативный Идеатор A', name: 'Леонардо', avatar: 'https://picsum.photos/seed/leo/100/100' },
  ideatorB: { id: 'ideatorB', role: 'Креативный Идеатор B', name: 'Беатрис', avatar: 'https://picsum.photos/seed/bea/100/100' },
  synthesizer: { id: 'synthesizer', role: 'Синтезатор Концепций', name: 'София', avatar: 'https://picsum.photos/seed/sophia/100/100' },
};
