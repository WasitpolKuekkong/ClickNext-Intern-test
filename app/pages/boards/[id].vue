<template>
  <div class="wrap" v-if="board">
    <!-- Top bar: rename + delete -->
    <div class="top">
      <input
        class="board-name"
        :value="board?.name"
        @change="onRenameBoard"
        placeholder="Board name"
      />
      <button class="danger" type="button" @click="removeBoard">
        Delete board
      </button>
    </div>

    <!-- Columns -->
    <div class="columns">
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

      <!-- Add column box -->
      <div class="add-column">
        <input
          v-model="colTitle"
          placeholder="New column..."
          @keyup.enter="createColumn"
        />
        <button type="button" @click="createColumn">Add column</button>
      </div>
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

// ใช้ boardId (string) ในทุก action เพื่อหลีกเลี่ยงการอ้าง board.id ตรง ๆ
const boardId = computed(() => String(route.params.id))
const board   = computed(() => getBoard(boardId.value))

const colTitle = ref('')

const createColumn = () => {
  if (!current.value) return navigateTo('/unsigned')
  if (!board.value) return
  const title = colTitle.value.trim()
  if (!title) return
  addColumn(boardId.value, title)
  colTitle.value = ''
}

const onRenameBoard = (e: Event) => {
  if (!board.value) return
  const value = (e.target as HTMLInputElement).value
  renameBoard(boardId.value, value)
}

const removeBoard = () => {
  if (!board.value) return
  if (!confirm(`ต้องการลบบอร์ด “${board.value.name}” หรือไม่?`)) return
  deleteBoard(boardId.value)
  navigateTo('/')
}

// persist ทุกครั้งที่ boards เปลี่ยน
watch(boards, saveBoards, { deep: true })
</script>

<style scoped>
.wrap { padding: 16px; }

.top {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.board-name {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 8px;
}

.danger {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}
.danger:hover { background: #dc2626; }

.columns {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.add-column {
  width: 280px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 10px;
}
.add-column input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 8px;
}
.add-column button {
  border: 1px solid #d0d7de;
  background: #f6f8fa;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}
.add-column button:hover { background: #eef2f7; }
</style>
