import type { Character } from './models';

export interface CharacterApp {
	getByIds(ids: string[]): Promise<Character[]>;
}
