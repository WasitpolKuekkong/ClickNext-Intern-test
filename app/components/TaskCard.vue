<template>
  <div class="card">
    <input class="title" :value="task.title" @change="onTitle" />
    <textarea class="desc" :value="task.description || ''" @change="onDesc" placeholder="Description (optional)" />
    <div class="row">
      <button class="danger" @click="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ task: { id: string; title: string; description?: string } }>()
const emit = defineEmits(['update', 'delete'])

const onTitle = (e: Event) => {
  emit('update', { title: (e.target as HTMLInputElement).value })
}
const onDesc = (e: Event) => {
  emit('update', { description: (e.target as HTMLTextAreaElement).value })
}
</script>

<style scoped>
.card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.title, .desc { width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 8px; }
.desc { min-height: 60px; }
.row { display: flex; justify-content: flex-end; }
.danger { background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
.danger:hover { background: #dc2626; }
</style>
