<template>
  <div class="relation-graph" ref="graphRef" v-loading="loading"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Network, type Options } from 'vis-network/peer'
import { DataSet } from 'vis-data'
import { getNeighbors } from '@/api'
import type { VisNode, VisEdge } from '@/types'

const props = defineProps<{ artifactId: string }>()

const graphRef = ref<HTMLDivElement>()
const loading = ref(true)
let network: Network | null = null

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

const options: Options = {
  nodes: {
    borderWidth: 2,
    font: { size: 12, face: 'Microsoft YaHei, sans-serif' },
  },
  edges: {
    width: 1,
    arrows: 'to',
    font: { size: 10, face: 'Microsoft YaHei, sans-serif', strokeWidth: 2, strokeColor: '#fff' },
    smooth: { type: 'continuous', roundness: 0.2 },
  },
  physics: {
    solver: 'forceAtlas2Based',
    forceAtlas2Based: { gravitationalConstant: -50, springLength: 100 },
    stabilization: { iterations: 80 },
  },
  interaction: { zoomView: true, dragView: true },
}

onMounted(async () => {
  try {
    const res = await getNeighbors(props.artifactId)
    const data = res.data

    const allNodes = [data.center, ...data.nodes]
    const visNodes: VisNode[] = allNodes.map((n) => {
      const c = NODE_COLORS[n.type] || { background: '#909399', border: '#73767a' }
      return {
        id: n.id,
        label: n.label,
        color: { background: c.background, border: c.border, highlight: { background: c.background, border: '#000' } },
        shape: n.type === 'Artifact' ? 'dot' : 'diamond',
        size: n.id === props.artifactId ? 22 : 14,
        font: { color: '#333', size: 12 },
        group: n.type,
      }
    })

    const visEdges: VisEdge[] = data.edges.map((e, i) => ({
      id: `re-${i}`,
      from: e.from,
      to: e.to,
      label: e.label,
      color: { color: '#b0b0b0', highlight: '#409EFF' },
      font: { color: '#666', size: 10, align: 'middle' },
    }))

    if (graphRef.value) {
      network = new Network(
        graphRef.value,
        { nodes: new DataSet(visNodes), edges: new DataSet(visEdges) },
        options,
      )
    }
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  network?.destroy()
  network = null
})
</script>

<style scoped>
.relation-graph {
  width: 100%;
  height: 350px;
}
</style>
