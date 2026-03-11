import { defineStore } from 'pinia'
import { ref } from 'vue'
import { searchGraph, getNeighbors } from '@/api'
import type { GraphNode, GraphEdge, VisNode, VisEdge } from '@/types'
import { ElMessage } from 'element-plus'

const NODE_COLORS: Record<string, { background: string; border: string }> = {
  Artifact: { background: '#409EFF', border: '#337ecc' },
  Person: { background: '#67C23A', border: '#529b2e' },
  Dynasty: { background: '#E6A23C', border: '#b88230' },
  Museum: { background: '#F56C6C', border: '#c45656' },
  Category: { background: '#909399', border: '#73767a' },
  Material: { background: '#9B59B6', border: '#7D3C98' },
  Location: { background: '#1ABC9C', border: '#16A085' },
  Event: { background: '#E74C3C', border: '#C0392B' },
  Style: { background: '#3498DB', border: '#2980B9' },
  Technique: { background: '#F39C12', border: '#D68910' },
}

function toVisNode(node: GraphNode): VisNode {
  const colors = NODE_COLORS[node.type] || { background: '#909399', border: '#73767a' }
  return {
    id: node.id,
    label: node.label,
    color: {
      background: colors.background,
      border: colors.border,
      highlight: { background: colors.background, border: '#000' },
    },
    shape: node.type === 'Artifact' ? 'dot' : 'diamond',
    size: node.type === 'Artifact' ? 25 : 15,
    font: { color: '#333', size: 14 },
    title: `${node.type}: ${node.label}`,
    group: node.type,
    raw: node,
  }
}

function toVisEdge(edge: GraphEdge, index: number): VisEdge {
  return {
    id: `e-${index}-${edge.from}-${edge.to}`,
    from: edge.from,
    to: edge.to,
    label: edge.label,
    arrows: 'to',
    color: { color: '#b0b0b0', highlight: '#409EFF' },
    font: { color: '#666', size: 11, align: 'middle' },
    raw: edge,
  }
}

export const useGraphStore = defineStore('graph', () => {
  const nodes = ref<VisNode[]>([])
  const edges = ref<VisEdge[]>([])
  const loading = ref(false)
  const selectedNode = ref<GraphNode | null>(null)
  const keyword = ref('')

  async function search(kw: string, type?: string) {
    loading.value = true
    keyword.value = kw
    try {
      const res = await searchGraph({ keyword: kw, type: type || undefined, limit: 50 })
      const data = res.data
      nodes.value = data.nodes.map(toVisNode)
      edges.value = data.edges.map(toVisEdge)
    } catch (e: any) {
      ElMessage.error(e?.message || '图谱搜索失败')
      nodes.value = []
      edges.value = []
    } finally {
      loading.value = false
    }
  }

  async function expandNeighbors(nodeId: string) {
    loading.value = true
    try {
      const res = await getNeighbors(nodeId)
      const data = res.data
      const existingIds = new Set(nodes.value.map((n) => n.id))
      data.nodes.forEach((n) => {
        if (!existingIds.has(n.id)) {
          nodes.value.push(toVisNode(n))
          existingIds.add(n.id)
        }
      })
      const existingEdgeIds = new Set(edges.value.map((e) => `${e.from}-${e.to}`))
      data.edges.forEach((e, i) => {
        const edgeKey = `${e.from}-${e.to}`
        if (!existingEdgeIds.has(edgeKey)) {
          edges.value.push(toVisEdge(e, edges.value.length + i))
          existingEdgeIds.add(edgeKey)
        }
      })
    } catch (e: any) {
      ElMessage.error(e?.message || '扩展邻居节点失败')
    } finally {
      loading.value = false
    }
  }

  function selectNode(node: GraphNode | null) {
    selectedNode.value = node
  }

  function clearGraph() {
    nodes.value = []
    edges.value = []
    selectedNode.value = null
  }

  return { nodes, edges, loading, selectedNode, keyword, search, expandNeighbors, selectNode, clearGraph }
})

export { NODE_COLORS }
