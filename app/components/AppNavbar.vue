<template>
  <header class="kb-navbar">

    <div class="kb-left">
      <h1 class="kb-title">{{ title }}</h1>
    </div>

    <div class="kb-center">

      <button v-if="isMain" class="kb-add" type="button" aria-label="Add board" title="Add board" @click="onAddClick"
        :disabled="!isAuthed">
        <span>+</span>
      </button>


      <button v-else class="kb-add" type="button" aria-label="Back to boards" title="Back" @click="goMain">
        <span>&lt;</span>
      </button>
    </div>



    <div class="kb-right">
      <button v-if="isAuthed" class="kb-auth-btn" type="button" @click="handleLogout">
        Logout
      </button>
      <button v-else class="kb-auth-btn" type="button" @click="goLogin">
        Login
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/composables/useAuth'
const isMain = computed(() => props.mainpage)
const props = defineProps({
  title: { type: String, default: 'KanbanBoard' },
  mainpage: { type: Boolean, default: false }, 
})

const emit = defineEmits<{
  (e: 'add-board'): void
}>()

const router = useRouter()
const { current, hydrate, logout } = useAuth()

onMounted(() => {
  hydrate() // sync จาก localStorage -> current
})

const isAuthed = computed(() => !!current.value)

const handleLogout = () => {
  logout()
  router.push('/unsigned')
}

const goMain = () => {
  router.push('/')
}

const goLogin = () => {
  router.push('/unsigned')
}


const onAddClick = () => {
  if (!isAuthed.value) {
    router.push('/unsigned')
    return
  }
  emit('add-board')
}
</script>

<style scoped>
.kb-add[disabled] {
  opacity: .6;
  cursor: not-allowed;
}

.kb-add[disabled] span {
  box-shadow: none;
}

:root {
  --kb-bg: #ffffff;
  --kb-border: #e6e8eb;
  --kb-text: #1f2328;
  --kb-muted: #6b7280;
  --kb-accent: #2563eb;
  --kb-accent-hover: #1d4ed8;
  --kb-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.kb-navbar {
  position: sticky;
  top: 16px;
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
  outline: black 2px solid;
  border-radius: 10px;
  background-color: rgb(255, 255, 255 , 0.6);
  backdrop-filter: blur(5px);
}


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


.kb-add {
  display: flex;
  justify-content: center;
  padding: 0.1em 0.25em;
  width: 5em;
  height: 4.2em;
  background-color: #fff;
  border: 0.08em solid #000;
  border-radius: 0.3em;
  font-size: 12px;
  cursor: pointer;

}

.kb-add span {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0.4em;
  width: 12em;
  height: 3.25em;
  background-color: #fff;
  border-radius: 0.2em;
  font-size: 1.1em;
  color: #000;
  border: 0.08em solid #000;
  box-shadow: 0 0.4em 0.1em 0.019em #000;
}

.kb-add span:active {
  transition: all 0.3s;
  transform: translate(0, 0.4em);
  background-color: #c5c5c5;
  box-shadow: 0 0 0 0 #fff;
}

.kb-add span:hover {
  background: #eef2f7;

}

.kb-add:active {
  transform: translateY(1px);
}


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
