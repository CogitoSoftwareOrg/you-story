import type { Notes } from '$lib/apps/eventChat/core';
import type {
	CharactersResponse,
	ChatsResponse,
	MessagesResponse,
	StoryEventsResponse,
	SubsResponse
} from './pocketbase-types';

export type StoryExpand =
	| {
			storyEvents_via_story: StoryEventsResponse<StoryEventExpand>[] | undefined;
	  }
	| undefined;

export type StoryEventExpand =
	| {
			characters: CharactersResponse[] | undefined;
			chats_via_storyEvent: ChatsResponse<Notes, ChatExpand>[] | undefined;
	  }
	| undefined;

export type MessageExpand =
	| {
			character: CharactersResponse | undefined;
	  }
	| undefined;

export type ChatExpand =
	| {
			messages_via_chat: MessagesResponse<unknown, MessageExpand>[] | undefined;
			povCharacter: CharactersResponse | undefined;
			storyEvent: StoryEventsResponse | undefined;
	  }
	| undefined;

export type UserExpand =
	| {
			subs_via_user: SubsResponse[] | undefined;
	  }
	| undefined;
