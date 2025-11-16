import type { Memory } from './models';

export type MemoryGetCmd = {
	space: 'friend' | 'story';
	query: string;
	tokenLimit: number;
};

export interface MemoryApp {
	get(cmd: MemoryGetCmd): Promise<Memory[]>;
	put(memory: Memory[]): Promise<void>;
}
