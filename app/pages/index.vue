<template>
    <div class="wrap">
        <AppNavbar title="KanbanBoard" @add-board="openAdd" />
        <span class="welcomer">ยินดีต้อนรับกลับ {{ current?.name }}</span>

        <MyModal :showModal="show" title="สร้างบอร์ดใหม่" modalPlaceholder="ชื่่อบอร์ด" @close="show = false"
            @submit="createBoard" />

        <section class="list">
            <h2>Boards</h2>

            <ul class="board-grid">
                <li v-for="(b, i) in boards" :key="b.id" class="board-item"
                    :class="{ dragging: dragIndex === i, over: overIndex === i }" draggable="true"
                    @dragstart="onDragStart(i, $event)" @dragover="onDragOver(i, $event)" @drop="onDrop(i, $event)"
                    @dragend="resetDnD">
                    <NuxtLink class="board-link" :to="`/boards/${b.id}`">
                        {{ b.name }}
                    </NuxtLink>

                    <button class="btn-del" type="button" title="ลบบอร์ดนี้"
                        @click.stop.prevent="confirmDelete(b.id, b.name)">
                        ลบ
                    </button>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/AppNavbar.vue'
import MyModal from '~/components/MyModal.vue'
import { useBoards } from '~/composables/useBoards'
import { useAuth } from '~/composables/useAuth'

const show = ref(false)
const { boards, loadBoards, addBoard, deleteBoard, saveBoards } = useBoards()
const { current, hydrate } = useAuth()

// สำหรับ drag & drop
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

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

// ----- Delete -----
const confirmDelete = (id: string, name: string) => {
    if (!current.value) return navigateTo('/unsigned')
    deleteBoard(id)
        saveBoards()}


// ----- Drag & Drop -----
const onDragStart = (index: number, e: DragEvent) => {
    if (!current.value) { e.preventDefault(); return }
    dragIndex.value = index
    try {
        e.dataTransfer?.setData('text/plain', String(index))
        e.dataTransfer!.effectAllowed = 'move'
    } catch { }
}

const onDragOver = (index: number, e: DragEvent) => {
    e.preventDefault() // ต้องมีเพื่อให้ drop ได้
    if (dragIndex.value === null) return
    overIndex.value = index
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const onDrop = (index: number, e: DragEvent) => {
  e.preventDefault()
  const from = dragIndex.value
  const to   = index

  if (from === null || from === to) {
    resetDnD()
    return
  }

  // สำเนาอาร์เรย์แบบ type-safe
  const list = [...boards.value]
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) {
    resetDnD()
    return
  }

  // เก็บ item ก่อน แล้วค่อยลบ/แทรก (กัน undefined)
  const item = list[from]
  if (!item) { resetDnD(); return }

  // ลบตำแหน่งเดิม
  list.splice(from, 1)

  // ถ้าลากจากซ้ายไปขวา index ปลายทางจะขยับซ้ายลง 1
  const target = from < to ? to - 1 : to

  // แทรกที่ตำแหน่งใหม่
  list.splice(target, 0, item)

  boards.value = list
  saveBoards()
  resetDnD()
}

const resetDnD = () => {
    dragIndex.value = null
    overIndex.value = null
}
</script>

<style scoped>
.wrap {
    padding: 16px;
}

.welcomer {
    display: flex;
    justify-content: center;
    margin: 1rem;
}

.list h2 {
    margin: 12px 0;
}

.board-grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
}

/* card */
.board-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    background: #fff;
    border: 2px solid #111;
    border-radius: 10px;
    transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
    cursor: grab;
}

.board-item:active {
    cursor: grabbing;
}

.board-item:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, .18);
    transform: translateY(-1px);
}

.board-item.dragging {
    opacity: .75;
    background: #f8fafc;
}

.board-item.over {
    outline: 2px dashed #000000;
    outline-offset: 2px;
}

.board-link {
    all: unset;
    cursor: pointer;
    font-weight: 700;
    color: #111;
}

/* delete button */
.btn-del {
    border: 1px solid #ef4444;
    background: #fff5f5;
    color: #b91c1c;
    border-radius: 8px;
    padding: 6px 10px;
    font-weight: 600;
    cursor: pointer;
}

.btn-del:hover {
    background: #fee2e2;
    border-color: #dc2626;
}

.btn-del:active {
    transform: translateY(1px);
}

/* small screen */
@media (max-width: 640px) {
    .board-grid {
        grid-template-columns: 1fr;
    }
}
</style>
