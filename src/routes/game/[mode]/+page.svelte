<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    getCurrentUserId,
    saveGameHighScore,
    getGameHighScores,
  } from "$lib/stores/users";

  type GameMode = "left" | "right" | "both" | "all";

  const validModes: GameMode[] = ["left", "right", "both", "all"];

  // Safe parameter extraction - params sudah di-decode oleh SvelteKit
  const mode = $derived.by(() => {
    const param = page.params?.mode;
    if (!param || typeof param !== "string") {
      return "left";
    }
    // Validasi tanpa decode lagi (sudah di-decode oleh SvelteKit)
    if (!validModes.includes(param as GameMode)) {
      return "left";
    }
    return param as GameMode;
  });

  let gameState = $state<"ready" | "playing" | "paused" | "gameover">("ready");
  let score = $state(0);
  let lives = $state(5);
  let level = $state(1);
  let letters = $state<
    { id: number; char: string; x: number; y: number; speed: number }[]
  >([]);
  let nextLetterId = $state(0);
  let spawnInterval: ReturnType<typeof setInterval> | null = null;
  let animationFrame: number | null = null;
  let lastTime = $state(0);

  const keyMap = {
    left: ["a", "s", "d", "f"],
    right: ["j", "k", "l", ";"],
    both: ["a", "s", "d", "f", "j", "k", "l", ";"],
    all: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "_",
      "+",
      "-",
      "=",
      "[",
      "]",
      "{",
      "}",
      "|",
      ";",
      ":",
      "'",
      '"',
      ",",
      ".",
      "<",
      ">",
      "/",
      "?",
      "`",
      "~",
    ],
  };

  const allKeysDisplay = "A-Z !@#$%&*()_+-=[]{}|;:'\",.<>/?`~";

  function getModeTitle(m: GameMode): string {
    const titles = {
      left: "Home Row Kiri",
      right: "Home Row Kanan",
      both: "Home Row Lengkap",
      all: "Semua Huruf & Karakter",
    };
    return titles[m];
  }

  function getSpawnInterval(): number {
    const baseInterval = 2000;
    const reduction = Math.floor(score / 100) * 150;
    return Math.max(600, baseInterval - reduction);
  }

  function getSpeedMultiplier(): number {
    return 1 + Math.floor(score / 100) * 0.15;
  }

  function spawnLetter() {
    const keys = keyMap[mode];
    const spawnCount = level >= 3 ? 2 : 1;
    const positions: number[] = [];
    const minDistance = 15; // Jarak minimal 15% lebar layar

    for (let i = 0; i < spawnCount; i++) {
      const char = keys[Math.floor(Math.random() * keys.length)];
      const baseSpeed = 0.3 + Math.random() * 0.2;
      const speed = baseSpeed * getSpeedMultiplier();

      // Generate posisi x yang tidak bertumpuk
      let x: number;
      let attempts = 0;
      do {
        x = 10 + Math.random() * 80;
        attempts++;
      } while (
        positions.some((pos) => Math.abs(pos - x) < minDistance) &&
        attempts < 10
      );

      positions.push(x);
      letters = [...letters, { id: nextLetterId++, char, x, y: 100, speed }];
    }
  }

  function startGame() {
    score = 0;
    lives = 5;
    level = 1;
    letters = [];
    nextLetterId = 0;
    gameState = "playing";
    lastTime = performance.now();

    spawnInterval = setInterval(spawnLetter, getSpawnInterval());
    animationFrame = requestAnimationFrame(gameLoop);
  }

  function gameLoop(currentTime: number) {
    if (gameState !== "playing") return;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel !== level) {
      level = newLevel;
      if (spawnInterval) clearInterval(spawnInterval);
      spawnInterval = setInterval(spawnLetter, getSpawnInterval());
    }

    letters = letters
      .map((l) => ({ ...l, y: l.y - l.speed * (deltaTime / 16) }))
      .filter((l) => {
        if (l.y < -5) {
          lives--;
          if (lives <= 0) {
            endGame();
          }
          return false;
        }
        return true;
      });

    animationFrame = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameState = "gameover";
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    // Simpan high score untuk user saat ini
    const userId = getCurrentUserId();
    if (userId) {
      saveGameHighScore(userId, mode, score);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (gameState !== "playing") return;

    const key = e.key;
    const validKeys = keyMap[mode];

    // Untuk huruf, bandingkan case-insensitive
    // Untuk karakter khusus, bandingkan case-sensitive
    const keyToCheck =
      key.length === 1 && /[a-zA-Z]/.test(key) ? key.toLowerCase() : key;

    if (!validKeys.includes(keyToCheck)) return;

    const index = letters.findIndex((l) => l.char === keyToCheck);
    if (index !== -1) {
      letters = letters.filter((_, i) => i !== index);
      score += 10;
    }
  }

  function cleanup() {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  onMount(() => {
    if (!validModes.includes(mode)) {
      goto("/game");
      return;
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      cleanup();
    };
  });
</script>

<svelte:head>
  <title>{getModeTitle(mode)} - Game Typing</title>
</svelte:head>

<div class="game-page">
  <header class="game-header">
    <h1 class="game-title">{getModeTitle(mode)}</h1>
    <div class="game-stats">
      <div class="stat">
        <span class="stat-label">Skor</span>
        <span class="stat-value">{score}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Level</span>
        <span class="stat-value">{level}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Nyawa</span>
        <span class="stat-value">{"❤️".repeat(lives)}</span>
      </div>
    </div>
  </header>

  <main class="game-main">
    <div class="game-area">
      {#if gameState === "ready"}
        <div class="game-overlay">
          <div class="overlay-content">
            <h2>Siap Bermain?</h2>
            <p>Ketik huruf yang melayang sebelum menyentuh garis atas!</p>
            <div class="key-hint">
              <p>Huruf yang akan muncul:</p>
              {#if mode === "all"}
                <div class="keys keys-all">{allKeysDisplay}</div>
              {:else}
                <div class="keys">
                  {keyMap[mode].map((k) => k.toUpperCase()).join(" ")}
                </div>
              {/if}
            </div>
            <button class="start-btn" onclick={startGame}>Mulai Game</button>
          </div>
        </div>
      {:else if gameState === "gameover"}
        <div class="game-overlay">
          <div class="overlay-content">
            <h2>Game Over!</h2>
            <div class="final-score">
              <div class="score-label">Skor Akhir</div>
              <div class="score-value">{score}</div>
              <div class="score-level">Level {level}</div>
              {#if getCurrentUserId()}
                {@const highScores = getGameHighScores(getCurrentUserId()!)}
                <div class="high-score">
                  <span class="high-score-label">High Score:</span>
                  <span class="high-score-value">{highScores[mode]}</span>
                </div>
              {/if}
            </div>
            <div class="game-actions">
              <button class="retry-btn" onclick={startGame}>Main Lagi</button>
              <a href="/game" class="back-btn">Pilih Mode Lain</a>
            </div>
          </div>
        </div>
      {/if}

      <div class="target-line"></div>
      {#each letters as letter (letter.id)}
        <div class="letter" style="left: {letter.x}%; top: {letter.y}%">
          {letter.char.toUpperCase()}
        </div>
      {/each}
    </div>
  </main>
</div>

<style>
  .game-page {
    /* height: 100vh; */
    /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); */
    color: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .game-header {
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .game-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    flex: 1;
    text-align: center;
  }

  .game-stats {
    display: flex;
    gap: 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fbbf24;
  }

  .game-main {
    flex: 1;
    position: relative;
    max-width: 900px;
    width: 100%;
    margin: 1rem auto;
    padding: 0 2rem;
  }

  .game-area {
    position: relative;
    width: 100%;
    height: 500px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
  }

  .target-line {
    position: absolute;
    top: 5%;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ef4444, #f97316, #eab308);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  }

  .letter {
    position: absolute;
    font-size: 3rem;
    font-weight: 900;
    color: #fbbf24;
    text-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
    transform: translate(-50%, -50%);
    user-select: none;
    pointer-events: none;
  }

  .game-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 16px;
  }

  .overlay-content {
    text-align: center;
    max-width: 400px;
  }

  .overlay-content h2 {
    font-size: 1.75rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .overlay-content p {
    color: #cbd5e1;
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
  }

  .key-hint {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .key-hint p {
    margin: 0 0 0.5rem 0;
    font-size: 0.75rem;
  }

  .keys {
    font-family: "Courier New", monospace;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.5rem;
    color: #fbbf24;
  }

  .keys-all {
    font-size: 0.875rem;
    letter-spacing: 0.15rem;
    line-height: 1.4;
  }

  .start-btn,
  .retry-btn {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #1e293b;
    border: none;
    border-radius: 8px;
    padding: 0.625rem 2rem;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .start-btn:hover,
  .retry-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
  }

  .final-score {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .score-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }

  .score-value {
    font-size: 2.5rem;
    font-weight: 900;
    color: #fbbf24;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .score-level {
    font-size: 0.875rem;
    color: #cbd5e1;
  }

  .high-score {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .high-score-label {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .high-score-value {
    font-size: 1rem;
    font-weight: 700;
    color: #4ade80;
  }

  .game-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .back-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    .game-header {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    }

    .game-stats {
      gap: 1rem;
    }

    .game-main {
      padding: 0 1rem;
      margin: 0.5rem auto;
    }

    .game-area {
      height: 280px;
    }

    .letter {
      font-size: 2rem;
    }

    .overlay-content h2 {
      font-size: 1.5rem;
    }

    .keys {
      font-size: 1rem;
      letter-spacing: 0.25rem;
    }

    .score-value {
      font-size: 2rem;
    }

    .game-actions {
      flex-direction: column;
    }
  }
</style>
