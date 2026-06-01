<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { getCurrentUserId, getUsers } from "$lib/stores/users";
  import Navbar from "$lib/components/Navbar.svelte";
  import "../app.css";

  let { children } = $props();

  const showNavbar = $derived(() => {
    const currentPath = page.url?.pathname || "/";
    return currentPath !== "/select-user";
  });

  $effect(() => {
    try {
      const currentPath = page.url?.pathname || "/";
      const userId = getCurrentUserId();
      const users = getUsers();

      // Jika tidak ada user sama sekali, biarkan akses select-user
      if (users.length === 0 && currentPath !== "/select-user") {
        goto("/select-user");
        return;
      }

      // Jika ada user tapi belum pilih, redirect ke select-user
      if (users.length > 0 && !userId && currentPath !== "/select-user") {
        goto("/select-user");
        return;
      }
    } catch (error) {
      console.error("Layout error:", error);
      // Fallback ke homepage jika ada error
      goto("/");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
{#if showNavbar()}
  <Navbar />
{/if}

{@render children()}
