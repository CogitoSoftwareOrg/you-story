import { openaiSceneEnhancer, openaiScenePlanner, openaiSceneActor } from '../adapters';
import {
	type EnhanceOutput,
	type Enhancer,
	type SceneApp,
	getScenePolicy,
	type ScenePolicy,
	type ScenePlan,
	type ScenePlanner,
	type SceneActor
} from '../core';

export class SceneAppImpl implements SceneApp {
	constructor(
		private readonly enhancer: Enhancer,
		private readonly scenePlanner: ScenePlanner,
		private readonly sceneActor: SceneActor
	) {}

	// Prepare
	async enhanceQuery(query: string): Promise<EnhanceOutput> {
		const enhance = await this.enhancer.enhance(query);
		return enhance;
	}
	async getPolicy(enhance: EnhanceOutput): Promise<ScenePolicy> {
		const scene = getScenePolicy(enhance);
		return scene;
	}

	// Plan
	async plan(policy: ScenePolicy): Promise<ScenePlan> {
		const plan = this.scenePlanner.plan(policy);
		return plan;
	}

	// Act
	async act(plan: ScenePlan, idx: number): Promise<string> {
		const text = await this.sceneActor.act(plan, idx);
		return text;
	}
	actStream(plan: ScenePlan, idx: number): ReadableStream<string> {
		const stream = this.sceneActor.actStream(plan, idx);
		return stream;
	}
}

export const sceneApp = new SceneAppImpl(openaiSceneEnhancer, openaiScenePlanner, openaiSceneActor);
