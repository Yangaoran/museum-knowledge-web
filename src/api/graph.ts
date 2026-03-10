import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, SearchResult, NeighborResult } from '@/types'

export function searchGraph(params: { keyword: string; type?: string; limit?: number }) {
  if (useMock()) return import('@/mock/graph').then((m) => m.mockSearchGraph(params))
  return request.get<unknown, ApiResponse<SearchResult>>('/api/v1/graph/search', { params })
}

export function getNeighbors(artifactId: string) {
  if (useMock()) return import('@/mock/graph').then((m) => m.mockGetNeighbors(artifactId))
  return request.get<unknown, ApiResponse<NeighborResult>>(`/api/v1/graph/neighbors/${artifactId}`)
}
