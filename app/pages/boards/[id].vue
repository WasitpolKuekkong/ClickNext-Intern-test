<template>
    <div class="wrap" v-if="board">
        <AppNavbar title="KanbanBoard" @add-board="openAdd" />
        <div class="title-container">
            <p>ชื่่อบอร์ด</p>
            <h1>{{ board?.name }}</h1>
        </div>


        <MyModal :showModal="show" title="เพิ่ม Column" modalPlaceholder="ชื่อ Column" @close="show = false"
            @submit="createColumn" />

        <div class="top">
            <input class="input" :value="board?.name" @change="onRenameBoard" placeholder="Board name" />


            <button class="add-column" type="button" @click="openAdd">
                เพิ่ม Column
            </button>

            <button class="danger" type="button" @click="removeBoard">
                Delete board
            </button>
        </div>

        <!-- Columns -->
        <div class="columns">
            <Column v-for="c in (board?.columns ?? [])" :key="c.id" :column="c"
                @rename-column="(cid, title) => renameColumn(boardId, cid, title)"
                @delete-column="(cid) => deleteColumn(boardId, cid)"
                @add-task="(cid, title) => addTask(boardId, cid, title)"
                @update-task="(cid, tid, p) => updateTask(boardId, cid, tid, p)"
                @delete-task="(cid, tid) => deleteTask(boardId, cid, tid)" @reorder-tasks="onReorderTasks"
                @move-task="onMoveTask" />


        </div>
    </div>

    <div v-else>
        <p>Board not found.</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Column from '~/components/Column.vue'
import { useRoute } from 'vue-router'
import { useBoards } from '~/composables/useBoards'
import { useAuth } from '~/composables/useAuth'

const show = ref(false)
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

// เรียงในคอลัมน์เดียวกัน
const onReorderTasks = (cid: string, from: number, toRaw: number) => {
    const col = board.value?.columns.find(c => c.id === cid)
    if (!col) return
    const list = [...col.tasks]
    const item = list[from]
    if (!item) return
    list.splice(from, 1)
    const to = from < toRaw ? toRaw - 1 : toRaw
    list.splice(to, 0, item)
    col.tasks = list
    saveBoards()
}

// ย้ายข้ามคอลัมน์
const onMoveTask = (fromColId: string, fromIndex: number, toColId: string, toRaw: number) => {
    const fromCol = board.value?.columns.find(c => c.id === fromColId)
    const toCol = board.value?.columns.find(c => c.id === toColId)
    if (!fromCol || !toCol) return
    const [item] = fromCol.tasks.splice(fromIndex, 1)
    if (!item) return
    let to = toRaw
    if (fromColId === toColId && fromIndex < toRaw) to = toRaw - 1
    toCol.tasks.splice(to, 0, item)
    saveBoards()
}

const boardId = computed(() => String(route.params.id))
const board = computed(() => getBoard(boardId.value))

const colTitle = ref('')


const openAdd = () => {
    if (!current.value) return navigateTo('/unsigned')
    show.value = true
}


const createColumn = (name?: string) => {
    if (!current.value) return navigateTo('/unsigned')
    if (!board.value) return

    const title = (name ?? colTitle.value).trim()
    if (!title) return

    addColumn(boardId.value, title)
    colTitle.value = ''
    show.value = false
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

watch(boards, saveBoards, { deep: true })
</script>

<style scoped>
.title-container {
    display: flex;
    margin: 10px;
    align-items: center;
    gap: 10px;
}

.welcomer {
    display: flex;
    justify-content: center;
    margin: 1rem;
}

.input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1.5px solid #000;
    border-radius: 0.5rem;
    box-shadow: 2.5px 3px 0 #000;
    outline: none;
    transition: ease 0.25s;
}

.input:focus {
    box-shadow: 5.5px 7px 0 black;
}

.wrap {
    padding: 16px;
}

.top {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;
}

.danger {
    border: unset;
    background-color: white;
    color: red;
    outline: #ef4444 solid 2px;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.danger:hover {
    background: #dc2626;
    color: white;
}

.columns {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    flex-wrap: wrap;
}

.add-column {
    cursor: pointer;
    width: 280px;
    border: 2px solid black;
    border-radius: 10px;
    padding: 15px;
    transition: all 0.2s ease-in-out;
}

.add-column:hover {
    box-shadow: 0px 0px 8px rgba(1, 1, 1, 0.5);
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

.add-column button:hover {
    background: #eef2f7;
}
</style>
