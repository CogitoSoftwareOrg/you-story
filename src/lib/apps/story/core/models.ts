import type { StoriesResponse, StoryExpand } from '$lib';

export interface StoryBible {
	style: string[];
	worldFacts: string[];
}

export class Story {
	constructor(
		public readonly data: StoriesResponse<StoryBible, StoryExpand>,
		public staticPrompt = ''
	) {}

	getEvents() {
		return this.data.expand?.storyEvents_via_story || [];
	}

	static fromResponse(res: StoriesResponse<StoryBible, StoryExpand>, eventOrder?: number): Story {
		const story = new Story(res);
		story.buildStaticPrompt(eventOrder);
		return story;
	}

	buildStaticPrompt(eventOrder?: number) {
		this.staticPrompt = `
Story: ${this.data.name}

Description:
${this.data.description}

Bible:
Style: ${this.data.bible?.style.join('\n')}
World Facts: ${this.data.bible?.worldFacts.join('\n')}
`;
		if (!eventOrder) return;

		const events = this.getEvents();
		const event = events.find((e) => e.order === eventOrder);
		const prevEvents = events.filter((e) => e.order < eventOrder);

		this.staticPrompt = `
${this.staticPrompt}

Previous Events:
${prevEvents.map((event) => `Event: ${event.name}\nDescription: ${event.description}\n\n`).join('\n')}

Current Event:
${event?.name}
Description: ${event?.description}
`;
	}
}
