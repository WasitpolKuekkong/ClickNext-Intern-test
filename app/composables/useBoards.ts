// ใช้กับ Nuxt 3
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface Task {
    id: string
    title: string
    description?: string
}
export interface Column {
    id: string
    title: string
    tasks: Task[]
}
export interface Board {
    id: string
    name: string
    columns: Column[]
}

export const useBoards = () => {
    const { current } = useAuth()
    // เก็บข้อมูลต่อ user: ใช้ email เป็นส่วนหนึ่งของ key
    const storageKey = computed(
        () => `kanban_boards_${current.value?.email || 'guest'}`
    )

    const boards = ref<Board[]>([])

    const ensureLoggedIn = () => {
        if (!current.value) throw new Error('Please login first')
    }

    const loadBoards = () => {
        try {
            const raw = localStorage.getItem(storageKey.value)
            boards.value = raw ? JSON.parse(raw) : []
        } catch {
            boards.value = []
        }
    }

    const saveBoards = () => {
        localStorage.setItem(storageKey.value, JSON.stringify(boards.value))
    }

    const addBoard = (name: string) => {
        ensureLoggedIn()
        const trimmed = (name || '').trim()
        if (!trimmed) throw new Error('Board name is required')
        if (boards.value.some(b => b.name.toLowerCase() === trimmed.toLowerCase())) {
            throw new Error('Board name already exists')
        }
        const board: Board = {
            id: crypto.randomUUID(),
            name: trimmed,
            columns: [],
        }
        boards.value.push(board)
        saveBoards()
        return board
    }

    const renameBoard = (boardId: string, newName: string) => {
        ensureLoggedIn()
        const b = boards.value.find(b => b.id === boardId)
        if (!b) return
        const trimmed = (newName || '').trim()
        if (!trimmed) return
        b.name = trimmed
        saveBoards()
    }

    const deleteBoard = (boardId: string) => {
        ensureLoggedIn()
        boards.value = boards.value.filter(b => b.id !== boardId)
        saveBoards()
    }

    const getBoard = (id: string) => boards.value.find(b => b.id === id)

    // Columns
    const addColumn = (boardId: string, title: string) => {
        ensureLoggedIn()
        const board = getBoard(boardId)
        if (!board) return
        const t = (title || '').trim()
        if (!t) return
        board.columns.push({ id: crypto.randomUUID(), title: t, tasks: [] })
        saveBoards()
    }
    const renameColumn = (boardId: string, columnId: string, title: string) => {
        ensureLoggedIn()
        const col = getBoard(boardId)?.columns.find(c => c.id === columnId)
        if (!col) return
        const t = (title || '').trim()
        if (!t) return
        col.title = t
        saveBoards()
    }
    const deleteColumn = (boardId: string, columnId: string) => {
        ensureLoggedIn()
        const b = getBoard(boardId)
        if (!b) return
        b.columns = b.columns.filter(c => c.id !== columnId)
        saveBoards()
    }

    // Tasks (สร้าง/แก้ไข/ลบ)
    const addTask = (boardId: string, columnId: string, title: string) => {
        ensureLoggedIn()
        const col = getBoard(boardId)?.columns.find(c => c.id === columnId)
        if (!col) return
        const t = (title || '').trim()
        if (!t) return
        col.tasks.push({ id: crypto.randomUUID(), title: t })
        saveBoards()
    }
    const updateTask = (
        boardId: string,
        columnId: string,
        taskId: string,
        payload: Partial<Pick<Task, 'title' | 'description'>>
    ) => {
        ensureLoggedIn()
        const task = getBoard(boardId)
            ?.columns.find(c => c.id === columnId)
            ?.tasks.find(t => t.id === taskId)
        if (!task) return
        if (payload.title !== undefined) task.title = payload.title
        if (payload.description !== undefined) task.description = payload.description
        saveBoards()
    }
    const deleteTask = (boardId: string, columnId: string, taskId: string) => {
        ensureLoggedIn()
        const col = getBoard(boardId)?.columns.find(c => c.id === columnId)
        if (!col) return
        col.tasks = col.tasks.filter(t => t.id !== taskId)
        saveBoards()
    }

    return {
        boards, storageKey,
        loadBoards, saveBoards,
        addBoard, renameBoard, deleteBoard, getBoard,
        addColumn, renameColumn, deleteColumn,
        addTask, updateTask, deleteTask,
    }
}
