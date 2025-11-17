import { storyApp } from '$lib/apps/story/app';
import type { StoryApp } from '$lib/apps/story/core';
import { characterApp } from '$lib/apps/character/app';
import type { CharacterApp } from '$lib/apps/character/core';

import { profileIndexer, eventIndexer } from '../adapters';
import type {
	MemoryGetCmd,
	MemoryApp,
	ProfileIndexer,
	EventIndexer,
	ProfileMemory,
	EventMemory,
	MemoryPutCmd,
	StaticMemory,
	MemporyGetResult
} from '../core';
import { LLMS, TOKENIZERS } from '$lib/shared/server';

const DAYS_TO_SEARCH_LATEST_MEMORIES = 7;
const STATIC_TOKEN_LIMIT = 2000;

export class MemoryAppImpl implements MemoryApp {
	constructor(
		// ADAPTERS
		private readonly profileIndexer: ProfileIndexer,
		private readonly eventIndexer: EventIndexer,

		// APPS
		private readonly storyApp: StoryApp,
		private readonly characterApp: CharacterApp
	) {}

	async get(cmd: MemoryGetCmd): Promise<MemporyGetResult> {
		const charIds = [cmd.povId, ...cmd.npcIds].filter((id) => id.trim() !== '');

		// STATIC
		const staticMemories = await this.getStaticMemories(cmd.chatId, STATIC_TOKEN_LIMIT, charIds);
		cmd.tokens -= staticMemories.reduce((acc, mem) => acc + mem.tokens, 0);

		// CHARACTERS
		const charactersMemories = await this.getCharactersMemories(
			cmd.query,
			charIds,
			Math.floor(cmd.tokens / 2)
		);
		cmd.tokens -= charactersMemories.reduce((acc, mem) => acc + mem.tokens, 0);

		// CHAT
		const chatMemories = await this.getChatMemories(cmd.query, cmd.chatId, cmd.tokens);
		return {
			static: staticMemories,
			event: chatMemories,
			profile: charactersMemories
		};
	}

	async put(cmd: MemoryPutCmd): Promise<void> {
		const profileMemories: ProfileMemory[] = [];
		const eventMemories: EventMemory[] = [];
		for (const memory of cmd.memories) {
			if (memory.kind === 'profile') {
				profileMemories.push(memory);
			} else if (memory.kind === 'event') {
				eventMemories.push(memory);
			}
		}
		await Promise.all([
			this.profileIndexer.add(profileMemories),
			this.eventIndexer.add(eventMemories)
		]);
	}

	private async getStaticMemories(
		chatId: string,
		tokens: number,
		characterIds: string[]
	): Promise<StaticMemory[]> {
		const memories: StaticMemory[] = [];
		let storyPrompt = '';
		try {
			const story = await this.storyApp.getByChat(chatId);
			storyPrompt += story.staticPrompt;
		} catch {
			storyPrompt = `
General Information:
Today is ${new Date().toLocaleDateString()}.
`;
			console.warn(`Story not found for chat ${chatId}`);
		}
		memories.push({
			kind: 'static',
			content: storyPrompt,
			tokens: TOKENIZERS[LLMS.GROK_4_FAST].encode(storyPrompt).length
		});

		tokens -= memories[0].tokens;
		if (tokens < 0) {
			console.warn(
				`Not enough tokens for static prompt for chat ${chatId}: ${tokens * -1} tokens more`
			);
			return memories;
		}

		const characters = await this.characterApp.getByIds(characterIds);
		for (const char of characters) {
			const mem: StaticMemory = {
				kind: 'static',
				characterId: char.data.id,
				content: char.staticPrompt,
				tokens: TOKENIZERS[LLMS.GROK_4_FAST].encode(char.staticPrompt).length
			};
			memories.push(mem);
			if (mem.tokens > tokens) {
				console.warn(
					`Not enough tokens for character ${char.data.name}: ${mem.tokens * -1} tokens more`
				);
				break;
			}
			tokens -= mem.tokens;
		}

		return memories;
	}

	private async getChatMemories(
		query: string,
		chatId: string,
		tokens: number
	): Promise<EventMemory[]> {
		const half = Math.floor(tokens / 2);
		const allMemories = await this.eventIndexer.search(query, half, chatId);
		const latestMemories = await this.eventIndexer.search(
			query,
			half,
			chatId,
			DAYS_TO_SEARCH_LATEST_MEMORIES
		);
		return [...allMemories, ...latestMemories];
	}

	private async getCharactersMemories(
		query: string,
		charIds: string[],
		tokens: number
	): Promise<ProfileMemory[]> {
		const memories = await this.profileIndexer.search(query, tokens, charIds);
		return memories;
	}
}

Promise.all([profileIndexer.migrate(), eventIndexer.migrate()]).then(() => {
	console.log('Memory indexers migrated');
});
export const memoryApp = new MemoryAppImpl(profileIndexer, eventIndexer, storyApp, characterApp);
