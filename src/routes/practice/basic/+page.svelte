<script lang="ts">
  import QuickPractice from "$lib/components/QuickPractice.svelte";
</script>

<svelte:head>
  <title>Latihan Dasar - Ketik 10 Jari</title>
</svelte:head>

<div class="page">
  <main class="main">
    <QuickPractice />
    <a href="/" class="back-link">← Kembali ke Pelajaran</a>
  </main>
</div>

<style>
  .page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    color: white;
  }

  .main {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px;
  }

  .back-link {
    display: inline-block;
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    margin-top: 16px;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #fbbf24;
  }
</style>
