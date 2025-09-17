<template>
  <div v-show="showModal" class="modal-overlay">
    <div class="modal-container">
      <span class="top-modal">
        <div class="title-">{{ title }}</div>
        <button class="close-modal" @click="handleCloseModal">X</button>
      </span>

      <form @submit.prevent="handleSubmit">
        <input v-model="inputValue" type="text" class="input" :placeholder="modalPlaceholder" />

        <div class="modal-body">
          <slot />
        </div>

        <button type="submit" class="submit-btn"><span>Submit</span></button>
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
.modal-container form {
  display: flex;
  padding: 1em;
  gap: 5px;

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
  outline: black 2px solid;
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
  color: red;
  outline: red 2px solid;
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
 transition: all ease-in-out 0.3s;
  font-size: 1rem;
  cursor: pointer;
}

.close-modal:hover {
  background-color: red;
  color: white;
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

.submit-btn span{
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
.submit-btn span:active{
   transition: all 0.3s;
  transform: translate(0, 0.4em);
  background-color: #c5c5c5;
  box-shadow: 0 0 0 0 #fff;
}
.submit-btn span:hover {
  background: #eef2f7;
}
</style>
