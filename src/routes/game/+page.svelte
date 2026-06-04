<script lang="ts">
  import { goto } from "$app/navigation";
  import { getCurrentUserId, getGameHighScores } from "$lib/stores/users";

  let highScores = $state({ left: 0, right: 0, both: 0, letters: 0, all: 0 });

  function selectMode(mode: "left" | "right" | "both" | "letters" | "all") {
    goto(`/game/${mode}`);
  }

  $effect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      highScores = getGameHighScores(userId);
    }
  });
</script>

<svelte:head>
  <title>Game Typing - Ketik 10 Jari</title>
</svelte:head>
<div class="game-select-page">
  <div class="container">
    <header class="header">
      <h1 class="title">🎮 Game Typing Seru!</h1>
      <p class="subtitle">Pilih mode latihan yang ingin kamu mainkan</p>
    </header>

    <div class="mode-grid">
      <button class="mode-card mode-left" onclick={() => selectMode("left")}>
        <div class="mode-icon">👈</div>
        <h2 class="mode-title">Home Row Kiri</h2>
        <p class="mode-desc">Latih jari tangan kiri</p>
        <div class="mode-keys">A S D F</div>
        <div class="mode-difficulty">Mudah</div>
        {#if highScores.left > 0}
          <div class="mode-high-score">🏆 {highScores.left}</div>
        {/if}
      </button>

      <button class="mode-card mode-right" onclick={() => selectMode("right")}>
        <div class="mode-icon">👉</div>
        <h2 class="mode-title">Home Row Kanan</h2>
        <p class="mode-desc">Latih jari tangan kanan</p>
        <div class="mode-keys">J K L ;</div>
        <div class="mode-difficulty">Mudah</div>
        {#if highScores.right > 0}
          <div class="mode-high-score">🏆 {highScores.right}</div>
        {/if}
      </button>

      <button class="mode-card mode-both" onclick={() => selectMode("both")}>
        <div class="mode-icon">🎯</div>
        <h2 class="mode-title">Home Row Lengkap</h2>
        <p class="mode-desc">Latih kedua tangan sekaligus</p>
        <div class="mode-keys">A S D F J K L ;</div>
        <div class="mode-difficulty">Sedang</div>
        {#if highScores.both > 0}
          <div class="mode-high-score">🏆 {highScores.both}</div>
        {/if}
      </button>

      <button class="mode-card mode-letters" onclick={() => selectMode("letters")}>
        <div class="mode-icon">🔤</div>
        <h2 class="mode-title">Semua Huruf</h2>
        <p class="mode-desc">Latih semua huruf A-Z</p>
        <div class="mode-keys">A-Z</div>
        <div class="mode-difficulty">Sedang</div>
        {#if highScores.letters > 0}
          <div class="mode-high-score">🏆 {highScores.letters}</div>
        {/if}
      </button>

      <button class="mode-card mode-all" onclick={() => selectMode("all")}>
        <div class="mode-icon">🚀</div>
        <h2 class="mode-title">Semua Huruf & Karakter</h2>
        <p class="mode-desc">Tantang dirimu dengan semua tombol</p>
        <div class="mode-keys">A-Z `-=[]\;',./</div>
        <div class="mode-difficulty">Sulit</div>
        {#if highScores.all > 0}
          <div class="mode-high-score">🏆 {highScores.all}</div>
        {/if}
      </button>
    </div>

    <div class="instructions">
      <h3>Cara Bermain:</h3>
      <ul>
        <li>Huruf akan melayang dari bawah ke atas</li>
        <li>Ketik huruf sebelum menyentuh garis atas</li>
        <li>Setiap 100 poin, kecepatan meningkat</li>
        <li>Kamu punya 5 nyawa, jangan sampai habis!</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .game-select-page {
    /* min-height: 100vh; */
    /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); */
    color: white;
    padding: 2rem;
  }

  .container {
    max-width: 1200px;
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

  .mode-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .mode-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
  }

  .mode-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  .mode-left:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
  }

  .mode-right:hover {
    background: rgba(236, 72, 153, 0.2);
    border-color: #ec4899;
  }

  .mode-both:hover {
    background: rgba(74, 222, 128, 0.2);
    border-color: #4ade80;
  }

  .mode-letters:hover {
    background: rgba(251, 191, 36, 0.2);
    border-color: #fbbf24;
  }

  .mode-all:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: #a855f7;
  }

  .mode-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .mode-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .mode-desc {
    color: #94a3b8;
    margin: 0 0 1.5rem 0;
  }

  .mode-keys {
    font-family: "Courier New", monospace;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.5rem;
    color: #fbbf24;
    margin-bottom: 1rem;
  }

  .mode-difficulty {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(251, 191, 36, 0.2);
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fbbf24;
  }

  .mode-high-score {
    margin-top: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: #4ade80;
  }

  .instructions {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
  }

  .instructions h3 {
    margin: 0 0 1rem 0;
    color: #fbbf24;
  }

  .instructions ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .instructions li {
    color: #cbd5e1;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 2rem;
    }

    .mode-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
