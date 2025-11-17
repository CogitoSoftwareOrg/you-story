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
		const grokLf = observeOpenAI(grok);
		const completion = await grokLf.chat.completions.create({
			model: ENHANCER_MODEL,
			messages: [{ role: 'system', content: ENHANCE_PROMPT }, ...history],
			response_format: zodResponseFormat(EnhanceOutputSchema, 'query_enhancement')
		});

		return EnhanceOutputSchema.parse(JSON.parse(completion.choices[0].message.content || '{}'));
	}
}

export const openaiSceneEnhancer = new OpenAISceneEnhancer();
