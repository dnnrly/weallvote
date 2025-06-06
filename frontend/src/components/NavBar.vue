<template>
  <nav class="navbar flex justify-between items-center px-6 py-4 bg-white shadow">
    <div class="navbar-logo text-xl font-bold">
      <span>🗳️</span> PollCraft
    </div>

    <div class="navbar-links flex gap-4 items-center">
      <a href="#" class="hover:text-blue-600">Home</a>
      <a href="#" class="hover:text-blue-600">About</a>

      <!-- ✅ Integrated NavLogin Component -->
      <NavLogin />
    </div>
  </nav>
</template>

<script setup>
import NavLogin from '@/components/NavLogin.vue';
</script>
