<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getCurrentUserId, getUsers, clearCurrentUserId } from '$lib/stores/users';

	let currentUserName = $state('');
	let currentUserAvatar = $state('');

	function loadUserData() {
		const userId = getCurrentUserId();
		if (!userId) return;

		const users = getUsers();
		const user = users.find(u => u.id === userId);
		if (user) {
			currentUserName = user.name;
			currentUserAvatar = user.avatar;
		}
	}

	function handleSwitchUser() {
		clearCurrentUserId();
		goto('/select-user');
	}

	function handleHome() {
		goto('/');
	}

	function handleGame() {
		goto('/game');
	}

	$effect(() => {
		loadUserData();
	});

	const currentPath = $derived(page.url?.pathname || '/');
</script>

<nav class="navbar">
	<div class="navbar-content">
		<div class="navbar-left">
			<button class="logo" onclick={handleHome}>
				<span class="logo-icon">⌨️</span>
				<span class="logo-text">Ketik 10 Jari</span>
			</button>
			
			<div class="nav-links">
				<button 
					class="nav-link" 
					class:active={currentPath === '/'}
					onclick={handleHome}
				>
					📚 Pelajaran
				</button>
				<button 
					class="nav-link" 
					class:active={currentPath.startsWith('/game')}
					onclick={handleGame}
				>
					🎮 Game
				</button>
			</div>
		</div>

	<div class="navbar-right">
		<button class="user-profile" onclick={handleSwitchUser} title="Ganti User">
				<span class="user-avatar">{currentUserAvatar}</span>
				<span class="user-name">{currentUserName}</span>
			</button>
		</div>
	</div>
</nav>

<style>
	.navbar {
		background: rgba(0, 0, 0, 0.3);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1rem 2rem;
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(10px);
	}

	.navbar-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}

	.navbar-left {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s;
	}

	.logo:hover {
		transform: scale(1.05);
	}

	.logo-icon {
		font-size: 2rem;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 800;
		background: linear-gradient(135deg, #fbbf24, #f59e0b);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
	}

	.nav-link {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 0.5rem 1rem;
		color: #cbd5e1;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(251, 191, 36, 0.3);
		color: white;
	}

	.nav-link.active {
		background: rgba(251, 191, 36, 0.2);
		border-color: #fbbf24;
		color: #fbbf24;
	}

	.navbar-right {
		display: flex;
		align-items: center;
	}

	.user-profile {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		padding: 0.375rem 0.75rem 0.375rem 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
		color: white;
	}

	.user-profile:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(251, 191, 36, 0.3);
	}

	.user-avatar {
		font-size: 1.5rem;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.navbar {
			padding: 1rem;
		}

		.navbar-content {
			flex-direction: column;
			gap: 1rem;
		}

		.navbar-left {
			flex-direction: column;
			gap: 1rem;
			width: 100%;
		}

		.logo-text {
			font-size: 1.25rem;
		}

		.nav-links {
			width: 100%;
			justify-content: center;
		}

		.navbar-right {
			width: 100%;
			justify-content: center;
		}

		.user-name {
			display: none;
		}
	}
</style>
