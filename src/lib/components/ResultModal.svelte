<script lang="ts">
	let { show, wpm, accuracy, stars, onRetry, onNext, hasNext }: {
		show: boolean;
		wpm: number;
		accuracy: number;
		stars: number;
		onRetry: () => void;
		onNext: () => void;
		hasNext: boolean;
	} = $props();

	function getMessage(): string {
		if (stars === 3) return 'LUAR BIASA! 🎉';
		if (stars === 2) return 'Hebat! 👏';
		if (stars === 1) return 'Bagus! Terus latihan! 💪';
		return 'Coba lagi ya! 😊';
	}

	function getStarLabel(): string {
		if (stars === 3) return 'Sempurna!';
		if (stars === 2) return 'Keren!';
		if (stars === 1) return 'Lumayan!';
		return 'Latihan lagi!';
	}
</script>

{#if show}
	<div class="overlay" role="dialog" aria-modal="true">
		<div class="modal">
			<h2 class="modal-title">{getMessage()}</h2>

			<div class="star-display">
				{#each Array(3) as _, i}
					<span class="big-star" class:filled={i < stars} style="animation-delay: {i * 0.2}s">
						{i < stars ? '⭐' : '☆'}
					</span>
				{/each}
			</div>
			<p class="star-label">{getStarLabel()}</p>

			<div class="result-stats">
				<div class="result-item">
					<span class="result-value">{wpm}</span>
					<span class="result-label">WPM</span>
				</div>
				<div class="result-item">
					<span class="result-value">{accuracy}%</span>
					<span class="result-label">Akurasi</span>
				</div>
			</div>

			<div class="modal-actions">
				<button class="btn btn-retry" onclick={onRetry}>
					🔄 Ulangi
				</button>
				{#if hasNext && stars > 0}
					<button class="btn btn-next" onclick={onNext}>
						Lanjut ➡️
					</button>
				{/if}
			</div>

			<a href="/" class="back-link">← Kembali ke Menu</a>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		backdrop-filter: blur(8px);
		animation: fadeIn 0.3s ease;
	}

	.modal {
		background: linear-gradient(135deg, #1e293b, #0f172a);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		padding: 40px;
		text-align: center;
		max-width: 420px;
		width: 90%;
		animation: slideUp 0.4s ease;
	}

	.modal-title {
		font-size: 28px;
		font-weight: 800;
		margin: 0 0 20px 0;
		color: white;
	}

	.star-display {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-bottom: 8px;
	}

	.big-star {
		font-size: 48px;
		opacity: 0.3;
		transition: all 0.3s ease;
	}

	.big-star.filled {
		opacity: 1;
		animation: starPop 0.5s ease forwards;
	}

	.star-label {
		font-size: 16px;
		color: #fbbf24;
		font-weight: 600;
		margin: 0 0 24px 0;
	}

	.result-stats {
		display: flex;
		gap: 24px;
		justify-content: center;
		margin-bottom: 32px;
	}

	.result-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: rgba(255, 255, 255, 0.05);
		padding: 16px 24px;
		border-radius: 12px;
	}

	.result-value {
		font-size: 32px;
		font-weight: 800;
		color: #fbbf24;
	}

	.result-label {
		font-size: 12px;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.modal-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		margin-bottom: 16px;
	}

	.btn {
		padding: 12px 28px;
		border-radius: 12px;
		border: none;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-retry {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.btn-retry:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.btn-next {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: #1e293b;
	}

	.btn-next:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
	}

	.back-link {
		color: #94a3b8;
		font-size: 14px;
		text-decoration: none;
		display: inline-block;
		margin-top: 8px;
	}

	.back-link:hover {
		color: white;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { transform: translateY(40px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	@keyframes starPop {
		0% { transform: scale(0); }
		50% { transform: scale(1.3); }
		100% { transform: scale(1); }
	}
</style>
