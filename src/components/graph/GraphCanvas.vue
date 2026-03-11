<template>
  <div class="graph-canvas-root">
    <!--
      vis-network 独立容器：没有任何 Vue 指令（v-loading / v-show 等）。
      vis-network 完全拥有这个 div 的 DOM 控制权，不与 Vue 虚拟 DOM 冲突。
    -->
    <div ref="networkRef" class="network-container"></div>

    <!-- 加载/空状态覆盖层，z-index 在 network 之上，pointer-events 按需控制 -->
    <div v-if="loading" class="state-overlay">
      <div class="loading-spinner">
        <el-icon class="is-loading" :size="32"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
    </div>
    <div v-else-if="!hasData" class="state-overlay state-empty">
      <el-empty description="请在上方搜索框输入关键词搜索图谱" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, toRaw, nextTick } from 'vue'
import { Network, type Options } from 'vis-network/peer'
import { DataSet } from 'vis-data'
import { Loading } from '@element-plus/icons-vue'
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

const networkRef = ref<HTMLDivElement>()

let network: Network | null = null
let nodeDS: DataSet<VisNode> | null = null
let edgeDS: DataSet<VisEdge> | null = null
let alive = true

const hasData = computed(() => props.nodes.length > 0)

const NET_OPTIONS: Options = {
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
    forceAtlas2Based: {
      gravitationalConstant: -80,
      centralGravity: 0.01,
      springLength: 150,
      springConstant: 0.08,
    },
    stabilization: { iterations: 100 },
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    navigationButtons: true,
    keyboard: false,
    zoomView: true,
    dragView: true,
  },
  layout: { improvedLayout: true },
}

function strip<T>(obj: T): T {
  return JSON.parse(JSON.stringify(toRaw(obj)))
}

function createNetwork() {
  const el = networkRef.value
  if (!el || !alive) return

  nodeDS = new DataSet<VisNode>()
  edgeDS = new DataSet<VisEdge>()

  try {
    network = new Network(el, { nodes: nodeDS, edges: edgeDS }, NET_OPTIONS)
  } catch (e) {
    console.warn('[GraphCanvas] create error:', e)
    return
  }

  network.on('click', (p: { nodes: string[] }) => {
    if (!alive || p.nodes.length === 0) return
    const n = props.nodes.find((v) => v.id === p.nodes[0])
    if (n?.raw) emit('node-click', strip(n.raw))
  })

  network.on('doubleClick', (p: { nodes: string[] }) => {
    if (!alive || p.nodes.length === 0) return
    const n = props.nodes.find((v) => v.id === p.nodes[0])
    if (n?.raw) emit('node-double-click', strip(n.raw))
  })
}

function syncData() {
  if (!nodeDS || !edgeDS || !network || !alive) return
  try {
    // ---- nodes ----
    const curIds = new Set(nodeDS.getIds().map(String))
    const newIds = new Set(props.nodes.map((n) => String(n.id)))

    const rmNodes = [...curIds].filter((id) => !newIds.has(id))
    if (rmNodes.length) nodeDS.remove(rmNodes)

    const addNodes = props.nodes.filter((n) => !curIds.has(String(n.id))).map(strip)
    const updNodes = props.nodes.filter((n) => curIds.has(String(n.id))).map(strip)
    if (addNodes.length) nodeDS.add(addNodes)
    if (updNodes.length) nodeDS.update(updNodes)

    // ---- edges ----
    const curEIds = new Set(edgeDS.getIds().map(String))
    const newEIds = new Set(
      props.edges
        .map((e) => e.id)
        .filter(Boolean)
        .map(String),
    )

    const rmEdges = [...curEIds].filter((id) => !newEIds.has(id))
    if (rmEdges.length) edgeDS.remove(rmEdges)

    const addEdges = props.edges
      .filter((e) => e.id && !curEIds.has(String(e.id)))
      .map(strip)
    if (addEdges.length) edgeDS.add(addEdges)

    if (props.nodes.length > 0) {
      network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } })
    }
  } catch (e) {
    console.warn('[GraphCanvas] syncData error:', e)
  }
}

function destroyNetwork() {
  if (!network) return
  try {
    network.off('click')
    network.off('doubleClick')
    network.destroy()
  } catch (e) {
    console.warn('[GraphCanvas] destroy error:', e)
  }
  network = null
  nodeDS = null
  edgeDS = null
}

watch(
  [() => props.nodes, () => props.edges],
  () => {
    if (alive) nextTick(syncData)
  },
  { deep: true },
)

onMounted(() => {
  alive = true
  createNetwork()
  if (props.nodes.length > 0) nextTick(syncData)
})

onBeforeUnmount(() => {
  alive = false
  destroyNetwork()
})
</script>

<style scoped>
.graph-canvas-root {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
  overflow: hidden;
}

.network-container {
  position: absolute;
  inset: 0;
}

.state-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.88);
  z-index: 20;
}

.state-empty {
  background: #fff;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

.graph-canvas-root :deep(.vis-navigation) {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
