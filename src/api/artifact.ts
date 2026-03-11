import request from './request'
import { useMock } from '@/mock'
import type { ApiResponse, Artifact } from '@/types'

export async function getArtifactDetail(artifactId: string): Promise<ApiResponse<Artifact>> {
  if (useMock()) return import('@/mock/artifact').then((m) => m.mockGetArtifactDetail(artifactId))

  const raw: any = await request.get(`/api/v1/artifacts/${artifactId}`)

  const infobox: Record<string, string> = {}
  if (Array.isArray(raw.infobox)) {
    raw.infobox.forEach((item: any) => {
      if (item.name && item.value != null) infobox[item.name] = String(item.value)
    })
  }

  return {
    code: 0,
    message: 'ok',
    data: {
      id: raw.artifact_id,
      name: raw.title ?? '',
      summary: raw.summary ?? '',
      image_url: raw.images?.[0] ?? '',
      images: raw.images ?? [],
      dynasty: infobox['朝代'] ?? infobox['年代'] ?? undefined,
      category: infobox['类别'] ?? infobox['类型'] ?? undefined,
      material: infobox['材质'] ?? undefined,
      source_url: raw.source_url ?? undefined,
      infobox,
      tags: [],
    },
  }
}
