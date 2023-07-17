<template>
  <div>{{ num }}</div>
  <login />
  12312312123131
  <input type="text" value="" />
  <h1>{{ a }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import a from '@/count'
import Login from '@/Login.vue'

const num = ref(1)
</script>

<style scoped></style>
