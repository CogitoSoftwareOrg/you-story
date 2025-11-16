import {
	SceneIntent,
	SceneFlowType,
	UserEmotion,
	DetailLevel,
	Tempo,
	DialogueDensity,
	ThoughtsDensity,
	WorldDensity,
	type EnhanceOutput,
	type ScenePolicy
} from '../models';

export function getScenePolicy(enhance: EnhanceOutput): ScenePolicy {
	const { interactionIntent, sceneFlowType, userEmotion } = enhance;

	let tempo = Tempo.Normal;
	let detailLevel = DetailLevel.Medium;
	let dialogueDensity = DialogueDensity.Medium;
	let thoughtsDensity = ThoughtsDensity.Low;
	let worldDensity = WorldDensity.Low;
	let maxBeats = 2;
	let maxBeatsPerActor = 1;

	switch (interactionIntent) {
		case SceneIntent.CasualDialogue:
		case SceneIntent.StoryContinuation: {
			tempo = Tempo.Normal;
			detailLevel = DetailLevel.Medium;
			dialogueDensity = DialogueDensity.High;
			thoughtsDensity = ThoughtsDensity.Low;
			worldDensity = WorldDensity.Low;
			maxBeats = 1;
			maxBeatsPerActor = 1;
			break;
		}
		case SceneIntent.SeriousTalk:
		case SceneIntent.EmotionalSupport: {
			tempo = Tempo.Slow;
			detailLevel = DetailLevel.Medium;
			dialogueDensity = DialogueDensity.Medium;
			thoughtsDensity = ThoughtsDensity.Medium;
			worldDensity = WorldDensity.Low;
			maxBeats = 2;
			maxBeatsPerActor = 1;
			break;
		}
		case SceneIntent.RomanticFlirt: {
			tempo = Tempo.Slow;
			detailLevel = DetailLevel.High; // больше деталей и нюансов
			dialogueDensity = DialogueDensity.High;
			thoughtsDensity = ThoughtsDensity.Medium;
			worldDensity = WorldDensity.Low;
			maxBeats = 3;
			maxBeatsPerActor = 2;
			break;
		}
		case SceneIntent.IntimateEmotional: {
			tempo = Tempo.Slow;
			detailLevel = DetailLevel.High; // эмоциональная глубина
			dialogueDensity = DialogueDensity.Medium;
			thoughtsDensity = ThoughtsDensity.High;
			worldDensity = WorldDensity.Low;
			maxBeats = 3;
			maxBeatsPerActor = 2;
			break;
		}
		case SceneIntent.SexualEncounter: {
			tempo = Tempo.Slow;
			detailLevel = DetailLevel.High;
			dialogueDensity = DialogueDensity.Medium;
			thoughtsDensity = ThoughtsDensity.Low;
			worldDensity = WorldDensity.Low;
			maxBeats = 4;
			maxBeatsPerActor = 4;
			break;
		}
		case SceneIntent.HighTensionAction: {
			tempo = Tempo.Fast;
			detailLevel = DetailLevel.Medium;
			dialogueDensity = DialogueDensity.Medium;
			thoughtsDensity = ThoughtsDensity.Low;
			worldDensity = WorldDensity.High;
			maxBeats = 3;
			maxBeatsPerActor = 2;
			break;
		}
		case SceneIntent.Exposition: {
			tempo = Tempo.Normal;
			detailLevel = DetailLevel.Medium;
			dialogueDensity = DialogueDensity.Low;
			thoughtsDensity = ThoughtsDensity.Low;
			worldDensity = WorldDensity.Medium;
			maxBeats = 2;
			maxBeatsPerActor = 1;
			break;
		}
	}

	switch (sceneFlowType) {
		case SceneFlowType.Banter: {
			dialogueDensity = DialogueDensity.High;
			tempo = tempo === Tempo.Slow ? Tempo.Normal : tempo;
			thoughtsDensity =
				interactionIntent === SceneIntent.RomanticFlirt
					? ThoughtsDensity.Medium
					: ThoughtsDensity.Low;
			break;
		}
		case SceneFlowType.Intimate: {
			tempo = Tempo.Slow;
			if (detailLevel === DetailLevel.Medium) detailLevel = DetailLevel.High;

			thoughtsDensity =
				thoughtsDensity === ThoughtsDensity.Low ? ThoughtsDensity.Medium : thoughtsDensity;
			break;
		}
		case SceneFlowType.Action: {
			tempo = Tempo.Fast;
			worldDensity = worldDensity === WorldDensity.Low ? WorldDensity.Medium : worldDensity;
			thoughtsDensity = ThoughtsDensity.Low;
			break;
		}
		case SceneFlowType.Exposition: {
			dialogueDensity = DialogueDensity.Low;
			worldDensity = worldDensity === WorldDensity.Low ? WorldDensity.Medium : worldDensity;
			break;
		}
		case SceneFlowType.Dialogue: {
			dialogueDensity =
				dialogueDensity === DialogueDensity.Low ? DialogueDensity.Medium : dialogueDensity;
			break;
		}
	}

	if (userEmotion === UserEmotion.Excited || userEmotion === UserEmotion.Good) {
		if (tempo === Tempo.Slow) tempo = Tempo.Normal;
		if (detailLevel === DetailLevel.Medium && interactionIntent !== SceneIntent.HighTensionAction) {
			detailLevel = DetailLevel.High;
		}
	}

	if (userEmotion === UserEmotion.Bad || userEmotion === UserEmotion.Anxious) {
		tempo = Tempo.Slow;
	}

	return {
		intent: interactionIntent,
		sceneFlowType,
		userEmotion,
		tempo,
		detailLevel,
		dialogueDensity,
		thoughtsDensity,
		worldDensity,
		maxBeats,
		maxBeatsPerActor
	};
}
