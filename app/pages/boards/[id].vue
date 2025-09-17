<template>
  <div class="wrap" v-if="board">
    <!-- อ่านชื่อแบบปลอดภัย -->
    <input class="board-name" :value="board?.name" @change="onRenameBoard" />

    <div class="columns">
      <!-- iterate แบบ fallback ป้องกัน undefined -->
      <Column
        v-for="c in (board?.columns ?? [])"
        :key="c.id"
        :column="c"
        @rename-column="(cid, title) => renameColumn(boardId, cid, title)"
        @delete-column="(cid) => deleteColumn(boardId, cid)"
        @add-task="(cid, title) => addTask(boardId, cid, title)"
        @update-task="(cid, tid, p) => updateTask(boardId, cid, tid, p)"
        @delete-task="(cid, tid) => deleteTask(boardId, cid, tid)"
      />
    </div>
  </div>

  <div v-else>
    <p>Board not found.</p>
  </div>
</template>

<script setup lang="ts">
import Column from '~/components/Column.vue'
import { useRoute } from 'vue-router'
import { useBoards } from '~/composables/useBoards'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { current, hydrate } = useAuth()
const {
  boards, loadBoards, saveBoards, getBoard,
  renameBoard, deleteBoard, addColumn, renameColumn, deleteColumn,
  addTask, updateTask, deleteTask
} = useBoards()

onMounted(() => {
  hydrate()
  loadBoards()
})

// แยก boardId ออกมาใช้ใน template (refs auto-unwrapped ใน template)
const boardId = computed(() => String(route.params.id))

// ยังให้ board เป็น Board | undefined ได้เหมือนเดิม
const board = computed(() => getBoard(boardId.value))

const colTitle = ref('')

const createColumn = () => {
  if (!current.value) return navigateTo('/unsigned')
  if (!board.value) return
  addColumn(boardId.value, colTitle.value)
  colTitle.value = ''
}

const onRenameBoard = (e: Event) => {
  if (!board.value) return
  renameBoard(boardId.value, (e.target as HTMLInputElement).value)
}

const removeBoard = () => {
  if (!board.value) return
  deleteBoard(boardId.value)
  navigateTo('/')
}

// persist ทุกครั้งที่ boards เปลี่ยน
watch(boards, saveBoards, { deep: true })
</script>

<style scoped>
.wrap { padding: 16px; }
.top { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.board-name { flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 8px; }
.danger { background: #ef4444; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
.columns { display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap; }
.add-column { width: 280px; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 10px; }
.add-column input { width: 100%; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; }
.add-column button { border: 1px solid #d0d7de; background: #f6f8fa; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
</style>
