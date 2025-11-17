import { profileIndexer, eventIndexer } from '../adapters';
import type {
	MemoryGetCmd,
	MemoryApp,
	Memory,
	ProfileIndexer,
	EventIndexer,
	ProfileMemory,
	EventMemory,
	MemoryKind
} from '../core';

export class MemoryAppImpl implements MemoryApp {
	constructor(
		private readonly profileIndexer: ProfileIndexer,
		private readonly eventIndexer: EventIndexer
	) {}

	async get(cmd: MemoryGetCmd): Promise<Memory[]> {
		const memories: Memory[] = [];
		console.log(cmd);
		return memories;
	}

	async put(memories: Memory[]): Promise<void> {
		const profileMemories: ProfileMemory[] = [];
		const eventMemories: EventMemory[] = [];
		for (const memory of memories) {
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
		kind: MemoryKind,
		chatId: string,
		tokens: number,
		characterIds: string[]
	): Promise<EventMemory[]> {
		console.log(chatId, tokens, characterIds);
		const memories: EventMemory[] = [];

		return memories;
	}

	private async getChatMemories(
		query: string,
		chatId: string,
		tokens: number
	): Promise<EventMemory[]> {
		const limit = Math.floor(tokens / 1000);
		const half = Math.floor(limit / 2);
		const allMemories = await this.eventIndexer.search(query, half, undefined, chatId);
		const latestMemories = await this.eventIndexer.search(query, half, undefined, chatId, 7);
		return [...allMemories, ...latestMemories];
	}
}

Promise.all([profileIndexer.migrate(), eventIndexer.migrate()]).then(() => {
	console.log('Memory indexers migrated');
});
export const memoryApp = new MemoryAppImpl(profileIndexer, eventIndexer);
