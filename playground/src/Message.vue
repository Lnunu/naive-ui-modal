<script setup lang="ts">
import { useMessage } from "message";
import { NAlert, NButton, NModal, NSpace } from "naive-ui";
import { h, ref } from "vue";

const isShowModal = ref<boolean>(false);

function openModal() {
  isShowModal.value = true;
}
const message = useMessage()

function openCommandModal() {
  message.create({
    preset: "card",
    content: () => h("div", "hahahah")
  })
}

</script>

<template>
  <main class="container">
    <NSpace>
      <NButton @click="openModal">open modal by component</NButton>
      <NButton @click="openCommandModal">open modal by command</NButton>
    </NSpace>
    <NModal :show="isShowModal"
            preset="card"
            style="width: 800px;"
            @update:show="(show) => isShowModal = show">
      <NAlert type="success">modal for component</NAlert>
    </NModal>
  </main>
</template>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
