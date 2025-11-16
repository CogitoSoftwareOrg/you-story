import type { Memory } from './models';

export interface ProfileIndexer {
	index(memory: Memory[]): Promise<void>;
}
export interface EventIndexer {
	index(memory: Memory[]): Promise<void>;
}

export interface ProfileSearcher {
	search(query: string, limit: number): Promise<Memory[]>;
}
export interface EventSearcher {
	search(query: string, limit: number): Promise<Memory[]>;
}
