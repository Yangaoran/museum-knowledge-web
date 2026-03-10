export interface GraphNode {
  id: string
  label: string
  type: string
  properties?: Record<string, unknown>
}

export interface GraphEdge {
  id?: string
  from: string
  to: string
  label: string
  properties?: Record<string, unknown>
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface Artifact {
  id: string
  name: string
  summary: string
  image_url: string
  images?: string[]
  dynasty?: string
  category?: string
  material?: string
  source_url?: string
  infobox?: Record<string, string>
  tags?: string[]
}

export interface SearchResult {
  nodes: GraphNode[]
  edges: GraphEdge[]
  total: number
}

export interface NeighborResult {
  center: GraphNode
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface QARequest {
  question: string
  session_id?: string
}

export interface QAResponse {
  answer: string
  cypher?: string
  entities?: GraphNode[]
  related_artifacts?: Artifact[]
  confidence?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  cypher?: string
  entities?: GraphNode[]
  related_artifacts?: Artifact[]
}

export interface RecommendItem {
  artifact: Artifact
  reason: string
  score: number
}

export interface StatsOverview {
  total_nodes: number
  total_edges: number
  total_artifacts: number
  entity_type_counts: Record<string, number>
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface VisNode {
  id: string | number
  label: string
  color?: string | { background: string; border: string; highlight: { background: string; border: string } }
  shape?: string
  size?: number
  font?: { color: string; size: number }
  title?: string
  group?: string
  raw?: GraphNode
}

export interface VisEdge {
  id?: string
  from: string | number
  to: string | number
  label?: string
  arrows?: string
  color?: string | { color: string; highlight: string }
  font?: { color: string; size: number; align: string }
  raw?: GraphEdge
}
