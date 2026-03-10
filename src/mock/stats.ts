import type { ApiResponse, StatsOverview } from '@/types'

export function mockGetStatsOverview(): ApiResponse<StatsOverview> {
  return {
    code: 0,
    message: 'ok',
    data: {
      total_nodes: 1256,
      total_edges: 3842,
      total_artifacts: 468,
      entity_type_counts: {
        'Artifact': 468,
        'Person': 215,
        'Dynasty': 18,
        'Museum': 35,
        'Category': 42,
        'Material': 67,
        'Location': 156,
        'Event': 89,
        'Style': 38,
        'Technique': 128,
      },
    },
  }
}
