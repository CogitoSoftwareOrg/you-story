import { pb, Collections } from '$lib';

export async function loadStoryContext(storyId: string) {
	const storyEvents = await pb
		.collection(Collections.StoryEvents)
		.getFullList({ filter: `story = "${storyId}"`, sort: 'order' });

	const chats = await pb.collection(Collections.Chats).getFullList({
		filter: `storyEvent.story = "${storyId}"`,
		expand: 'storyEvent',
		sort: '-created'
	});
	console.log(chats);

	return { storyEvents, chats };
}
