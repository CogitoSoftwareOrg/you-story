import { observeOpenAI } from '@langfuse/openai';
import { zodResponseFormat } from 'openai/helpers/zod.js';

import { grok, LLMS } from '$lib/shared/server';

import { EnhanceOutputSchema, type EnhanceOutput, type Enhancer } from '../../core';

const ENHANCER_MODEL = LLMS.GROK_4_FAST_NON_REASONING;

const ENHANCE_PROMPT = `
You are a helpful assistant that enhances the user's query to help the user plan a scene.
`;

class OpenAISceneEnhancer implements Enhancer {
	async enhance(query: string): Promise<EnhanceOutput> {
		const grokLf = observeOpenAI(grok);
		const completion = await grokLf.chat.completions.create({
			model: ENHANCER_MODEL,
			messages: [
				{ role: 'system', content: ENHANCE_PROMPT },
				{ role: 'user', content: query }
			],
			response_format: zodResponseFormat(EnhanceOutputSchema, 'query_enhancement')
		});

		return EnhanceOutputSchema.parse(JSON.parse(completion.choices[0].message.content || '{}'));
	}
}

export const openaiSceneEnhancer = new OpenAISceneEnhancer();
