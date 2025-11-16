export type ProfileType = 'character' | 'user' | 'relationship';

export type EventType = 'story' | 'chat' | 'action' | 'decision';

export type Memory = {
	kind: 'event' | 'profile' | 'fact';
	type: ProfileType | EventType;
	static: boolean;
	content: string;
};
