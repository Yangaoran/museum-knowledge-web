import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, StatsOverview } from '@/types'

export function getStatsOverview() {
  if (useMock()) return import('@/mock/stats').then((m) => m.mockGetStatsOverview())
  return request.get<unknown, ApiResponse<StatsOverview>>('/api/v1/stats/overview')
}
