<template>
  <div class="related-list" v-loading="loading">
    <div
      v-for="item in recommends"
      :key="item.artifact.id"
      class="related-item"
      @click="goDetail(item.artifact.id)"
    >
      <img :src="item.artifact.image_url" :alt="item.artifact.name" class="related-img" />
      <div class="related-info">
        <h4>{{ item.artifact.name }}</h4>
        <p>{{ item.reason }}</p>
      </div>
      <el-icon class="arrow-icon"><ArrowRight /></el-icon>
    </div>
    <el-empty v-if="!loading && recommends.length === 0" description="暂无相关推荐" :image-size="60" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { getSimilarArtifacts } from '@/api'
import type { RecommendItem } from '@/types'

const props = defineProps<{ artifactId: string }>()
const router = useRouter()
const recommends = ref<RecommendItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getSimilarArtifacts(props.artifactId)
    recommends.value = res.data.slice(0, 5)
  } finally {
    loading.value = false
  }
})

function goDetail(id: string) {
  router.push(`/artifact/${id}`)
}
</script>

<style scoped>
.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.related-item:last-child {
  border-bottom: none;
}

.related-item:hover {
  background: #f5f7fa;
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 8px;
}

.related-img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-info h4 {
  font-size: 14px;
  color: #303133;
  margin-bottom: 2px;
}

.related-info p {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  color: #c0c4cc;
  flex-shrink: 0;
}
</style>
