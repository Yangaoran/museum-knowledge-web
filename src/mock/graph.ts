import type { ApiResponse, SearchResult, NeighborResult } from '@/types'

const mockNodes = [
  { id: 'a001', label: '清明上河图', type: 'Artifact', properties: { dynasty: '北宋', author: '张择端' } },
  { id: 'a002', label: '张择端', type: 'Person', properties: { dynasty: '北宋', role: '画家' } },
  { id: 'a003', label: '北宋', type: 'Dynasty', properties: { start_year: '960', end_year: '1127' } },
  { id: 'a004', label: '绢本设色', type: 'Material', properties: {} },
  { id: 'a005', label: '故宫博物院', type: 'Museum', properties: { location: '北京' } },
  { id: 'a006', label: '千里江山图', type: 'Artifact', properties: { dynasty: '北宋', author: '王希孟' } },
  { id: 'a007', label: '王希孟', type: 'Person', properties: { dynasty: '北宋', role: '画家' } },
  { id: 'a008', label: '中国画', type: 'Category', properties: {} },
  { id: 'a009', label: '步辇图', type: 'Artifact', properties: { dynasty: '唐代', author: '阎立本' } },
  { id: 'a010', label: '阎立本', type: 'Person', properties: { dynasty: '唐代', role: '画家' } },
  { id: 'a011', label: '唐代', type: 'Dynasty', properties: { start_year: '618', end_year: '907' } },
  { id: 'a012', label: '富春山居图', type: 'Artifact', properties: { dynasty: '元代', author: '黄公望' } },
  { id: 'a013', label: '司母戊鼎', type: 'Artifact', properties: { dynasty: '商代', material: '青铜' } },
  { id: 'a014', label: '商代', type: 'Dynasty', properties: { start_year: '约前1600', end_year: '约前1046' } },
  { id: 'a015', label: '青铜器', type: 'Category', properties: {} },
]

const mockEdges = [
  { from: 'a001', to: 'a002', label: '创作者' },
  { from: 'a001', to: 'a003', label: '所属朝代' },
  { from: 'a001', to: 'a004', label: '材质' },
  { from: 'a001', to: 'a005', label: '馆藏于' },
  { from: 'a001', to: 'a008', label: '类别' },
  { from: 'a006', to: 'a007', label: '创作者' },
  { from: 'a006', to: 'a003', label: '所属朝代' },
  { from: 'a006', to: 'a005', label: '馆藏于' },
  { from: 'a006', to: 'a008', label: '类别' },
  { from: 'a009', to: 'a010', label: '创作者' },
  { from: 'a009', to: 'a011', label: '所属朝代' },
  { from: 'a009', to: 'a005', label: '馆藏于' },
  { from: 'a013', to: 'a014', label: '所属朝代' },
  { from: 'a013', to: 'a015', label: '类别' },
]

export function mockSearchGraph(params: { keyword: string }): ApiResponse<SearchResult> {
  const keyword = params.keyword.toLowerCase()
  const matchedNodes = mockNodes.filter(
    (n) => n.label.toLowerCase().includes(keyword) || n.type.toLowerCase().includes(keyword),
  )
  const nodeIds = new Set(matchedNodes.map((n) => n.id))
  const relatedEdges = mockEdges.filter((e) => nodeIds.has(e.from) || nodeIds.has(e.to))
  relatedEdges.forEach((e) => {
    const fromNode = mockNodes.find((n) => n.id === e.from)
    const toNode = mockNodes.find((n) => n.id === e.to)
    if (fromNode) nodeIds.add(fromNode.id)
    if (toNode) nodeIds.add(toNode.id)
  })
  const allNodes = mockNodes.filter((n) => nodeIds.has(n.id))
  return { code: 0, message: 'ok', data: { nodes: allNodes, edges: relatedEdges, total: allNodes.length } }
}

export function mockGetNeighbors(artifactId: string): ApiResponse<NeighborResult> {
  const center = mockNodes.find((n) => n.id === artifactId) || mockNodes[0]
  const relatedEdges = mockEdges.filter((e) => e.from === artifactId || e.to === artifactId)
  const neighborIds = new Set<string>()
  relatedEdges.forEach((e) => {
    neighborIds.add(e.from)
    neighborIds.add(e.to)
  })
  neighborIds.delete(artifactId)
  const neighbors = mockNodes.filter((n) => neighborIds.has(n.id))
  return { code: 0, message: 'ok', data: { center, nodes: neighbors, edges: relatedEdges } }
}
