<template>
  <div class="wrap">
    <AppNavbar title="KanbanBoard" @add-board="openAdd" />

    <MyModal
      :showModal="show"
      title="สร้างบอร์ดใหม่"
      modalPlaceholder="ชื่่อบอร์ด"
      @close="show = false"
      @submit="createBoard"
    />

    <section class="list">
      <h2>Boards</h2>
      <ul>
        <li v-for="b in boards" :key="b.id">
          <NuxtLink :to="`/boards/${b.id}`">{{ b.name }}</NuxtLink>
        </li>
      </ul>
      <button class="add" @click="openAdd">+ Add Board</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/AppNavbar.vue'
import MyModal from '~/components/MyModal.vue'
import { useBoards } from '~/composables/useBoards'
import { useAuth } from '~/composables/useAuth'

const show = ref(false)
const { boards, loadBoards, addBoard } = useBoards()
const { current, hydrate } = useAuth()

onMounted(() => {
  hydrate()
  loadBoards()
})

const openAdd = () => {
  if (!current.value) return navigateTo('/unsigned')
  show.value = true
}

const createBoard = (name: string) => {
  try {
    const b = addBoard(name)
    show.value = false
    navigateTo(`/boards/${b.id}`)
  } catch (e: any) {
    alert(e?.message || 'Cannot create board')
  }
}
</script>

<style scoped>
.wrap { padding: 16px; }
.list h2 { margin: 12px 0; }
.list ul { list-style: none; margin: 0 0 10px; padding: 0; }
.list li { margin: 6px 0; }
.add {
  height: 36px; padding: 0 14px; border-radius: 8px;
  border: 1px solid #d0d7de; background: #f6f8fa; font-weight: 600; cursor: pointer;
}
.add:hover { background: #eef2f7; }
</style>
