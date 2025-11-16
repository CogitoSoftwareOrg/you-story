import { openaiSceneEnhancer, openaiScenePlanner } from '../adapters';
import {
	type EnhanceOutput,
	type Enhancer,
	type SceneApp,
	CharacterPolicyEngine,
	scenePolicyEngine,
	characterPolicyEngine,
	ScenePolicyEngine,
	type ScenePolicy,
	type ScenePlan,
	type ScenePlanner
} from '../core';

export class SceneAppImpl implements SceneApp {
	constructor(
		private readonly scenePolicyEngine: ScenePolicyEngine,
		private readonly characterPolicyEngine: CharacterPolicyEngine,
		private readonly enhancer: Enhancer,
		private readonly scenePlanner: ScenePlanner
	) {}

	async enhanceQuery(query: string): Promise<EnhanceOutput> {
		const enhance = await this.enhancer.enhance(query);
		return enhance;
	}
	async getPolicy(enhance: EnhanceOutput): Promise<ScenePolicy> {
		const scene = this.scenePolicyEngine.get(enhance);
		return scene;
	}

	async plan(policy: ScenePolicy): Promise<ScenePlan> {
		const plan = this.scenePlanner.plan(policy);
		return plan;
	}
}

export const sceneApp = new SceneAppImpl(
	scenePolicyEngine,
	characterPolicyEngine,
	openaiSceneEnhancer,
	openaiScenePlanner
);
