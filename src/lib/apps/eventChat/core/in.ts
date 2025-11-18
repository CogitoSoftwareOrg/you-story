import type { UsersResponse } from '$lib';

export interface SendUserMessageCmd {
	user: UsersResponse;
	chatId: string;
	query: string;
}

export interface ChatApp {
	run(cmd: SendUserMessageCmd): Promise<string>;
	generate(cmd: SendUserMessageCmd): Promise<ReadableStream>;
}
