<script lang="ts">
	import {
		Heart,
		Shield,
		Lock,
		Download,
		Users,
		Calendar,
		BookOpen,
		Sparkles
	} from 'lucide-svelte';
</script>

<div class="bg-base-100">
	<!-- Hero Section -->
	<section class="relative flex min-h-screen items-center justify-center overflow-hidden">
		<!-- Background gradient -->
		<div
			class="absolute inset-0 bg-linear-to-br from-primary/10 via-base-100 to-secondary/10"
		></div>

		<!-- Decorative elements -->
		<div class="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
		<div class="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"></div>

		<div class="relative z-10 container mx-auto px-4 text-center sm:px-6 lg:px-8">
			<div class="mx-auto max-w-4xl space-y-8">
				<!-- Main heading -->
				<h1 class="text-5xl leading-tight font-bold text-base-content sm:text-6xl lg:text-7xl">
					Live Your Best Fantasies
					<br />
					<span class="text-primary">with AI Characters</span>
				</h1>

				<!-- Subheading -->
				<p class="mx-auto max-w-2xl text-xl leading-relaxed text-base-content/70 sm:text-2xl">
					Create immersive stories with any character you can imagine. Experience deep, engaging
					narratives powered by advanced AI technology.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
					<a href="/app/auth" class="btn px-8 text-lg btn-lg btn-primary">
						<Sparkles class="h-5 w-5" />
						Start Creating
					</a>
				</div>

				<!-- Trust indicator -->
				<div class="flex items-center justify-center gap-2 pt-8 text-sm text-base-content/60">
					<Shield class="h-4 w-4" />
					<span>Fully encrypted • Your data, your control</span>
				</div>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
			<div class="flex h-10 w-6 justify-center rounded-full border-2 border-base-content/30">
				<div class="mt-2 h-3 w-1 rounded-full bg-base-content/30"></div>
			</div>
		</div>
	</section>

	<!-- Privacy & Security Section -->
	<section id="privacy" class="bg-base-200 py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-4xl">
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body p-8 sm:p-12">
						<div class="mb-6 flex items-start gap-4">
							<div class="rounded-lg bg-primary/10 p-3">
								<Lock class="h-8 w-8 text-primary" />
							</div>
							<div class="flex-1">
								<h2 class="mb-4 text-3xl font-bold text-base-content">
									Your Privacy is Our Priority
								</h2>
								<div class="space-y-4 text-lg leading-relaxed text-base-content/80">
									<p>
										All sensitive story data is <strong class="text-base-content"
											>fully encrypted</strong
										> in our database. Your intimate stories remain private and secure.
									</p>
									<p>
										You have complete control: delete your stories at any time, or <strong
											class="text-base-content">export a backup</strong
										> to keep them safe on your own device.
									</p>
									<div class="flex items-center gap-2 pt-2">
										<Download class="h-5 w-5 text-primary" />
										<span>Export your data anytime • No questions asked</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="bg-base-100 py-24">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-4xl font-bold text-base-content sm:text-5xl">
					Create Immersive Stories
				</h2>
				<p class="mx-auto max-w-2xl text-xl text-base-content/70">
					Experience deep, engaging narratives powered by advanced AI technology. Bring any
					character you can imagine to life in vivid, compelling stories.
				</p>
			</div>

			<div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
				<!-- Characters Feature -->
				<div class="card bg-base-200 shadow-lg transition-shadow hover:shadow-xl">
					<div class="card-body p-8">
						<div class="mb-4 w-fit rounded-lg bg-primary/10 p-4">
							<Users class="h-8 w-8 text-primary" />
						</div>
						<h3 class="mb-3 text-2xl font-bold text-base-content">Any Character You Imagine</h3>
						<p class="text-lg leading-relaxed text-base-content/70">
							Create and interact with any character you can imagine. Rich personalities and
							compelling traits bring your stories to life with authentic, engaging interactions.
						</p>
					</div>
				</div>

				<!-- Events Feature -->
				<div class="card bg-base-200 shadow-lg transition-shadow hover:shadow-xl">
					<div class="card-body p-8">
						<div class="mb-4 w-fit rounded-lg bg-secondary/10 p-4">
							<Calendar class="h-8 w-8 text-secondary" />
						</div>
						<h3 class="mb-3 text-2xl font-bold text-base-content">Engaging Narratives</h3>
						<p class="text-lg leading-relaxed text-base-content/70">
							Experience deep, engaging narratives crafted with advanced AI. Every moment is
							designed to immerse you in vivid, compelling stories that feel completely real.
						</p>
					</div>
				</div>

				<!-- Stories Feature -->
				<div class="card bg-base-200 shadow-lg transition-shadow hover:shadow-xl">
					<div class="card-body p-8">
						<div class="mb-4 w-fit rounded-lg bg-accent/10 p-4">
							<BookOpen class="h-8 w-8 text-accent" />
						</div>
						<h3 class="mb-3 text-2xl font-bold text-base-content">Advanced AI Technology</h3>
						<p class="text-lg leading-relaxed text-base-content/70">
							Powered by cutting-edge AI, your stories come alive with rich detail and emotional
							depth. Experience narratives that adapt and evolve based on your imagination.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA Section -->
	<section class="bg-linear-to-br from-primary/10 via-base-100 to-secondary/10 py-24">
		<div class="container mx-auto px-4 text-center sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl space-y-8">
				<div class="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
					<Heart class="h-12 w-12 text-primary" />
				</div>
				<h2 class="text-4xl font-bold text-base-content sm:text-5xl">Ready to Begin Your Story?</h2>
				<p class="text-xl text-base-content/70">
					Start creating immersive stories with any character you can imagine. Experience deep,
					engaging narratives powered by advanced AI technology.
				</p>
				<div class="pt-4">
					<a href="/app/auth" class="btn px-12 text-lg btn-lg btn-primary"> Get Started Free </a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}
</style>
