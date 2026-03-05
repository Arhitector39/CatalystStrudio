/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ProjectInput, IdeationResult, ProjectRoadmap, AgentOutput, AGENTS, BookContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateIdeation = async (input: ProjectInput): Promise<IdeationResult> => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    Ты — Story Tales Catalyst. Начинаем Этап 1: Идеи и Синтез.
    
    Входные данные:
    - Тема/Мир: ${input.theme}
    - Возраст: ${input.ageGroup}
    - Цели родителей: ${input.parentalGoals}
    - Платформы: ${input.platforms.join(", ")}

    Твоя задача:
    1. ИИ-Агент Идеатор A: Придумай оригинальную идею интерактивной книги.
    2. ИИ-Агент Идеатор B: Придумай отличающуюся концепцию (другой жанр/механики).
    3. ИИ-Агент Синтезатор Идей: Проанализируй A и B, создай третью, улучшенную идею.

    Верни ответ в формате JSON:
    {
      "ideatorA": "текст идеи A",
      "ideatorB": "текст идеи B",
      "synthesized": "текст синтезированной идеи"
    }
    
    Используй Markdown внутри строк для структуры.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
};

export const generateRoadmap = async (synthesizedIdea: string): Promise<ProjectRoadmap> => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    Ты — ИИ-Агент Project Planner в Story Tales Catalyst. Начинаем Этап 2: Roadmap.
    
    Финальная концепция книги:
    ${synthesizedIdea}

    Твоя задача: сформировать детальный roadmap проекта, разбив его на стадии:
    - Концепция и нарратив
    - UX/UI и интерактивность
    - Тексты и визуальная часть
    - Техническая реализация
    - Тестирование и полировка
    - Маркетинг и запуск

    Для каждой стадии укажи список задач с ответственными (из списка: ${AGENTS.map(a => a.role).join(", ")}), зависимостями и приоритетом (MVP/Future).

    Верни ответ в формате JSON:
    {
      "stages": [
        {
          "name": "Название стадии",
          "tasks": [
            { "id": "t1", "title": "Задача", "assignee": "Роль", "dependencies": [], "priority": "MVP" }
          ]
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
};

export const generateOfficeOutputs = async (synthesizedIdea: string, roadmap: ProjectRoadmap): Promise<AgentOutput[]> => {
  const model = "gemini-3.1-pro-preview";
  
  // To avoid hitting token limits or timeouts, we might want to generate this in a few chunks or one big structured one.
  // Let's try one big structured request first.
  
  const prompt = `
    Ты — Виртуальный офис Story Tales Catalyst. Начинаем Этап 3: Работа специалистов.
    
    Концепция: ${synthesizedIdea}
    Roadmap: ${JSON.stringify(roadmap)}

    Твоя задача: От лица каждого из следующих специалистов выдать структурированный результат работы:
    ${AGENTS.map(a => `- ${a.role} (${a.id})`).join("\n")}

    Для каждого агента укажи:
    - Краткое описание целей.
    - Список ключевых решений.
    - Конкретные артефакты (структура глав, экраны, метрики и т.д. в Markdown).

    Верни ответ в формате JSON:
    {
      "outputs": [
        {
          "agentId": "id",
          "role": "Роль",
          "goals": "Цели",
          "decisions": ["решение 1", "решение 2"],
          "artifacts": "Markdown контент"
        }
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });

  const data = JSON.parse(response.text || "{}");
  return data.outputs || [];
};

export const generateBook = async (synthesizedIdea: string, officeOutputs: AgentOutput[]): Promise<BookContent> => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    Ты — Story Tales Catalyst. Финальный этап: Создание книги.
    
    На основе концепции и проработки специалистов, создай финальный контент книги.
    
    Концепция: ${synthesizedIdea}
    Проработка офиса: ${JSON.stringify(officeOutputs.map(o => ({ role: o.role, decisions: o.decisions })))}

    Твоя задача:
    1. Напиши название и краткое резюме.
    2. Разработай 5 ключевых глав/сцен. Для каждой:
       - Текст истории (для чтения).
       - Описание интерактива (что делает ребенок).
       - Описание визуалов (для художника).
    3. Сформируй Технический Манифест (стек, архитектура).
    4. Сформируй Маркетинговый Кит (слоган, каналы).

    Верни ответ в формате JSON:
    {
      "title": "Название",
      "summary": "Резюме",
      "chapters": [
        { "title": "Глава 1", "content": "Текст", "interaction": "Интерактив", "visuals": "Визуалы" }
      ],
      "technicalManifest": "Markdown текст",
      "marketingKit": "Markdown текст"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });

  return JSON.parse(response.text || "{}");
};
