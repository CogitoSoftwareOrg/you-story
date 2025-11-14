import { pb, type StoriesResponse } from '$lib';

import pchelImage from '$lib/shared/assets/images/pchel.png';

class StoriesStore {
	_stories: StoriesResponse[] = $state([]);

	stories = $derived(this._stories);

	setStories(stories: StoriesResponse[]) {
		this._stories = stories;
	}

	addStory(story: StoriesResponse) {
		const existing = this._stories.filter((item) => item.id !== story.id);
		this._stories = [story, ...existing];
	}

	getCoverUrl(story: StoriesResponse): string | null {
		if (!story.cover) return null;
		return pb?.files.getURL(story, story.cover) ?? pchelImage;
	}

	async subscribe() {
		return pb!.collection('stories').subscribe('*', (e) => {
			switch (e.action) {
				case 'create':
					this._stories.unshift(e.record);
					break;
				case 'update':
					this._stories = this._stories.map((story) =>
						story.id === e.record.id ? e.record : story
					);
					break;
				case 'delete':
					this._stories = this._stories.filter((story) => story.id !== e.record.id);
					break;
			}
		});
	}

	unsubscribe() {
		pb!.collection('stories').unsubscribe();
	}
}

export const storiesStore = new StoriesStore();
