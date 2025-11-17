import z from 'zod';

import type { Archetype } from '$lib/apps/character/core';

// SCENE INTENT

export enum SceneIntent {
	CasualDialogue = 'casualDialogue',
	SeriousTalk = 'seriousTalk',
	RomanticFlirt = 'romanticFlirt',
	IntimateEmotional = 'intimateEmotional',
	SexualEncounter = 'sexualEncounter',
	HighTensionAction = 'highTensionAction',
	StoryContinuation = 'storyContinuation',
	EmotionalSupport = 'emotionalSupport',
	Exposition = 'exposition'
}

export enum SceneFlowType {
	Dialogue = 'dialogue',
	Banter = 'banter',
	Intimate = 'intimate',
	Action = 'action',
	Exposition = 'exposition'
}

export enum UserEmotion {
	Neutral = 'neutral',
	Good = 'good',
	Bad = 'bad',
	Anxious = 'anxious',
	Excited = 'excited',
	Horny = 'horny',
	Angry = 'angry'
}

export const EnhanceOutputSchema = z.object({
	query: z.string().describe('Enriched, explicit version of what the user wants next.'),
	interactionIntent: z
		.enum(Object.values(SceneIntent))
		.describe('Best-guess high-level intent of the upcoming scene.'),
	userEmotion: z
		.enum(Object.values(UserEmotion))
		.describe("Best-guess of the user's current emotional state."),
	sceneFlowType: z
		.enum(Object.values(SceneFlowType))
		.describe('Expected structural flow for the next scene.')
	// perCharacterMoodDelta: z
	// 	.record(
	// 		z.string().describe('Character ID.'),
	// 		z
	// 			.enum(['increased', 'decreased', 'neutral'])
	// 			.describe('Relative change of this character’s mood since last context.')
	// 	)
	// 	.describe('Per-character mood change inferred from the latest interaction.')
});
export type EnhanceOutput = z.infer<typeof EnhanceOutputSchema>;

// SCENE POLICY
export enum DetailLevel {
	Low = 'low',
	Medium = 'medium',
	High = 'high'
}

export enum Tempo {
	Slow = 'slow',
	Normal = 'normal',
	Fast = 'fast'
}

export enum DialogueDensity {
	Low = 'low',
	Medium = 'medium',
	High = 'high'
}
export enum ThoughtsDensity {
	Low = 'low',
	Medium = 'medium',
	High = 'high'
}
export enum WorldDensity {
	Low = 'low',
	Medium = 'medium',
	High = 'high'
}
export type ScenePolicy = {
	intent: SceneIntent;
	sceneFlowType: SceneFlowType;
	userEmotion: UserEmotion;

	tempo: Tempo;
	detailLevel: DetailLevel;
	dialogueDensity: DialogueDensity;
	thoughtsDensity: ThoughtsDensity;
	worldDensity: WorldDensity;
	maxBeats: number;
	maxBeatsPerActor: number;
};

// CHARACTER POLICY
export enum CharacterMood {
	Neutral = 'neutral',
	Soft = 'soft',
	Playful = 'playful',
	Reserved = 'reserved',
	Angry = 'angry',
	Anxious = 'anxious'
}

export enum RelationshipState {
	Stranger = 'stranger',
	Acquaintance = 'acquaintance',
	Friend = 'friend',
	Close = 'close',
	Enemy = 'enemy'
}

export enum CharacterRoleInScene {
	Focus = 'focus', // POV / главный в этой сцене
	Support = 'support', // важный второстепенный
	Background = 'background'
}

export enum StepMode {
	Speech = 'speech',
	Thoughts = 'thoughts',
	World = 'world'
}

export type CharacterPolicy = {
	characterId: string;
	archetype: Archetype;
	prompts: string;
	sessionStyle?: string;

	mood: CharacterMood;
	relationshipState: RelationshipState;

	allowedModes: StepMode[];
	preferredDetailLevel: DetailLevel;
	goals: string[];
	boundaries: string[];
};

// SCENE PLAN
export const SchemaSceneStep = z.object({
	type: z
		.enum(['world', 'thoughts', 'speech'])
		.describe('Step type: world (environment), thoughts (inner monologue), or speech (dialogue).'),
	characterId: z
		.string()
		.nullable()
		.optional()
		.describe('Character acting / speaking / thinking in this step, if any.'),
	description: z.string().describe('Natural-language description of what happens in this step.')
});
export const SchemaScenePlan = z.object({
	steps: z.array(SchemaSceneStep)
});
export type ScenePlan = z.infer<typeof SchemaScenePlan>;
