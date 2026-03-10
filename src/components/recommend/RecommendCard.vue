<template>
  <el-card shadow="hover" class="recommend-card" @click="emit('click')">
    <div class="card-image">
      <img :src="item.artifact.image_url" :alt="item.artifact.name" />
      <div class="score-badge">
        {{ (item.score * 100).toFixed(0) }}%
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ item.artifact.name }}</h3>
      <div class="card-meta">
        <el-tag v-if="item.artifact.dynasty" size="small" effect="plain">{{ item.artifact.dynasty }}</el-tag>
        <el-tag v-if="item.artifact.category" size="small" type="info" effect="plain">{{ item.artifact.category }}</el-tag>
      </div>
      <p class="card-summary">{{ item.artifact.summary }}</p>
      <div class="card-reason">
        <el-icon><InfoFilled /></el-icon>
        <span>{{ item.reason }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import type { RecommendItem } from '@/types'

defineProps<{ item: RecommendItem }>()
const emit = defineEmits<{ click: [] }>()
</script>

<style scoped>
.recommend-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
  overflow: hidden;
}

.recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.recommend-card :deep(.el-card__body) {
  padding: 0;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.recommend-card:hover .card-image img {
  transform: scale(1.05);
}

.score-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(64, 158, 255, 0.9);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.card-meta {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.card-summary {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-reason {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #909399;
  background: #f5f7fa;
  padding: 8px 10px;
  border-radius: 6px;
}

.card-reason .el-icon {
  margin-top: 1px;
  flex-shrink: 0;
}
</style>
