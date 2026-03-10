import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, Artifact } from '@/types'

export function getArtifactDetail(artifactId: string) {
  if (useMock()) return import('@/mock/artifact').then((m) => m.mockGetArtifactDetail(artifactId))
  return request.get<unknown, ApiResponse<Artifact>>(`/api/v1/artifacts/${artifactId}`)
}
