<template>
    <div class="card" :style="{ '--card-bg': colors.bg, '--card-border': colors.border }">

        <div class="row-title">

            <template v-if="editingTitle">
                <input ref="titleInput" class="title-input" v-model.trim="titleDraft" @keyup.enter="saveTitle"
                    @keyup.esc="cancelTitle" @blur="saveTitle" placeholder="Task title" />
            </template>


            <template v-else>
                <h2 class="title-text" role="button" tabindex="0" title="คลิกเพื่อแก้ชื่อ" @click="startEditTitle"
                    @keydown.enter.prevent="startEditTitle">
                    {{ task.title }}
                </h2>
            </template>


            <button v-if="showDelete" class="danger" type="button" title="Delete task" @mousedown.prevent
                @click.stop="$emit('delete')">
                Delete
            </button>
        </div>

        <div class="row-desc">
            <template v-if="editingDesc">
                <textarea ref="descInput" class="desc-input" v-model="descDraft" @keyup.esc="cancelDesc"
                    @blur="saveDesc" placeholder="Description (optional)"></textarea>
                <div class="desc-actions">
                    <button class="btn" @click="saveDesc">Save</button>
                    <button class="btn ghost" @click="cancelDesc">Cancel</button>
                </div>
            </template>
            <template v-else>
                <p class="desc-text" :class="{ placeholder: !task.description }" role="button" tabindex="0"
                    title="คลิกเพื่อแก้รายละเอียด" @click="startEditDesc" @keydown.enter.prevent="startEditDesc">
                    {{ task.description || 'Add a description…' }}
                </p>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

type Task = { id: string; title: string; description?: string }
const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
    (e: 'update', payload: Partial<Pick<Task, 'title' | 'description'>>): void
    (e: 'delete'): void
}>()


const editingTitle = ref(false)
const titleDraft = ref(props.task.title)
const titleInput = ref<HTMLInputElement | null>(null)

const startEditTitle = async () => {
    titleDraft.value = props.task.title
    editingTitle.value = true
    await nextTick()
    titleInput.value?.focus()
}
const saveTitle = () => {
    const v = titleDraft.value.trim()
    if (v && v !== props.task.title) emit('update', { title: v })
    editingTitle.value = false
}
const cancelTitle = () => {
    titleDraft.value = props.task.title
    editingTitle.value = false
}


const editingDesc = ref(false)
const descDraft = ref(props.task.description ?? '')
const descInput = ref<HTMLTextAreaElement | null>(null)

const startEditDesc = async () => {
    descDraft.value = props.task.description ?? ''
    editingDesc.value = true
    await nextTick()
    descInput.value?.focus()
}
const saveDesc = () => {
    const v = descDraft.value
    if (v !== (props.task.description ?? '')) emit('update', { description: v })
    editingDesc.value = false
}
const cancelDesc = () => {
    descDraft.value = props.task.description ?? ''
    editingDesc.value = false
}


const showDelete = computed(() => editingTitle.value || editingDesc.value)


watch(() => props.task, (t) => {
    if (!editingTitle.value) titleDraft.value = t.title
    if (!editingDesc.value) descDraft.value = t.description ?? ''
}, { deep: true })


function pastelFromSeed(seed: string) {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
    return { bg: `hsl(${h}, 60%, 92%)`, border: `hsl(${h}, 40%, 75%)` }
}
const colors = computed(() => pastelFromSeed(props.task.id))

const task = computed(() => props.task)
</script>

<style scoped>
.card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: box-shadow .15s ease, transform .1s ease;
}

.card:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, .08);
    transform: translateY(-1px);
}

.row-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.title-text {
    flex: 1;
    margin: 0;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 6px;
}

.title-text:hover {
    background: rgba(0, 0, 0, .05);
}

.title-input {
    flex: 1;
    width: 180px;
    border: 1px solid #cfd6e4;
    border-radius: 8px;
    padding: 6px 8px;
    font-weight: 700;
}

.row-desc {
    margin-top: 2px;
}

.desc-text {
    white-space: pre-wrap;
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
    margin: 0;
}

.desc-text.placeholder {
    color: #9aa1ac;
    font-style: italic;
}

.desc-text:hover {
    background: rgba(0, 0, 0, .04);
}

.desc-input {
    width: 90%;
    min-height: 64px;
    border: 1px solid #cfd6e4;
    border-radius: 8px;
    padding: 8px 10px;
    resize: vertical;
}

.desc-actions {
    margin-top: 6px;
    display: flex;
    gap: 6px;
    justify-content: flex-end;
}

.btn {
    border: 1px solid #d0d7de;
    background: #f6f8fa;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    font-weight: 600;
}

.btn.ghost:hover {
    background: #eef2f7;
}

.danger {
    background: #ef4444;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    font-weight: 700;
}

.danger:hover {
    background: #dc2626;
}
</style>
