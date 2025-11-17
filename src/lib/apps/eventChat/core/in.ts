import type { UsersResponse } from '$lib';

export interface SendUserMessageCmd {
	user: UsersResponse;
	chatId: string;
	query: string;
}

export interface ChatApp {
	generate(cmd: SendUserMessageCmd): Promise<ReadableStream>;
}
