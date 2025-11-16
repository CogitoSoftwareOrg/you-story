import { zodResponseFormat } from 'openai/helpers/zod.js';
import { observeOpenAI } from '@langfuse/openai';

import { grok, LLMS } from '$lib/shared/server';

import type { ScenePlanner, ScenePolicy, ScenePlan, OpenAIMessage } from '../../core';
import { SchemaScenePlan } from '../../core';

import { SCENE_PLAN_PROMPT } from './prompts';

export const SCENE_PLANNER_MODEL = LLMS.GROK_4_FAST;

class OpenAIScenePlanner implements ScenePlanner {
	async plan(policy: ScenePolicy): Promise<ScenePlan> {
		const messages: OpenAIMessage[] = [];
		messages.push({ role: 'system', content: SCENE_PLAN_PROMPT });
		messages.push({ role: 'system', content: JSON.stringify(policy, null, 2) });

		messages.push(...this.postBuildMessages());

		const grokLf = observeOpenAI(grok);

		const completion = await grokLf.chat.completions.create({
			model: SCENE_PLANNER_MODEL,
			messages,
			response_format: zodResponseFormat(SchemaScenePlan, 'scene_steps')
		});

		return SchemaScenePlan.parse(JSON.parse(completion.choices[0].message.content || '{}'));
	}

	private postBuildMessages(): OpenAIMessage[] {
		const messages: OpenAIMessage[] = [];

		const notes: string[] = [];
		if (notes.length > 0)
			messages.push({ role: 'system', content: 'Additional User instructions for the scene:\n' });
		for (const note of notes) messages.push({ role: 'user', content: note });

		const chatMessages: OpenAIMessage[] = [];
		if (chatMessages.length > 0) messages.push({ role: 'system', content: 'Chat history:\n' });
		for (const msg of chatMessages) {
			messages.push(msg);
		}

		return messages;
	}
}

export const openaiScenePlanner = new OpenAIScenePlanner();
