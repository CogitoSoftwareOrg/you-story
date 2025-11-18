import { observeOpenAI } from '@langfuse/openai';
import { zodResponseFormat } from 'openai/helpers/zod.js';

import { grok, LLMS } from '$lib/shared/server';

import {
	EnhanceOutputSchema,
	type EnhanceOutput,
	type Enhancer,
	type OpenAIMessage
} from '../../core';

import { ENHANCE_PROMPT } from './prompts';

const ENHANCER_MODEL = LLMS.GROK_4_FAST_NON_REASONING;

class OpenAISceneEnhancer implements Enhancer {
	async enhance(history: OpenAIMessage[]): Promise<EnhanceOutput> {
		const messages: OpenAIMessage[] = [{ role: 'system', content: ENHANCE_PROMPT }];

		// const previousHistory = history.slice(0, -3);
		// if (previousHistory.length > 0 && history.length > 3) {
		// 	messages.push({ role: 'system', content: 'Conversation context:\n' });
		// 	for (const msg of previousHistory) {
		// 		messages.push(msg);
		// 	}
		// }
		// const latestHistory = history.slice(-3);
		// if (latestHistory.length > 0) {
		// 	messages.push({ role: 'system', content: 'Intent target:\n' });
		// 	for (const msg of latestHistory) {
		// 		messages.push(msg);
		// 	}
		// }

		const grokLf = observeOpenAI(grok);

		const completion = await grokLf.chat.completions.create({
			model: ENHANCER_MODEL,
			messages: [...messages, ...history],
			response_format: zodResponseFormat(EnhanceOutputSchema, 'query_enhancement')
		});

		return EnhanceOutputSchema.parse(JSON.parse(completion.choices[0].message.content || '{}'));
	}
}

export const openaiSceneEnhancer = new OpenAISceneEnhancer();
