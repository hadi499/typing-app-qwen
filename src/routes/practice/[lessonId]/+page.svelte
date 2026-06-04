<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import {
    getLesson,
    lessons,
    KEY_MAP,
    FINGER_COLORS,
  } from "$lib/data/lessons";
  import { saveLessonProgress, calculateStars } from "$lib/stores/progress";
  import type { TypingStats } from "$lib/types";
  import Keyboard from "$lib/components/Keyboard.svelte";
  import TypingArea from "$lib/components/TypingArea.svelte";
  import ResultModal from "$lib/components/ResultModal.svelte";
  import Navbar from "$lib/components/Navbar.svelte";

  // Safe parameter extraction with validation
  const lessonId = $derived.by(() => {
    const param = page.params?.lessonId;
    const id = Number(param);
    return isNaN(id) ? 1 : id; // default to lesson 1 if invalid
  });
  const lesson = $derived(getLesson(lessonId));

  let mode = $state<"words" | "sentences">("words");
  let text = $state("");
  let currentIndex = $state(0);
  let errors = $state(new Set<number>());
  let startTime = $state<number | null>(null);
  let elapsed = $state(0);
  let finished = $state(false);
  let pressedKey = $state("");
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  const activeKey = $derived(currentIndex < text.length ? text[currentIndex].toLowerCase() : "");

  let stats: TypingStats = $state({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    totalChars: 0,
    errors: 0,
    time: 0,
  });

  let resultStars = $state(0);
  let hasNext = $derived(lessons.some((l) => l.id === lessonId + 1));

  function generateText(): string {
    if (!lesson) return "";
    if (mode === "words") {
      const words: string[] = [];
      for (let i = 0; i < 15; i++) {
        words.push(
          lesson.words[Math.floor(Math.random() * lesson.words.length)],
        );
      }
      return words.join(" ");
    } else {
      const sentences: string[] = [];
      for (let i = 0; i < 3; i++) {
        sentences.push(
          lesson.sentences[Math.floor(Math.random() * lesson.sentences.length)],
        );
      }
      return sentences.join(" ");
    }
  }

  function startLesson() {
    text = generateText();
    currentIndex = 0;
    errors = new Set<number>();
    startTime = null;
    elapsed = 0;
    finished = false;
    resultStars = 0;
    stats = {
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      time: 0,
    };
    if (timerInterval) clearInterval(timerInterval);
  }

  function updateStats() {
    if (!startTime) return;
    const now = Date.now();
    elapsed = Math.floor((now - startTime) / 1000);
    const minutes = elapsed / 60;
    const wordsTyped = currentIndex / 5;
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
    const accuracy =
      stats.totalChars > 0
        ? Math.round((stats.correctChars / stats.totalChars) * 100)
        : 100;
    stats = { ...stats, wpm, accuracy, time: elapsed };
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (finished) return;

    const key = e.key;
    pressedKey = key.toLowerCase();
    setTimeout(() => {
      pressedKey = "";
    }, 150);

    if (key === "Escape") {
      startLesson();
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex--;
        errors.delete(currentIndex);
      }
      return;
    }

    if (key.length !== 1) return;
    e.preventDefault();

    if (!startTime) {
      startTime = Date.now();
      timerInterval = setInterval(updateStats, 500);
    }

    const expected = text[currentIndex];
    const isCorrect = key.toLowerCase() === expected.toLowerCase();

    stats.totalChars++;
    if (isCorrect) {
      stats.correctChars++;
    } else {
      errors = new Set([...errors, currentIndex]);
      stats.errors++;
    }

    currentIndex++;

    updateStats();

    if (currentIndex >= text.length) {
      finishLesson();
    }
  }

  function finishLesson() {
    finished = true;
    if (timerInterval) clearInterval(timerInterval);
    updateStats();

    resultStars = calculateStars(stats.wpm, stats.accuracy);

    saveLessonProgress({
      lessonId,
      bestWPM: stats.wpm,
      bestAccuracy: stats.accuracy,
      completed: true,
      stars: resultStars,
      attempts: 0,
    });
  }

  function handleRetry() {
    startLesson();
  }

  function handleNext() {
    const nextLesson = lessons.find((l) => l.id === lessonId + 1);
    if (nextLesson) {
      goto(`/practice/${nextLesson.id}`);
    }
  }

  function switchMode(newMode: "words" | "sentences") {
    mode = newMode;
    startLesson();
  }

  $effect(() => {
    if (lesson) {
      startLesson();
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  const highlightKeys = $derived(lesson?.keys ?? []);
</script>

<svelte:head>
  <title>{lesson?.title ?? "Latihan"} - Ketik 10 Jari</title>
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

{#if lesson}
  <div class="practice-page">
    <header class="practice-header">
      <div class="lesson-info">
        <span class="lesson-icon">{lesson.icon}</span>
        <h1>{lesson.title}</h1>
      </div>
      <div class="mode-toggle">
        <button
          class="mode-btn"
          class:active={mode === "words"}
          onclick={() => switchMode("words")}
        >
          Kata
        </button>
        <button
          class="mode-btn"
          class:active={mode === "sentences"}
          onclick={() => switchMode("sentences")}
        >
          Kalimat
        </button>
      </div>
    </header>

    <main class="practice-main">
      <TypingArea {text} {currentIndex} {errors} />

      <div class="keyboard-section">
        <Keyboard {activeKey} {pressedKey} {highlightKeys} />

        {#if lesson.keys.length > 0}
          <div class="finger-guide">
            <p class="guide-title">Jari untuk latihan ini:</p>
            <div class="guide-keys">
              {#each lesson.keys as key}
                {@const info = KEY_MAP[key]}
                {#if info}
                  <span
                    class="guide-key"
                    style="--color: {FINGER_COLORS[info.finger]}"
                  >
                    {key.toUpperCase()}
                  </span>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="shortcuts">
        <span><kbd>Esc</kbd> Ulangi</span>
        <span><kbd>Backspace</kbd> Hapus</span>
      </div>
    </main>

    <ResultModal
      show={finished}
      wpm={stats.wpm}
      accuracy={stats.accuracy}
      stars={resultStars}
      onRetry={handleRetry}
      onNext={handleNext}
      {hasNext}
    />
  </div>
{:else}
  <div class="not-found">
    <h1>Lesson tidak ditemukan</h1>
    <a href="/">Kembali ke Menu</a>
  </div>
{/if}

<style>
  .practice-page {
    /* min-height: 100vh; */
    /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); */
    color: white;
    display: flex;
    flex-direction: column;
  }

  .practice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    padding: 16px 32px;
    /* background: rgba(0, 0, 0, 0.3); */
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.1); */
  }

  .lesson-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lesson-info h1 {
    font-size: 20px;
    margin: 0;
  }

  .lesson-icon {
    font-size: 28px;
  }

  .mode-toggle {
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px;
    border-radius: 10px;
  }

  .mode-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: #94a3b8;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
  }

  .mode-btn.active {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .practice-main {
    flex: 1;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .keyboard-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .finger-guide {
    text-align: center;
  }

  .guide-title {
    font-size: 13px;
    color: #94a3b8;
    margin: 0 0 8px 0;
  }

  .guide-keys {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .guide-key {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    background: color-mix(in srgb, var(--color) 20%, transparent);
    border: 2px solid var(--color);
    color: white;
  }

  .shortcuts {
    display: flex;
    gap: 24px;
    justify-content: center;
    color: #64748b;
    font-size: 13px;
  }

  .shortcuts kbd {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-right: 4px;
  }

  .not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background: #0f172a;
    color: white;
  }

  .not-found a {
    color: #fbbf24;
  }

  @media (max-width: 768px) {
    .practice-header {
      flex-direction: column;
      gap: 12px;
      padding: 12px 16px;
    }

    .practice-main {
      padding: 16px;
      gap: 16px;
    }
  }
</style>
