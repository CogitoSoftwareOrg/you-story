import type { CharactersResponse } from '$lib/shared';

export enum Archetype {
	Mentor = 'mentor',
	Tsundere = 'tsundere',
	Yandere = 'yandere',
	Trickster = 'trickster',
	Playboy = 'playboy',
	Nerd = 'nerd'
}

export class Character {
	constructor(
		public readonly data: CharactersResponse,
		public staticPrompt = ''
	) {}

	static fromResponse(res: CharactersResponse): Character {
		const character = new Character(res);
		character.buildStaticPrompt();
		return character;
	}

	private buildStaticPrompt() {
		this.staticPrompt = `
CharacterID: ${this.data.id}
Name: ${this.data.name}
Age: ${this.data.age}

Description:
${this.data.description}
`;
	}
}
