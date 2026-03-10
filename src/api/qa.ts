import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, QARequest, QAResponse } from '@/types'

export function askQuestion(data: QARequest) {
  if (useMock()) return import('@/mock/qa').then((m) => m.mockAskQuestion(data))
  return request.post<unknown, ApiResponse<QAResponse>>('/api/v1/qa/ask', data)
}
