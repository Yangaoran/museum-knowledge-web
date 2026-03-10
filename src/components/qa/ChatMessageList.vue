<template>
  <div class="message-list" ref="listRef">
    <div v-if="messages.length === 0" class="welcome-msg">
      <el-icon :size="48" color="#c0c4cc"><ChatDotRound /></el-icon>
      <p>欢迎使用智能问答系统</p>
      <span>试试问我关于博物馆文物的问题吧</span>
    </div>
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="['message-item', msg.role]"
    >
      <div class="message-avatar">
        <el-avatar :size="36" :style="avatarStyle(msg.role)">
          {{ msg.role === 'user' ? '我' : 'AI' }}
        </el-avatar>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          <div class="message-text" v-html="formatContent(msg.content)"></div>
          <div v-if="msg.cypher" class="cypher-block">
            <div class="cypher-label">Cypher 查询</div>
            <code>{{ msg.cypher }}</code>
          </div>
          <div v-if="msg.entities?.length" class="entity-tags">
            <span class="entity-label">命中实体：</span>
            <el-tag
              v-for="ent in msg.entities"
              :key="ent.id"
              size="small"
              effect="plain"
              class="entity-tag"
            >
              {{ ent.label }}
            </el-tag>
          </div>
          <div v-if="msg.related_artifacts?.length" class="related-list">
            <span class="related-label">相关文物：</span>
            <div class="related-items">
              <div
                v-for="art in msg.related_artifacts"
                :key="art.id"
                class="related-item"
                @click="emit('artifact-click', art.id)"
              >
                <img :src="art.image_url" :alt="art.name" />
                <span>{{ art.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="message-time">
          {{ formatTime(msg.timestamp) }}
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading" :size="20"><Loading /></el-icon>
      <span>AI 正在思考...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { ChatDotRound, Loading } from '@element-plus/icons-vue'
import type { ChatMessage } from '@/types'

const props = defineProps<{
  messages: ChatMessage[]
  loading: boolean
}>()

const emit = defineEmits<{
  'artifact-click': [id: string]
}>()

const listRef = ref<HTMLDivElement>()

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
})

function avatarStyle(role: string) {
  return role === 'user'
    ? { background: '#409eff', color: '#fff' }
    : { background: '#67c23a', color: '#fff' }
}

function formatContent(content: string) {
  return content.replace(/\n/g, '<br>')
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.welcome-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #c0c4cc;
}

.welcome-msg p {
  margin-top: 16px;
  font-size: 16px;
  color: #909399;
}

.welcome-msg span {
  font-size: 13px;
  margin-top: 4px;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 70%;
}

.message-item.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.7;
}

.message-item.user .message-bubble {
  background: #ecf5ff;
  color: #303133;
  border-top-right-radius: 4px;
}

.message-item.assistant .message-bubble {
  background: #f4f4f5;
  color: #303133;
  border-top-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
  padding: 0 4px;
}

.message-item.user .message-time {
  text-align: right;
}

.cypher-block {
  margin-top: 10px;
  background: #1e1e1e;
  border-radius: 6px;
  padding: 10px 12px;
  overflow-x: auto;
}

.cypher-label {
  font-size: 11px;
  color: #67c23a;
  margin-bottom: 4px;
}

.cypher-block code {
  color: #d4d4d4;
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: pre-wrap;
}

.entity-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.entity-label, .related-label {
  font-size: 12px;
  color: #909399;
}

.entity-tag {
  cursor: default;
}

.related-list {
  margin-top: 10px;
}

.related-items {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  overflow-x: auto;
}

.related-item {
  flex-shrink: 0;
  width: 100px;
  cursor: pointer;
  transition: transform 0.2s;
}

.related-item:hover {
  transform: translateY(-2px);
}

.related-item img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.related-item span {
  display: block;
  font-size: 12px;
  color: #409eff;
  margin-top: 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #909399;
  font-size: 13px;
}
</style>
