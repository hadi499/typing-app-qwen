<script lang="ts">
  const sequence = "asdf jkl;";
  let currentIndex = $state(0);
  let errors = $state(new Set<number>());

  function reset() {
    currentIndex = 0;
    errors = new Set<number>();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Tab" || e.key === "Escape") return;
    e.preventDefault();

    const key = e.key;
    const expected = sequence[currentIndex];

    if (key !== expected) {
      errors.add(currentIndex);
    }

    currentIndex++;

    if (currentIndex >= sequence.length) {
      reset();
    }
  }

  function getCharClass(index: number): string {
    if (index < currentIndex) return errors.has(index) ? "char-error" : "char-correct";
    if (index === currentIndex) return "char-current";
    return "char-pending";
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="quick-practice">
  <div class="quick-header">
    <h3>Latihan Dasar</h3>
  </div>

  <div class="typing-display">
    {#each sequence as char, i}
      <span class="char {getCharClass(i)}">{char === " " ? "␣" : char}</span>
    {/each}
  </div>

  <p class="quick-hint">Ketik huruf di atas secara berurutan. Otomatis berulang!</p>
</div>

<style>
  .quick-practice {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
  }

  .quick-header {
    margin-bottom: 16px;
  }

  .quick-header h3 {
    margin: 0;
    font-size: 18px;
    color: #fbbf24;
  }

  .typing-display {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 20px;
    font-family: "Courier New", monospace;
    font-size: clamp(28px, 5vh, 40px);
    line-height: 1.5;
    letter-spacing: 8px;
    text-align: center;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  .char {
    transition: all 0.1s;
    border-radius: 4px;
    padding: 2px 4px;
  }

  .char-current {
    background: rgba(251, 191, 36, 0.3);
    border-bottom: 3px solid #fbbf24;
    animation: blink 1s ease infinite;
  }

  .char-correct {
    color: #4ade80;
  }

  .char-error {
    color: #f87171;
    background: rgba(248, 113, 113, 0.2);
  }

  .char-pending {
    color: #9bb8df;
  }

  .quick-hint {
    color: #64748b;
    font-size: 13px;
    margin: 12px 0 0 0;
    text-align: center;
  }

  @keyframes blink {
    0%, 100% { border-bottom-color: #fbbf24; }
    50% { border-bottom-color: transparent; }
  }
</style>
