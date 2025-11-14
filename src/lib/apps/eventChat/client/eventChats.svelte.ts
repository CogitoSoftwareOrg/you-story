import { Collections, pb, type EventChatsResponse } from '$lib';

class EventChatsStore {
	_eventChats: EventChatsResponse[] = $state([]);

	eventChats = $derived(this._eventChats);

	setEventChats(eventChats: EventChatsResponse[]) {
		this._eventChats = eventChats;
	}

	getEventChats(eventId: string) {
		return this._eventChats.filter((chat) => chat.storyEvent === eventId);
	}

	async getById(id: string, expand?: string) {
		return await pb.collection(Collections.EventChats).getOne(id, { expand });
	}

	canCreateNewChat(eventId: string): boolean {
		const eventChats = this.getEventChats(eventId);
		if (eventChats.length === 0) return true;
		return eventChats.every((chat) => chat.status === 'fixed');
	}

	async subscribe() {
		return pb.collection(Collections.EventChats).subscribe('*', (e) => {
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
		pb.collection(Collections.EventChats).unsubscribe();
	}
}

export const eventChatsStore = new EventChatsStore();
