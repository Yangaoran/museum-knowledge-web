<template>
  <div class="page-container graph-page">
    <div class="graph-toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索文物名称、人物、朝代..."
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch" :loading="graphStore.loading">
        搜索
      </el-button>
      <el-select v-model="filterType" placeholder="筛选类型" clearable class="filter-select">
        <el-option
          v-for="t in entityTypes"
          :key="t.value"
          :label="t.label"
          :value="t.value"
        />
      </el-select>
      <el-button @click="handleClear">清空</el-button>
    </div>

    <div class="graph-content">
      <div class="graph-canvas-wrapper">
        <GraphCanvas
          :nodes="graphStore.nodes"
          :edges="graphStore.edges"
          :loading="graphStore.loading"
          @node-click="handleNodeClick"
          @node-double-click="handleNodeDoubleClick"
        />
        <div class="graph-legend">
          <div
            v-for="(color, type) in legendItems"
            :key="type"
            class="legend-item"
          >
            <span class="legend-dot" :style="{ background: color }"></span>
            <span>{{ type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer 放在页面根级，使用 v-model:visible 双向绑定 -->
    <NodeDetailDrawer
      v-model:visible="drawerVisible"
      :node="graphStore.selectedNode"
      @expand="handleExpand"
      @view-detail="handleViewDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useGraphStore, NODE_COLORS } from '@/stores'
import GraphCanvas from '@/components/graph/GraphCanvas.vue'
import NodeDetailDrawer from '@/components/graph/NodeDetailDrawer.vue'
import type { GraphNode } from '@/types'

const router = useRouter()
const graphStore = useGraphStore()

const searchKeyword = ref('清明上河图')
const filterType = ref('')
const drawerVisible = ref(false)

const entityTypes = [
  { label: '文物', value: 'Artifact' },
  { label: '人物', value: 'Person' },
  { label: '朝代', value: 'Dynasty' },
  { label: '博物馆', value: 'Museum' },
  { label: '类别', value: 'Category' },
  { label: '材质', value: 'Material' },
]

const legendItems = computed(() => {
  const items: Record<string, string> = {}
  for (const [type, colors] of Object.entries(NODE_COLORS)) {
    items[type] = colors.background
  }
  return items
})

function handleSearch() {
  const kw = searchKeyword.value.trim()
  if (!kw) return
  drawerVisible.value = false
  graphStore.search(kw, filterType.value || undefined)
}

function handleNodeClick(node: GraphNode) {
  graphStore.selectNode(node)
  drawerVisible.value = true
}

function handleNodeDoubleClick(node: GraphNode) {
  graphStore.expandNeighbors(node.id)
}

function handleExpand(nodeId: string) {
  graphStore.expandNeighbors(nodeId)
}

function handleViewDetail(nodeId: string) {
  drawerVisible.value = false
  router.push(`/artifact/${nodeId}`).catch(() => {})
}

function handleClear() {
  drawerVisible.value = false
  graphStore.clearGraph()
}

onBeforeUnmount(() => {
  drawerVisible.value = false
})
</script>

<style scoped>
.graph-page {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.graph-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 320px;
}

.filter-select {
  width: 150px;
}

.graph-content {
  flex: 1;
  display: flex;
  gap: 0;
  min-height: 0;
  position: relative;
}

.graph-canvas-wrapper {
  flex: 1;
  position: relative;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.graph-legend {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
