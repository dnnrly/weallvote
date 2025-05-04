<template>
    <div class="poll-card">
      <h2 class="poll-title">Take Our Survey</h2>
      <div v-for="(option, index) in options" :key="index" class="poll-option">
        <div class="flex justify-between text-sm mb-1">
          <span>{{ option.label }}</span>
          <span>{{ option.percent }}%</span>
        </div>
        <div class="poll-bar-bg">
          <div class="poll-bar-fill" :style="{ width: option.percent + '%' }"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const options = [
    { label: 'Option 1', percent: 45 },
    { label: 'Option 2', percent: 25 },
    { label: 'Option 3', percent: 20 },
    { label: 'Option 4', percent: 10 },
  ]
  </script>
  