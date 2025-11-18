import type { EventMemory, EventType, ProfileType, StaticMemory, ProfileMemory } from './models';

export type MemoryGetCmd = {
	query: string;
	tokens: number;
	povId: string;
	npcIds: string[];
	chatId: string;
};
export type MemporyGetResult = {
	static: StaticMemory[];
	event: EventMemory[];
	profile: ProfileMemory[];
};

export type MemoryProfilePutDto = {
	characterIds: string[];
	content: string;
	type: ProfileType;
};
export type MemoryEventPutDto = {
	chatId: string;
	content: string;
	type: EventType;
};
export type MemoryPutCmd = {
	profiles: MemoryProfilePutDto[];
	events: MemoryEventPutDto[];
};

export interface MemoryApp {
	get(cmd: MemoryGetCmd): Promise<MemporyGetResult>;
	put(cmd: MemoryPutCmd): Promise<void>;
}
