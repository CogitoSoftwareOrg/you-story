import type { Memory } from './models';

export type MemoryKind = 'friend' | 'character';

export type MemoryGetCmd = {
	kind: MemoryKind;
	query: string;
	tokenLimit: number;
	povId?: string;
	characterIds?: string[];
	chatId: string;
};

export interface MemoryApp {
	get(cmd: MemoryGetCmd): Promise<Memory[]>;
	put(memory: Memory[]): Promise<void>;
}
