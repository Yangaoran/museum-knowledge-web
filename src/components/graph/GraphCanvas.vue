<template>
  <div class="graph-canvas" ref="containerRef" v-loading="loading" element-loading-text="加载中...">
    <div v-if="!hasData && !loading" class="empty-tip">
      <el-empty description="请在上方搜索框输入关键词搜索图谱" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { Network, type Options } from 'vis-network/peer'
import { DataSet } from 'vis-data'
import type { VisNode, VisEdge, GraphNode } from '@/types'

const props = defineProps<{
  nodes: VisNode[]
  edges: VisEdge[]
  loading: boolean
}>()

const emit = defineEmits<{
  'node-click': [node: GraphNode]
  'node-double-click': [node: GraphNode]
}>()

const containerRef = ref<HTMLDivElement>()
let network: Network | null = null
let nodesDataSet: DataSet<VisNode> | null = null
let edgesDataSet: DataSet<VisEdge> | null = null

const hasData = computed(() => props.nodes.length > 0)

const networkOptions: Options = {
  nodes: {
    borderWidth: 2,
    shadow: { enabled: true, color: 'rgba(0,0,0,0.1)', size: 8, x: 2, y: 2 },
    font: { face: 'Microsoft YaHei, sans-serif' },
  },
  edges: {
    width: 1.5,
    smooth: { type: 'continuous', roundness: 0.2 },
    font: { face: 'Microsoft YaHei, sans-serif', strokeWidth: 3, strokeColor: '#fff' },
  },
  physics: {
    solver: 'forceAtlas2Based',
    forceAtlas2Based: { gravitationalConstant: -80, centralGravity: 0.01, springLength: 150, springConstant: 0.08 },
    stabilization: { iterations: 100 },
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    navigationButtons: true,
    keyboard: true,
    zoomView: true,
    dragView: true,
  },
  layout: { improvedLayout: true },
}

function initNetwork() {
  if (!containerRef.value) return
  nodesDataSet = new DataSet<VisNode>()
  edgesDataSet = new DataSet<VisEdge>()
  network = new Network(containerRef.value, { nodes: nodesDataSet, edges: edgesDataSet }, networkOptions)

  network.on('click', (params: { nodes: string[] }) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]
      const node = props.nodes.find((n) => n.id === nodeId)
      if (node?.raw) emit('node-click', node.raw)
    }
  })

  network.on('doubleClick', (params: { nodes: string[] }) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0]
      const node = props.nodes.find((n) => n.id === nodeId)
      if (node?.raw) emit('node-double-click', node.raw)
    }
  })
}

function updateData() {
  if (!nodesDataSet || !edgesDataSet) return

  const currentNodeIds = new Set(nodesDataSet.getIds().map(String))
  const newNodeIds = new Set(props.nodes.map((n) => String(n.id)))

  const toRemoveNodes = [...currentNodeIds].filter((id) => !newNodeIds.has(id))
  if (toRemoveNodes.length) nodesDataSet.remove(toRemoveNodes)

  const toAddNodes = props.nodes.filter((n) => !currentNodeIds.has(String(n.id)))
  const toUpdateNodes = props.nodes.filter((n) => currentNodeIds.has(String(n.id)))
  if (toAddNodes.length) nodesDataSet.add(toAddNodes)
  if (toUpdateNodes.length) nodesDataSet.update(toUpdateNodes)

  const currentEdgeIds = new Set(edgesDataSet.getIds().map(String))
  const newEdgeIds = new Set(props.edges.map((e) => e.id).filter(Boolean).map(String))

  const toRemoveEdges = [...currentEdgeIds].filter((id) => !newEdgeIds.has(id))
  if (toRemoveEdges.length) edgesDataSet.remove(toRemoveEdges)

  const toAddEdges = props.edges.filter((e) => e.id && !currentEdgeIds.has(String(e.id)))
  if (toAddEdges.length) edgesDataSet.add(toAddEdges)

  if (props.nodes.length > 0 && network) {
    network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } })
  }
}

watch([() => props.nodes, () => props.edges], updateData, { deep: true })

onMounted(() => {
  initNetwork()
})

onBeforeUnmount(() => {
  network?.destroy()
  network = null
})
</script>

<style scoped>
.graph-canvas {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
}

.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.graph-canvas :deep(.vis-navigation) {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
