<template>
    <div class="col">
        <div class="col-head">
            <input class="col-title" :value="column.title" @change="onRename" />
            <button class="del" @click="$emit('delete-column', column.id)">×</button>
        </div>

        <ul class="tasks">
            <li v-for="t in column.tasks" :key="t.id">
                <TaskCard :task="t" @update="(p) => $emit('update-task', column.id, t.id, p)"
                    @delete="() => $emit('delete-task', column.id, t.id)" />
            </li>
        </ul>

        <div class="add-task">
            <input v-model="newTitle" placeholder="New task..." @keyup.enter="add" />
            <button @click="add">Add</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
const props = defineProps<{
    column: { id: string; title: string; tasks: any[] }
}>()
const emit = defineEmits(['rename-column', 'delete-column', 'add-task', 'update-task', 'delete-task'])

const newTitle = ref('')
const add = () => {
    const t = newTitle.value.trim()
    if (!t) return
    emit('add-task', props.column.id, t)
    newTitle.value = ''
}

const onRename = (e: Event) => {
    const v = (e.target as HTMLInputElement).value
    emit('rename-column', props.column.id, v)
}
</script>

<style scoped>
.col {
    width: 280px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.col-head {
    display: flex;
    align-items: center;
    gap: 8px;
}

.col-title {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
}

.del {
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.tasks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
</style>
