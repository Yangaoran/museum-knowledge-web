import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, SearchResult, NeighborResult, GraphNode } from '@/types'

export async function searchGraph(params: { keyword: string; type?: string; limit?: number }): Promise<ApiResponse<SearchResult>> {
  if (useMock()) return import('@/mock/graph').then((m) => m.mockSearchGraph(params))

  const apiParams: Record<string, unknown> = { keyword: params.keyword }
  if (params.type) apiParams.entity_type = params.type
  if (params.limit) apiParams.limit = params.limit

  const raw: any = await request.get('/api/v1/graph/search', { params: apiParams })
  return {
    code: 0,
    message: 'ok',
    data: {
      nodes: (raw.items ?? []).map((n: any): GraphNode => ({
        id: n.id,
        label: n.label,
        type: n.type ?? n.group ?? 'Unknown',
        properties: n.properties,
      })),
      edges: [],
      total: raw.total ?? 0,
    },
  }
}

function mapNode(n: any): GraphNode {
  return {
    id: n.id,
    label: n.label,
    type: n.group ?? n.type ?? 'Unknown',
    properties: n.properties,
  }
}

export async function getNeighbors(artifactId: string): Promise<ApiResponse<NeighborResult>> {
  if (useMock()) return import('@/mock/graph').then((m) => m.mockGetNeighbors(artifactId))

  const raw: any = await request.get(`/api/v1/graph/neighbors/${artifactId}`)
  return {
    code: 0,
    message: 'ok',
    data: {
      center: mapNode(raw.center),
      nodes: (raw.nodes ?? []).map(mapNode),
      edges: (raw.edges ?? []).map((e: any) => ({
        from: e.from,
        to: e.to,
        label: e.label,
      })),
    },
  }
}
