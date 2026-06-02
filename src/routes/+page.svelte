<script lang="ts">
  import { getProgress } from "$lib/stores/progress";
  import { lessons } from "$lib/data/lessons";
</script>

<svelte:head>
  <title>Ketik 10 Jari - Belajar Mengetik Seru!</title>
</svelte:head>

<div class="page">
  <main class="main">
    <a href="/practice/basic" class="game-card basic-practice-card">
      <div class="game-card-icon">⌨️</div>
      <div class="game-card-content">
        <h2 class="game-card-title">Latihan Dasar</h2>
        <p class="game-card-desc">
          Latihan posisi jari home row: A S D F J K L ;
        </p>
        <div class="game-card-arrow">→</div>
      </div>
    </a>

    <a href="/game" class="game-card">
      <div class="game-card-icon">🎮</div>
      <div class="game-card-content">
        <h2 class="game-card-title">Game Typing Seru!</h2>
        <p class="game-card-desc">
          Latih kecepatan mengetikmu dengan game yang menyenangkan
        </p>
        <div class="game-card-arrow">→</div>
      </div>
    </a>

    <div class="intro">
      <h2>📚 Pilih Pelajaran</h2>
      <p>Mulai dari home row, lalu naik level satu per satu!</p>
    </div>

    <div class="lessons-grid">
      {#each lessons as lesson, i}
        {@const p = getProgress(lesson.id)}
        {@const prevProgress = i > 0 ? getProgress(lessons[i - 1].id) : null}
        {@const isLocked = lesson.unlockScore > 0 && (!prevProgress || prevProgress.bestAccuracy < 80)}
        <a
          href={isLocked ? undefined : `/practice/${lesson.id}`}
          class="lesson-card"
          class:locked={isLocked}
          class:completed={p.completed}
        >
          <div class="card-icon">{isLocked ? "🔒" : lesson.icon}</div>
          <div class="card-content">
            <h3 class="card-title">{lesson.title}</h3>
            <p class="card-desc">{lesson.description}</p>
            {#if !isLocked}
              <div class="card-footer">
                {#if p.bestWPM > 0}
                  <span class="card-wpm">{p.bestWPM} WPM</span>
                {/if}
                {#if p.bestAccuracy > 0}
                  <span class="card-accuracy">{p.bestAccuracy}%</span>
                {/if}
              </div>
            {:else}
              <p class="card-lock-text">Butuh akurasi 80% di pelajaran sebelumnya</p>
            {/if}
          </div>
        </a>
      {/each}
    </div>

    <div class="tips">
      <h3>💡 Tips Mengetik 10 Jari</h3>
      <ul>
        <li>Letakkan jari di <strong>home row</strong> (ASDF - JKL;)</li>
        <li>Jangan lihat keyboard, lihat layar!</li>
        <li>Mulai pelan, kecepatan datang dengan latihan</li>
        <li>Gunakan jari yang tepat untuk setiap tombol</li>
      </ul>
    </div>
  </main>
</div>

<style>
  .page {
    /* min-height: 100vh; */
    /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); */
    color: white;
  }

  .main {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px;
  }

  .game-card {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 32px;
    background: linear-gradient(
      135deg,
      rgba(251, 191, 36, 0.1),
      rgba(245, 158, 11, 0.1)
    );
    border: 2px solid rgba(251, 191, 36, 0.3);
    border-radius: 24px;
    text-decoration: none;
    color: white;
    transition: all 0.3s;
    margin-bottom: 32px;
  }

  .basic-practice-card {
    background: linear-gradient(
      135deg,
      rgba(74, 222, 128, 0.1),
      rgba(34, 197, 94, 0.1)
    );
    border-color: rgba(74, 222, 128, 0.3);
  }

  .basic-practice-card:hover {
    border-color: rgba(74, 222, 128, 0.5);
    box-shadow: 0 12px 32px rgba(74, 222, 128, 0.3);
  }

  .basic-practice-card .game-card-title {
    background: linear-gradient(135deg, #4ade80, #22c55e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .game-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(251, 191, 36, 0.3);
    border-color: rgba(251, 191, 36, 0.5);
  }

  .game-card-icon {
    font-size: 64px;
    flex-shrink: 0;
  }

  .game-card-content {
    flex: 1;
  }

  .game-card-title {
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .game-card-desc {
    font-size: 16px;
    color: #cbd5e1;
    margin: 0;
  }

  .game-card-arrow {
    font-size: 32px;
    color: #fbbf24;
    transition: transform 0.3s;
  }

  .game-card:hover .game-card-arrow {
    transform: translateX(8px);
  }

  .intro {
    margin-bottom: 24px;
  }

  .intro h2 {
    font-size: 28px;
    margin: 0 0 8px 0;
  }

  .intro p {
    color: #94a3b8;
    margin: 0;
    font-size: 16px;
  }

  .lessons-grid {
    display: grid;
    gap: 12px;
    margin-bottom: 32px;
  }

  .lesson-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .lesson-card:not(.locked):hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fbbf24;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);
  }

  .lesson-card.locked {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .lesson-card.completed {
    border-color: rgba(74, 222, 128, 0.3);
  }

  .card-icon {
    font-size: 40px;
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }

  .card-content {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }

  .card-desc {
    font-size: 13px;
    color: #94a3b8;
    margin: 0 0 8px 0;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-wpm {
    font-size: 12px;
    color: #fbbf24;
    font-weight: 600;
  }

  .card-accuracy {
    font-size: 12px;
    color: #4ade80;
    font-weight: 600;
  }

  .card-lock-text {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }

  .tips {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 24px;
  }

  .tips h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
  }

  .tips ul {
    margin: 0;
    padding-left: 20px;
  }

  .tips li {
    color: #cbd5e1;
    margin-bottom: 8px;
    line-height: 1.6;
  }

  .tips strong {
    color: #fbbf24;
  }

  @media (max-width: 768px) {
    .main {
      padding: 16px;
    }

    .game-card {
      flex-direction: column;
      text-align: center;
      padding: 24px;
    }

    .game-card-icon {
      font-size: 48px;
    }

    .game-card-title {
      font-size: 24px;
    }

    .game-card-arrow {
      display: none;
    }
  }
</style>
