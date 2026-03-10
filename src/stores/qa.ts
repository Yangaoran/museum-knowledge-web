import { defineStore } from 'pinia'
import { ref } from 'vue'
import { askQuestion } from '@/api'
import type { ChatMessage } from '@/types'

export const useQAStore = defineStore('qa', () => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const sessionId = ref('')

  function addMessage(msg: ChatMessage) {
    messages.value.push(msg)
  }

  async function ask(question: string) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    loading.value = true

    try {
      const res = await askQuestion({ question, session_id: sessionId.value })
      const data = res.data
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-resp`,
        role: 'assistant',
        content: data.answer,
        timestamp: Date.now(),
        cypher: data.cypher,
        entities: data.entities,
        related_artifacts: data.related_artifacts,
      }
      addMessage(assistantMsg)
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: '抱歉，系统处理您的问题时出现了错误，请稍后重试。',
        timestamp: Date.now(),
      }
      addMessage(errorMsg)
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return { messages, loading, sessionId, ask, clearMessages }
})
