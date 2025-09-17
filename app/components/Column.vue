<template>
    <div class="col">
        <div class="col-head">
            <template v-if="!editMode">
                <h2 class="column-title" @click="enterEdit" title="คลิกเพื่อแก้ชื่อ">
                    {{ column.title }}
                </h2>
            </template>

            <template v-else>
                <input ref="nameInput" class="col-title" v-model.trim="editName" @keyup.enter="saveRename"
                    @keyup.esc="cancelRename" placeholder="Column name" />
                <button class="ghost" type="button" @click="saveRename">Save</button>
                <button class="ghost" type="button" @click="cancelRename">Cancel</button>
                <button class="del" type="button" @click="$emit('delete-column', column.id)">×</button>
            </template>
        </div>

      
        <div class="add-task">
            <input v-model="newTitle" placeholder="New task..." @keyup.enter="add" />
            <button @click="add">Add</button>
        </div>

      
        <ul class="tasks" @dragover.stop.prevent="onListDragOver" @drop.stop.prevent="onListDrop"
            :class="{ 'over-list': overIndex === null && isOverList }">
            <li v-for="(t, i) in column.tasks" :key="t.id" class="task-row" draggable="true"
                @dragstart="onTaskDragStart(i, $event)" @dragover.stop.prevent="onTaskDragOver(i, $event)"
                @drop.stop.prevent="onTaskDrop(i, $event)" @dragend="resetTaskDnD" :class="{
                    dragging: dragIndex === i,
                    'over-before': overIndex === i && !overAfter,
                    'over-after': overIndex === i && overAfter
                }">
                <TaskCard :task="t" @update="(p) => $emit('update-task', column.id, t.id, p)"
                    @delete="() => $emit('delete-task', column.id, t.id)" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import TaskCard from './TaskCard.vue'

type Task = { id: string; title: string; description?: string }
const props = defineProps<{
    column: { id: string; title: string; tasks: Task[] }
}>()

const emit = defineEmits<{
    (e: 'rename-column', columnId: string, newTitle: string): void
    (e: 'delete-column', columnId: string): void
    (e: 'add-task', columnId: string, title: string): void
    (e: 'update-task', columnId: string, taskId: string, payload: any): void
    (e: 'delete-task', columnId: string, taskId: string): void
 
    (e: 'reorder-tasks', columnId: string, fromIndex: number, toIndexRaw: number): void

    (e: 'move-task', fromColId: string, fromIndex: number, toColId: string, toIndexRaw: number): void
}>()


const editMode = ref(false)
const editName = ref(props.column.title)
const nameInput = ref<HTMLInputElement | null>(null)

const enterEdit = async () => {
    editName.value = props.column.title
    editMode.value = true
    await nextTick()
    nameInput.value?.focus()
}
const saveRename = () => {
    const v = editName.value.trim()
    if (!v || v === props.column.title) { editMode.value = false; return }
    emit('rename-column', props.column.id, v)
    editMode.value = false
}
const cancelRename = () => {
    editMode.value = false
    editName.value = props.column.title
}


const newTitle = ref('')
const add = () => {
    const t = newTitle.value.trim()
    if (!t) return
    emit('add-task', props.column.id, t)
    newTitle.value = ''
}


const dragIndex = ref<number | null>(null) 
const overIndex = ref<number | null>(null) 
const overAfter = ref(false)               
const isOverList = ref(false)             

const onTaskDragStart = (index: number, e: DragEvent) => {
 
    const tag = (e.target as HTMLElement)?.tagName
    if (tag && ['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag)) {
        e.preventDefault(); return
    }
    dragIndex.value = index
    try {
        const payload = JSON.stringify({ colId: props.column.id, index })
        e.dataTransfer?.setData('text/plain', payload) 
        e.dataTransfer!.effectAllowed = 'move'
    } catch { }
}

const onTaskDragOver = (index: number, e: DragEvent) => {
 
    if (dragIndex.value === null) return
    isOverList.value = false
    overIndex.value = index
    const el = e.currentTarget as HTMLElement
    const r = el.getBoundingClientRect()
    overAfter.value = (e.clientY - r.top) > r.height / 2
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const onTaskDrop = (index: number, e: DragEvent) => {
    const data = e.dataTransfer?.getData('text/plain')
    if (!data) { resetTaskDnD(); return }
    let fromColId = props.column.id
    let fromIndex: number | null = null
    try {
        const parsed = JSON.parse(data) as { colId: string; index: number }
        fromColId = parsed.colId
        fromIndex = parsed.index
    } catch {
        fromIndex = dragIndex.value
    }
    const toIndexRaw = overAfter.value ? index + 1 : index
    if (fromIndex === null) { resetTaskDnD(); return }

    if (fromColId === props.column.id) {
        emit('reorder-tasks', props.column.id, fromIndex, toIndexRaw)
    } else {
        emit('move-task', fromColId, fromIndex, props.column.id, toIndexRaw)
    }
    resetTaskDnD()
}

/* ปล่อยท้าย/คอลัมน์ว่าง */
const onListDragOver = (e: DragEvent) => {
    if (dragIndex.value === null) return
    overIndex.value = null
    isOverList.value = true
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}
const onListDrop = (e: DragEvent) => {
    const data = e.dataTransfer?.getData('text/plain')
    if (!data) { resetTaskDnD(); return }
    let fromColId = props.column.id
    let fromIndex: number | null = null
    try {
        const parsed = JSON.parse(data) as { colId: string; index: number }
        fromColId = parsed.colId
        fromIndex = parsed.index
    } catch {
        fromIndex = dragIndex.value
    }
    if (fromIndex === null) { resetTaskDnD(); return }
    const toIndexRaw = props.column.tasks.length // ท้ายคอลัมน์

    if (fromColId === props.column.id) {
        emit('reorder-tasks', props.column.id, fromIndex, toIndexRaw)
    } else {
        emit('move-task', fromColId, fromIndex, props.column.id, toIndexRaw)
    }
    resetTaskDnD()
}

const resetTaskDnD = () => {
    dragIndex.value = null
    overIndex.value = null
    overAfter.value = false
    isOverList.value = false
}
</script>

<style scoped>
.col {
    width: 300px;
    background: #fff;
    outline: 2px solid #000;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 70dvh;
}

.col-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.column-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
}

.col-title {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
    width: 100px;
}

.ghost,
.del {
    height: 32px;
    padding: 0 10px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #d0d7de;
    background: #f6f8fa;
}

.del {
    background: #fff5f5;
    color: #b91c1c;
    border-color: #ef4444;
    font-size: 18px;
}

.del:hover {
    background: #fee2e2;
    border-color: #dc2626;
}

.tasks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 40px;
}

.tasks.over-list {
    outline: 2px dashed #2563eb;
    outline-offset: 4px;
    border-radius: 8px;
}

.task-row {
    cursor: grab;
    border-radius: 6px;
}

.task-row:active {
    cursor: grabbing;
}

.task-row.dragging {
    opacity: .75;
    background: #f8fafc;
}

.task-row.over-before {
    box-shadow: inset 0 3px 0 #2563eb;
}

.task-row.over-after {
    box-shadow: inset 0 -3px 0 #2563eb;
}

.add-task {
    display: flex;
    gap: 6px;
}

.add-task input {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
}

.add-task button {
    border: 1px solid #d0d7de;
    background: #f6f8fa;
    border-radius: 6px;
    padding: 0 10px;
    cursor: pointer;
}

.add-task button:hover {
    background: #eef2f7;
}
</style>
