import type { Story } from './models';

export interface StoryApp {
	getByChat(chatId: string): Promise<Story>;
}
