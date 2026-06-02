<script lang="ts">
	import { goto } from '$app/navigation';
	import { 
		getUsers, 
		createUser, 
		deleteUser, 
		setCurrentUserId,
		getGameHighScores
	} from '$lib/stores/users';
	import type { UserProfile } from '$lib/stores/users';

	let users = $state<UserProfile[]>([]);
	let showCreateForm = $state(false);
	let newUserName = $state('');
	let selectedAvatar = $state('');

	const avatarOptions = ['🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🐰', '🐱', '🐶', '🦄', '🐲'];

	function loadUsers() {
		users = getUsers();
	}

	function handleSelectUser(userId: string) {
		setCurrentUserId(userId);
		goto('/');
	}

	function handleCreateUser() {
		if (!newUserName.trim()) return;
		
		const avatar = selectedAvatar || avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
		const newUser = createUser(newUserName.trim(), avatar);
		
		newUserName = '';
		selectedAvatar = '';
		showCreateForm = false;
		loadUsers();
		
		// Auto select new user
		handleSelectUser(newUser.id);
	}

	function handleDeleteUser(userId: string, userName: string) {
		if (confirm(`Yakin mau hapus user "${userName}"? Semua progress akan hilang.`)) {
			deleteUser(userId);
			loadUsers();
		}
	}

	function cancelCreate() {
		showCreateForm = false;
		newUserName = '';
		selectedAvatar = '';
	}

	$effect(() => {
		loadUsers();
	});
</script>

<svelte:head>
	<title>Pilih User - Ketik 10 Jari</title>
</svelte:head>

<div class="user-select-page">
	<div class="container">
		<header class="header">
			<h1 class="title">⌨️ Ketik 10 Jari</h1>
			<p class="subtitle">Pilih profil untuk mulai belajar</p>
		</header>

		{#if showCreateForm}
			<div class="create-form">
				<h2>Buat Profil Baru</h2>
				
				<div class="form-group">
					<label for="username">Nama</label>
					<input 
						type="text" 
						id="username"
						bind:value={newUserName}
						placeholder="Masukkan nama..."
						maxlength="20"
						onkeydown={(e) => e.key === 'Enter' && handleCreateUser()}
					/>
				</div>

				<div class="form-group">
					<label id="avatar-label">Pilih Avatar</label>
					<div class="avatar-grid" role="radiogroup" aria-labelledby="avatar-label">
						{#each avatarOptions as avatar}
							<button
								class="avatar-option"
								class:selected={selectedAvatar === avatar}
								onclick={() => selectedAvatar = avatar}
								aria-label={`Avatar ${avatar}`}
								role="radio"
								aria-checked={selectedAvatar === avatar}
							>
								{avatar}
							</button>
						{/each}
					</div>
				</div>

				<div class="form-actions">
					<button class="btn btn-secondary" onclick={cancelCreate}>
						Batal
					</button>
					<button 
						class="btn btn-primary" 
						onclick={handleCreateUser}
						disabled={!newUserName.trim()}
					>
						Buat Profil
					</button>
				</div>
			</div>
		{:else}
	<div class="users-grid">
		{#each users as user}
			{@const highScores = getGameHighScores(user.id)}
			<div class="user-card">
				<button class="user-select" onclick={() => handleSelectUser(user.id)}>
					<div class="user-avatar">{user.avatar}</div>
					<div class="user-info">
						<h3 class="user-name">{user.name}</h3>
						<div class="user-stats">
							<span class="stat">🎮 {Math.max(highScores.left, highScores.right, highScores.both, highScores.all)}</span>
						</div>
					</div>
				</button>
						<button 
							class="delete-btn"
							onclick={() => handleDeleteUser(user.id, user.name)}
							title="Hapus user"
						>
							🗑️
						</button>
					</div>
				{/each}

				<button class="add-user-card" onclick={() => showCreateForm = true}>
					<div class="add-icon">➕</div>
					<span>Tambah User Baru</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.user-select-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
		color: white;
		padding: 2rem;
	}

	.container {
		max-width: 900px;
		margin: 0 auto;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.title {
		font-size: 3rem;
		font-weight: 800;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #94a3b8;
		margin: 0;
	}

	.users-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.user-card {
		position: relative;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s;
	}

	.user-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
		border-color: rgba(251, 191, 36, 0.3);
	}

	.user-select {
		width: 100%;
		padding: 1.5rem;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.user-avatar {
		font-size: 4rem;
		line-height: 1;
	}

	.user-info {
		text-align: center;
		width: 100%;
	}

	.user-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
	}

	.user-stats {
		display: flex;
		justify-content: center;
		gap: 1rem;
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.delete-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: rgba(239, 68, 68, 0.2);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 8px;
		padding: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		opacity: 0;
	}

	.user-card:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: rgba(239, 68, 68, 0.4);
		border-color: rgba(239, 68, 68, 0.6);
	}

	.add-user-card {
		background: rgba(255, 255, 255, 0.05);
		border: 2px dashed rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		cursor: pointer;
		color: #94a3b8;
		transition: all 0.3s;
		min-height: 200px;
	}

	.add-user-card:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(251, 191, 36, 0.5);
		color: #fbbf24;
	}

	.add-icon {
		font-size: 3rem;
	}

	.create-form {
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
		max-width: 500px;
		margin: 0 auto;
	}

	.create-form h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
		text-align: center;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: #94a3b8;
		margin-bottom: 0.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: rgba(0, 0, 0, 0.3);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: white;
		font-size: 1rem;
	}

	.form-group input:focus {
		outline: none;
		border-color: #fbbf24;
	}

	.avatar-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.5rem;
	}

	.avatar-option {
		aspect-ratio: 1;
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		font-size: 2rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.avatar-option:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(251, 191, 36, 0.5);
	}

	.avatar-option.selected {
		background: rgba(251, 191, 36, 0.2);
		border-color: #fbbf24;
		transform: scale(1.1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn {
		flex: 1;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		color: #1e293b;
	}

	.btn-primary:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 2px solid rgba(255, 255, 255, 0.2);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 768px) {
		.title {
			font-size: 2rem;
		}

		.users-grid {
			grid-template-columns: 1fr;
		}

		.avatar-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
