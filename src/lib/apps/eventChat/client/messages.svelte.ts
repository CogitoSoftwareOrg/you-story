import { pb, type Collections, type IsoAutoDateString, type MessagesResponse } from '$lib';

import type { Sender } from './Message.svelte';

class MessagesStore {
	_loaded = $state(false);
	_messages: MessagesResponse[] = $state([]);

	get loaded() {
		return this._loaded;
	}

	get messages() {
		return this._messages;
	}
	set messages(messages: MessagesResponse[]) {
		this._messages = messages;
	}

	async load(quizAttemptId: string) {
		const messages = await pb!.collection('messages').getFullList({
			filter: `quizAttempt = "${quizAttemptId}"`,
			sort: 'created'
		});
		this.messages = messages;
		this._loaded = true;
	}

	async sendMessage(sender: Sender, content: string, itemId: string) {
		const clientMsg: MessagesResponse = {
			collectionId: 'messages',
			collectionName: 'messages' as Collections,
			id: `temp-${Date.now()}`,
			content,
			created: new Date().toISOString() as IsoAutoDateString,
			updated: new Date().toISOString() as IsoAutoDateString,
			metadata: { item_id: itemId },
			role: sender.role as MessagesResponse['role'],
			status: 'onClient' as MessagesResponse['status'],
			sender: sender.id
		};

		this.messages.push(clientMsg);
		const msg = { ...clientMsg, status: 'final' };
		await pb!.collection('messages').create(msg);

		const es = new EventSource(`api//sse?q=${encodeURIComponent(content)}&item=${itemId}`, {
			withCredentials: true
		});
		es.addEventListener('chunk', (e) => {
			const data = JSON.parse(e.data) as { text: string; msg_id: string; i?: number };
			const msg = { ...this._messages.find((m) => m.id === data.msg_id) } as MessagesResponse;
			if (!msg || msg.status !== 'streaming') return;

			// const nextI = data.i ?? ((msg as any)._last_i ?? 0) + 1;
			// if ((msg as any)._last_i && nextI <= (msg as any)._last_i) return;
			// (msg as any)._last_i = nextI;

			msg.content = (msg.content || '') + data.text;
			const newMessages = this._messages.map((m) => (m.id === msg.id ? msg : m));
			this._messages = newMessages;
		});
		es.addEventListener('error', (e) => {
			console.error(e);
			es.close();
		});
		es.addEventListener('done', () => {
			es.close();
		});
	}

	async subscribe(quizAttemptId: string) {
		return pb!.collection('messages').subscribe(
			'*',
			(e) => {
				const message = e.record;
				switch (e.action) {
					case 'create': {
						this._messages = this._messages.filter((m) => !m.id.startsWith('temp-'));
						this.messages.push(message);
						break;
					}
					case 'update': {
						this.messages = this.messages?.map((m) => (m.id === message.id ? message : m)) || [];
						break;
					}
					case 'delete': {
						this.messages = this.messages?.filter((m) => m.id !== message.id) || [];
						break;
					}
				}
			},
			{
				filter: `quizAttempt = "${quizAttemptId}"`
			}
		);
	}

	unsubscribe() {
		pb!.collection('messages').unsubscribe();
	}
}

export const messagesStore = new MessagesStore();
