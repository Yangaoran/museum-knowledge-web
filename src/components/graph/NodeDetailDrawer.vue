<template>
  <el-drawer
    :model-value="visible"
    title="节点详情"
    direction="rtl"
    size="360px"
    @close="emit('close')"
  >
    <template v-if="node">
      <div class="node-detail">
        <div class="node-type-badge" :style="{ background: typeColor }">
          {{ node.type }}
        </div>
        <h3 class="node-name">{{ node.label }}</h3>

        <el-divider />

        <div class="node-props" v-if="node.properties && Object.keys(node.properties).length">
          <h4>属性信息</h4>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item
              v-for="(val, key) in node.properties"
              :key="String(key)"
              :label="String(key)"
            >
              {{ val }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />

        <div class="node-actions">
          <el-button type="primary" @click="emit('expand', node.id)">
            <el-icon><Connection /></el-icon>
            展开邻居节点
          </el-button>
          <el-button
            v-if="node.type === 'Artifact'"
            @click="emit('view-detail', node.id)"
          >
            <el-icon><View /></el-icon>
            查看文物详情
          </el-button>
        </div>
      </div>
    </template>
    <el-empty v-else description="请点击图谱中的节点查看详情" />
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Connection, View } from '@element-plus/icons-vue'
import type { GraphNode } from '@/types'

const props = defineProps<{
  visible: boolean
  node: GraphNode | null
}>()

const emit = defineEmits<{
  close: []
  expand: [nodeId: string]
  'view-detail': [nodeId: string]
}>()

const NODE_COLORS: Record<string, string> = {
  Artifact: '#409EFF', Person: '#67C23A', Dynasty: '#E6A23C',
  Museum: '#F56C6C', Category: '#909399', Material: '#9B59B6',
  Location: '#1ABC9C', Event: '#E74C3C', Style: '#3498DB', Technique: '#F39C12',
}

const typeColor = computed(() => NODE_COLORS[props.node?.type || ''] || '#909399')
</script>

<style scoped>
.node-detail {
  padding: 8px 0;
}

.node-type-badge {
  display: inline-block;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 12px;
}

.node-name {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.node-props h4 {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.node-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.node-actions .el-button {
  width: 100%;
}
</style>
