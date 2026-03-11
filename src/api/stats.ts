import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, StatsOverview } from '@/types'

export async function getStatsOverview(): Promise<ApiResponse<StatsOverview>> {
  if (useMock()) return import('@/mock/stats').then((m) => m.mockGetStatsOverview())

  const raw: any = await request.get('/api/v1/stats/overview')
  return {
    code: 0,
    message: 'ok',
    data: {
      total_nodes: raw.total_nodes ?? 0,
      total_edges: raw.total_relationships ?? 0,
      total_artifacts: raw.nodes_by_label?.Artifact ?? 0,
      entity_type_counts: raw.nodes_by_label ?? {},
    },
  }
}
