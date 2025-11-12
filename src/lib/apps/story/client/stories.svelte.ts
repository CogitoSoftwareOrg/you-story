import { pb, type StoriesResponse } from '$lib';

class StoriesStore {
	_stories: StoriesResponse[] = $state([]);

	stories = $derived(this._stories);

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
