<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import HeroSection from '@/components/HeroSection.vue';
import PollCard from '@/components/PollCard.vue';

const options = [
  { label: 'Option 1', percent: 45 },
  { label: 'Option 2', percent: 25 },
  { label: 'Option 3', percent: 20 },
  { label: 'Option 4', percent: 10 },
]
</script>

<template>
    <div class="min-h-screen bg-white text-gray-800">
      <NavBar />
  
      <!-- Hero Section -->
      <section class="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 max-w-7xl mx-auto">
        <!-- Text Content -->
        <HeroSection />
  
        <!-- Mock Poll Card -->
        <PollCard :options="options" />
      </section>
    </div>
  </template>
  