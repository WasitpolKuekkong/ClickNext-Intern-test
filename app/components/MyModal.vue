<template>
  <div v-show="showModal" class="modal-overlay">
    <div class="modal-container">
      <span class="top-modal">
        <div class="title-">{{ title }}</div>
        <button class="close-modal" @click="handleCloseModal">X</button>
      </span>

      <form @submit.prevent="handleSubmit">
        <input
          v-model="inputValue"
          type="text"
          class="modal-input"
          :placeholder="modalPlaceholder"
        />

        <div class="modal-body">
          <slot />
        </div>

        <button type="submit" class="submit-btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  showModal: { type: Boolean, default: false },
  title: { type: String, default: '' },
  modalPlaceholder: { type: String, default: '' },
  defaultValue: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const inputValue = ref(props.defaultValue)

watch(() => props.showModal, (val) => {
  if (val) inputValue.value = props.defaultValue
})

const handleCloseModal = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!inputValue.value.trim()) return
  emit('submit', inputValue.value.trim())
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  background-color: rgba(1, 1, 1, 0.5);
  z-index: 100;
  height: 100dvh;
  width: 100dvw;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
}

.top-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title- {
  font-size: 1.2rem;
  font-weight: bold;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.modal-input {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.submit-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #1d4ed8;
}
</style>
