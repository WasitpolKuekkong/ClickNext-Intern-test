<template>
  <header class="kb-navbar">
    <!-- Left -->
    <div class="kb-left"></div>

    <!-- Center: Title + Add Board -->
    <div class="kb-center">
      <h1 class="kb-title">{{ title }}</h1>
      <button
        class="kb-add"
        type="button"
        aria-label="Add board"
        @click="emit('add-board')"
        title="Add board"
      >
        +
      </button>
    </div>

    <!-- Right: Login / Logout -->
    <div class="kb-right">
      <button
        v-if="isAuthed"
        class="kb-auth-btn"
        type="button"
        @click="handleLogout"
      >
        Logout
      </button>
      <button
        v-else
        class="kb-auth-btn"
        type="button"
        @click="goLogin"
      >
        Login
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from '#app'

const props = withDefaults(defineProps<{
  title?: string
  tokenKey?: string
}>(), {
  title: 'KanbanBoard',
  tokenKey: 'authToken',
})

const emit = defineEmits<{
  (e: 'add-board'): void
}>()

const router = useRouter()
const isAuthed = ref(false)

const syncAuth = () => {
  try {
    isAuthed.value = !!localStorage.getItem(props.tokenKey)
  } catch {
    isAuthed.value = false
  }
}

const onStorage = (e: StorageEvent) => {
  if (e.key === props.tokenKey) syncAuth()
}

const handleLogout = () => {
  localStorage.removeItem(props.tokenKey)
  syncAuth()
  router.push('/unsigned')
}

const goLogin = () => {
  router.push('/unsigned')
}

onMounted(() => {
  syncAuth()
  window.addEventListener('storage', onStorage)
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', onStorage)
})
</script>
<style scoped>
:root {
  --kb-bg: #ffffff;
  --kb-border: #e6e8eb;
  --kb-text: #1f2328;
  --kb-muted: #6b7280;
  --kb-accent: #2563eb;
  --kb-accent-hover: #1d4ed8;
  --kb-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.kb-navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 16px;
  background: var(--kb-bg);
  border-bottom: 1px solid var(--kb-border);
  box-shadow: var(--kb-shadow);
}

/* Left / Right regions */
.kb-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.kb-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* Center cluster */
.kb-center {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.kb-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--kb-text);
  letter-spacing: 0.2px;
}

/* Add (+) button */
.kb-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--kb-border);
  background: #f8fafc;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.08s ease, background 0.15s ease, border-color 0.15s ease;
}
.kb-add:hover {
  background: #eef2f7;
  border-color: #d0d7de;
}
.kb-add:active {
  transform: translateY(1px);
}

/* Login/Logout button */
.kb-auth-btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--kb-border);
  background: #f9fafb;
  font-weight: 600;
  color: var(--kb-text);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.08s ease;
}
.kb-auth-btn:hover {
  background: #eef2f7;
  border-color: #d0d7de;
}
.kb-auth-btn:active {
  transform: translateY(1px);
}

/* Responsive tweaks */
@media (max-width: 640px) {
  .kb-navbar {
    height: 56px;
    padding: 0 12px;
    grid-template-columns: 1fr auto 1fr;
  }
  .kb-title {
    font-size: 16px;
  }
  .kb-add {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
  .kb-auth-btn {
    height: 34px;
    padding: 0 12px;
  }
}
</style>
