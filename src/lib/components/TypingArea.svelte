<script lang="ts">
  let {
    text,
    currentIndex,
    errors,
  }: {
    text: string;
    currentIndex: number;
    errors: Set<number>;
  } = $props();

  function getCharClass(index: number): string {
    if (index < currentIndex) {
      return errors.has(index) ? "char-error" : "char-correct";
    }
    if (index === currentIndex) return "char-current";
    return "char-pending";
  }
</script>

<div class="typing-area">
  <div class="text-display">
    {#each text as char, i}
      <span class="char {getCharClass(i)}">{char === " " ? "␣" : char}</span>
    {/each}
  </div>
</div>

<style>
  .typing-area {
    width: 100%;
  }

  .text-display {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding: 24px;
    font-family: "Courier New", monospace;
    font-size: 30px;
    line-height: 2;
    letter-spacing: 2px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    min-height: 120px;
    word-break: break-all;
  }

  .char {
    transition: all 0.1s ease;
    border-radius: 4px;
    padding: 2px 1px;
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

  @keyframes blink {
    0%,
    100% {
      border-bottom-color: #fbbf24;
    }
    50% {
      border-bottom-color: transparent;
    }
  }

  @media (max-width: 768px) {
    .text-display {
      font-size: 20px;
      padding: 16px;
    }
  }
</style>
