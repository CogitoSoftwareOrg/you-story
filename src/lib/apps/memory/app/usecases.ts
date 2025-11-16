import type { MemoryGetCmd, MemoryApp, Memory } from '../core';

export class MemoryAppImpl implements MemoryApp {
	async get(cmd: MemoryGetCmd): Promise<Memory[]> {
		return [];
	}
}

export const memoryApp = new MemoryAppImpl();
