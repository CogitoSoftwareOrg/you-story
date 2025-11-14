import { pb, type EventChatsResponse, type Create, type Update, Collections } from '$lib';

class EventChatsStore {
	_eventChats: EventChatsResponse[] = $state([]);

	eventChats = $derived(this._eventChats);

	setEventChats(eventChats: EventChatsResponse[]) {
		this._eventChats = eventChats;
	}

	addEventChat(eventChat: EventChatsResponse) {
		const existing = this._eventChats.filter((item) => item.id !== eventChat.id);
		this._eventChats = [eventChat, ...existing];
	}

	// Get chats for a specific event
	getEventChats(eventId: string) {
		return this._eventChats.filter((chat) => chat.storyEvent === eventId);
	}

	// Check if all chats for an event are fixed
	canCreateNewChat(eventId: string): boolean {
		const eventChats = this.getEventChats(eventId);
		if (eventChats.length === 0) return true;
		return eventChats.every((chat) => chat.status === 'fixed');
	}

	// Create new chat
	async create(data: Create<'eventChats'>) {
		const chat = await pb.collection(Collections.EventChats).create(data);
		this.addEventChat(chat);
		return chat;
	}

	// Update chat
	async update(id: string, data: Update<'eventChats'>) {
		const chat = await pb.collection(Collections.EventChats).update(id, data);
		this._eventChats = this._eventChats.map((item) => (item.id === id ? chat : item));
		return chat;
	}

	// Get single chat by id
	async getById(id: string, expand?: string) {
		return await pb.collection(Collections.EventChats).getOne(id, { expand });
	}

	async subscribe() {
		return pb.collection('eventChats').subscribe('*', (e) => {
			switch (e.action) {
				case 'create':
					this._eventChats = this._eventChats.filter((item) => !item.id.startsWith('temp-'));
					this._eventChats.unshift(e.record);
					break;
				case 'update':
					this._eventChats = this._eventChats.map((item) =>
						item.id === e.record.id ? e.record : item
					);
					break;
				case 'delete':
					this._eventChats = this._eventChats.filter((item) => item.id !== e.record.id);
					break;
			}
		});
	}

	unsubscribe() {
		pb.collection('eventChats').unsubscribe();
	}
}

export const eventChatsStore = new EventChatsStore();
