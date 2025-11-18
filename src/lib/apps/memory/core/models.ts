export enum ProfileType {
	General = 'general',
	Specific = 'specific'
}

export enum EventType {
	Story = 'story',
	Chat = 'chat',
	Action = 'action',
	Decision = 'decision'
}

export type ProfileMemory = {
	kind: 'profile';
	type: ProfileType;
	characterIds: string[];
	content: string;
	tokens: number;
};

export type EventMemory = {
	kind: 'event';
	type: EventType;
	content: string;
	chatId: string;
	tokens: number;
};

export type StaticMemory = {
	kind: 'static';
	content: string;
	tokens: number;
	characterId?: string;
};

export type Memory = ProfileMemory | EventMemory | StaticMemory;
