import type { Archetype } from '$lib/apps/character/core';

import {
	type ScenePolicy,
	type EnhanceOutput,
	type CharacterPolicy,
	CharacterMood,
	RelationshipState,
	StepMode,
	DetailLevel,
	UserEmotion,
	SceneIntent,
	ThoughtsDensity
} from '../models';

type CharacterPolicyInput = {
	characterId: string;
	archetype: Archetype;
	prompts: string;
	relationshipState: RelationshipState;
	scenePolicy: ScenePolicy;
	enhance: EnhanceOutput;
	sessionStyle?: string;
};

export class CharacterPolicyEngine {
	get(input: CharacterPolicyInput): CharacterPolicy {
		const {
			characterId,
			archetype,
			prompts,
			relationshipState,
			scenePolicy,
			enhance,
			sessionStyle
		} = input;

		const delta = enhance.perCharacterMoodDelta[characterId] ?? 'neutral';
		const mood = this.deriveMood(delta, enhance.userEmotion, relationshipState);

		const allowedModes: StepMode[] = [StepMode.Speech];

		if (scenePolicy.thoughtsDensity !== ThoughtsDensity.Low) {
			allowedModes.push(StepMode.Thoughts);
		}

		let preferredDetailLevel = scenePolicy.detailLevel;

		if (relationshipState === RelationshipState.Close) {
			if (preferredDetailLevel === DetailLevel.Low) {
				preferredDetailLevel = DetailLevel.Medium;
			}
		}

		const goals: string[] = [];
		const boundaries: string[] = [];

		boundaries.push('Stay consistent with your archetype and prior behavior.');

		switch (scenePolicy.intent) {
			case SceneIntent.EmotionalSupport:
			case SceneIntent.SeriousTalk:
				goals.push('Provide emotional support.', 'Acknowledge and validate user feelings.');
				break;
			case SceneIntent.RomanticFlirt:
				goals.push(
					'Build light romantic tension.',
					'Keep the conversation playful and respectful.'
				);
				break;
			case SceneIntent.IntimateEmotional:
				goals.push('Deepen emotional connection.', 'Be honest and vulnerable within safe bounds.');
				break;
			case SceneIntent.SexualEncounter:
				goals.push(
					'Write explicit descriptions of the sexual encounter.',
					'Build sexual tension and desire.'
				);
				break;
			case SceneIntent.CasualDialogue:
			case SceneIntent.StoryContinuation:
				goals.push('Maintain engaging conversation.', 'Advance the story naturally.');
				break;
			case SceneIntent.HighTensionAction:
				goals.push('Convey urgency and tension.', 'React to events in a focused manner.');
				break;
			case SceneIntent.Exposition:
				goals.push('Provide clear information about the world or situation.');
				break;
		}

		if (
			relationshipState === RelationshipState.Friend ||
			relationshipState === RelationshipState.Close
		) {
			goals.push('Maintain trust with the user.');
		}

		return {
			characterId,
			archetype,
			prompts,
			sessionStyle,

			mood,
			relationshipState,

			allowedModes,
			preferredDetailLevel,
			goals,
			boundaries
		};
	}

	private deriveMood(
		delta: 'increased' | 'decreased' | 'neutral',
		userEmotion: UserEmotion,
		relationship: RelationshipState
	): CharacterMood {
		if (delta === 'neutral') {
			if (userEmotion === UserEmotion.Anxious || userEmotion === UserEmotion.Bad) {
				return CharacterMood.Soft;
			}
			if (userEmotion === UserEmotion.Angry) {
				return CharacterMood.Reserved;
			}
			return CharacterMood.Neutral;
		}

		if (delta === 'increased') {
			if (relationship === RelationshipState.Friend || relationship === RelationshipState.Close) {
				return CharacterMood.Playful;
			}
			return CharacterMood.Soft;
		}

		if (relationship === RelationshipState.Enemy) {
			return CharacterMood.Angry;
		}
		return CharacterMood.Reserved;
	}
}

export const characterPolicyEngine = new CharacterPolicyEngine();
