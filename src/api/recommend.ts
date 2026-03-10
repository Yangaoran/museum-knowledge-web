import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, RecommendItem } from '@/types'

export function getSimilarArtifacts(artifactId: string) {
  if (useMock()) return import('@/mock/recommend').then((m) => m.mockGetSimilarArtifacts(artifactId))
  return request.get<unknown, ApiResponse<RecommendItem[]>>(`/api/v1/recommend/similar/${artifactId}`)
}
