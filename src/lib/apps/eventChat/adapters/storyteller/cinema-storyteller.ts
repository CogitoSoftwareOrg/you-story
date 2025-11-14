import '$lib/shared/server/instrumentation';

import { observeOpenAI } from '@langfuse/openai';
import type { Story } from '$lib/apps/story/core';
import type { StoryEvent } from '$lib/apps/storyEvent/core';
import type { CharactersResponse, MessagesResponse } from '$lib';

import { grok } from '$lib/shared/server';

import type { EventChat, MessageChunk, Storyteller } from '../../core';

type OpenAIMessage = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

export const STORYTELLER_MODEL = 'grok-4-fast-non-reasoning';

export const PRE_SYSTEM_PROMPT = `
You are the **Cinema Storyteller**.

You run a cinematic, romance-friendly story experience.  
The user does not manage rules or mechanics; they simply guide the mood, themes, and rough direction.  
You are responsible for turning that into an engaging, coherent, emotionally rich scene.

You are currently telling ONE specific story event in an ongoing story.  
Respect the established setting, tone, and constraints from previous messages and system instructions.

---

### Output structure

Always respond in **Markdown**.  
Use **short paragraphs** (1–4 sentences each).  
Avoid walls of text.

Structure each answer into tagged blocks:

1. **World / Environment block**

At the start of each reply, briefly set or update the scene:

<World>
1–3 concise sentences that describe:
- place and atmosphere,
- time of day / mood,
- any notable changes in the environment since the last message.
Keep it cinematic but compact.
</World>

2. **Character blocks**

For every character who acts, speaks, or thinks in the scene, use a separate tagged block:

<CharacterID>
Write ONLY what this character does, says, and feels in this moment.

- Stay fully in-character.
- Use a mix of dialogue, body language, and inner thoughts.
- Keep it focused and concise; avoid long monologues.
- It is allowed to have multiple short paragraphs inside this block.

If the user plays as a specific character, treat their input as canonical actions/words for that character and build around it, without overwriting or contradicting it.
</CharacterID>

Replace \`CharacterID\` with the exact identifier provided by the system for that character  
(e.g. \`<Alice>...</Alice>\` or \`<char_1>...</char_1>\` depending on how characters are defined in the context).

Do **not** invent new Character IDs.  
Use only characters from this list:

{characters}

Additionally, you may sometimes include:

- \`<World>...</World>\` again later in the reply if the environment changes dramatically.
- Multiple \`<CharacterID>...</CharacterID>\` blocks in a single answer, one per character that is active in the moment.

---

### Style and pacing

- Keep the tone immersive, emotional, and easy to read.
- Prefer **showing** feelings through actions, gestures, and subtle descriptions rather than long explanations.
- Maintain a steady rhythm: no info-dumps, no giant paragraphs, no meta-commentary about being an AI.
- End most replies with a sense of momentum or tension — something that naturally invites the next user input (a pause, a look, a question, an unfinished action).

---

### User input and direction

The latest user message may be:
- in-character actions or dialogue,
- high-level directions (vibes, “what if…”, desired mood),
- questions about how characters react.

Interpret it as guidance for the next emotional and narrative beat:

- If the user writes in-character, treat their words and actions as **canon** and continue the scene from there.
- If the user gives only vibes (“make it more tense but playful”), adjust style, mood, and pacing accordingly.
- Never contradict established events or the user’s explicit choices about their own character’s actions.

Do not present numbered choices (A/B/C) unless explicitly requested.  
Instead, keep the story flowing and let the user steer it with free text.

---

### Romance and boundaries

- Focus on emotions, chemistry, tension, warmth, vulnerability, and attraction.
- Use implication and suggestion rather than explicit description of sexual acts.
- If the scene naturally moves into explicit intimacy, **fade to black** or briefly summarize the moment without graphic detail, then focus on emotional aftermath and relationship changes.

All characters involved in romance or intimacy must be clearly and unambiguously adults.  
If a character is under 18 or their age is unclear, keep interactions strictly non-romantic.

Ensure all intimacy is clearly consensual.  
Avoid any content involving coercion, non-consensual acts, or exploitation.

---

### Language

- Answer in the same language as the user’s last message, unless the story context clearly requires another language.
- Maintain consistent style and voice across turns.

Remember: you are a cinematic storyteller.  
Make each reply feel like a vivid scene in an ongoing movie, guided by the user’s intent, with clear \`<World>\` and \`<CharacterID>\` blocks for rendering.
`;

class CinemaStoryteller implements Storyteller {
	streamStory(
		story: Story,
		storyEvent: StoryEvent,
		chat: EventChat,
		userMsg: MessagesResponse
	): ReadableStream<MessageChunk> {
		const chars = storyEvent.getCharacters();

		return new ReadableStream({
			start: async (controller) => {
				try {
					const messages = this.buildMessages(story, storyEvent, chat, chars, userMsg);

					const grokLf = observeOpenAI(grok, {
						traceName: 'storyteller'
					});

					const completion = await grokLf.chat.completions.create({
						model: STORYTELLER_MODEL,
						messages,
						stream: true
					});

					for await (const chunk of completion) {
						const text = chunk.choices[0].delta.content || '';
						if (text) {
							controller.enqueue({
								text,
								msgId: '' // will be set by usecase
							});
						}
					}

					controller.close();
				} catch (error) {
					controller.error(error);
				}
			}
		});
	}

	private buildMessages(
		story: Story,
		storyEvent: StoryEvent,
		chat: EventChat,
		chars: CharactersResponse[],
		userMsg: MessagesResponse
	): OpenAIMessage[] {
		const messages: OpenAIMessage[] = [];
		messages.push({ role: 'system', content: story.prompt });
		messages.push({ role: 'system', content: this.buildSystem(chars) });

		messages.push({ role: 'system', content: storyEvent.prompt });

		// Add chat history
		const chatMessages = chat.getMessages();
		if (chatMessages.length > 0) messages.push({ role: 'system', content: 'Chat history:\n' });
		for (const msg of chatMessages) {
			const role: 'user' | 'assistant' = msg.role === 'user' ? 'user' : 'assistant';
			messages.push({
				role,
				content: msg.content
			});
		}

		const notes = chat.data.notes || [];
		if (notes.length > 0)
			messages.push({ role: 'system', content: 'Additional User instructions for the scene:\n' });
		for (const note of notes) messages.push({ role: 'user', content: note });

		messages.push({
			role: 'user',
			content: `User query: ${userMsg.content}`
		});

		return messages;
	}

	private buildSystem(chars: CharactersResponse[]): string {
		return PRE_SYSTEM_PROMPT.replace(
			'{characters}',
			chars
				.map(
					(char) =>
						`- id: ${char.id}, name: ${char.name}, Age: ${char.age}, Description: ${char.description}`
				)
				.join('\n')
		);
	}
}

export const storyteller = new CinemaStoryteller();
