import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, QARequest, QAResponse } from '@/types'

export async function askQuestion(data: QARequest): Promise<ApiResponse<QAResponse>> {
  if (useMock()) return import('@/mock/qa').then((m) => m.mockAskQuestion(data))

  const raw: any = await request.post('/api/v1/qa/ask', { question: data.question })
  return {
    code: 0,
    message: 'ok',
    data: {
      answer: raw.answer ?? '',
      cypher: raw.cypher ?? undefined,
      entities: undefined,
      related_artifacts: (raw.related_artifacts ?? []).map((a: any) => ({
        id: a.artifact_id,
        name: a.title,
        summary: '',
        image_url: '',
      })),
      confidence: undefined,
    },
  }
}
