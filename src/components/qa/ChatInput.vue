<template>
  <div class="chat-input">
    <el-input
      v-model="inputText"
      placeholder="请输入您的问题..."
      :disabled="loading"
      @keyup.enter="handleSend"
      clearable
    >
      <template #append>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSend"
          :disabled="!inputText.trim()"
        >
          <el-icon v-if="!loading"><Promotion /></el-icon>
          <span>发送</span>
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

defineProps<{ loading: boolean }>()

const emit = defineEmits<{
  send: [question: string]
}>()

const inputText = ref('')

function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  emit('send', text)
  inputText.value = ''
}
</script>

<style scoped>
.chat-input {
  width: 100%;
}

.chat-input :deep(.el-input-group__append) {
  padding: 0;
}

.chat-input :deep(.el-input-group__append) .el-button {
  margin: 0;
  border-radius: 0;
  padding: 8px 20px;
}
</style>
