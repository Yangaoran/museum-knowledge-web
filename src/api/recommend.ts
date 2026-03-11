import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, RecommendItem } from '@/types'

export async function getSimilarArtifacts(artifactId: string): Promise<ApiResponse<RecommendItem[]>> {
  if (useMock()) return import('@/mock/recommend').then((m) => m.mockGetSimilarArtifacts(artifactId))

  const raw: any = await request.get(`/api/v1/recommend/similar/${artifactId}`)
  const items: RecommendItem[] = (raw.items ?? []).map((item: any) => ({
    artifact: {
      id: item.artifact_id,
      name: item.title ?? '',
      summary: item.summary ?? '',
      image_url: item.image ?? '',
    },
    reason: item.reason ?? '',
    score: 0.8,
  }))

  return {
    code: 0,
    message: 'ok',
    data: items,
  }
}
