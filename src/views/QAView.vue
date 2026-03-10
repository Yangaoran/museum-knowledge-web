<template>
  <div class="page-container qa-page">
    <div class="qa-layout">
      <div class="qa-main">
        <el-card shadow="never" class="chat-card">
          <template #header>
            <div class="chat-header">
              <el-icon :size="20"><ChatDotRound /></el-icon>
              <span>智能问答</span>
              <el-button text type="danger" size="small" @click="qaStore.clearMessages()">
                清空对话
              </el-button>
            </div>
          </template>
          <ChatMessageList :messages="qaStore.messages" :loading="qaStore.loading" @artifact-click="goArtifact" />
          <div class="chat-input-area">
            <ChatInput :loading="qaStore.loading" @send="handleSend" />
          </div>
        </el-card>
      </div>

      <div class="qa-sidebar">
        <el-card shadow="never" class="suggest-card">
          <template #header>
            <span>推荐问题</span>
          </template>
          <div class="suggest-list">
            <el-tag
              v-for="q in suggestedQuestions"
              :key="q"
              class="suggest-tag"
              effect="plain"
              @click="handleSuggestClick(q)"
            >
              {{ q }}
            </el-tag>
          </div>
        </el-card>
        <el-card shadow="never" class="tips-card">
          <template #header>
            <span>使用提示</span>
          </template>
          <ul class="tips-list">
            <li>可以询问文物的作者、年代、材质等信息</li>
            <li>支持查询博物馆馆藏</li>
            <li>可以询问文物之间的关系</li>
            <li>点击回答中的文物名可查看详情</li>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChatDotRound } from '@element-plus/icons-vue'
import { useQAStore } from '@/stores'
import ChatMessageList from '@/components/qa/ChatMessageList.vue'
import ChatInput from '@/components/qa/ChatInput.vue'

const router = useRouter()
const qaStore = useQAStore()

const suggestedQuestions = [
  '清明上河图是谁画的？',
  '故宫有哪些名画？',
  '司母戊鼎是什么朝代的？',
  '千里江山图有多大？',
  '北宋有哪些著名画家？',
  '哪些文物是绢本设色？',
]

function handleSend(question: string) {
  qaStore.ask(question)
}

function handleSuggestClick(q: string) {
  qaStore.ask(q)
}

function goArtifact(id: string) {
  router.push(`/artifact/${id}`)
}
</script>

<style scoped>
.qa-page {
  height: calc(100vh - 140px);
}

.qa-layout {
  display: flex;
  gap: 20px;
  height: 100%;
}

.qa-main {
  flex: 1;
  min-width: 0;
}

.chat-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-header .el-button {
  margin-left: auto;
}

.chat-input-area {
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}

.qa-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggest-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.suggest-tag:hover {
  color: #409eff;
  border-color: #409eff;
}

.tips-list {
  padding-left: 16px;
  font-size: 13px;
  color: #606266;
  line-height: 2;
}

@media (max-width: 768px) {
  .qa-layout {
    flex-direction: column;
  }
  .qa-sidebar {
    width: 100%;
  }
}
</style>
