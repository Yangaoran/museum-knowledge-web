<template>
  <div class="page-container recommend-page">
    <h1 class="page-title">推荐发现</h1>
    <p class="page-subtitle">基于知识图谱关联关系，为您推荐精彩文物</p>

    <el-skeleton :loading="loading" animated :count="4">
      <template #template>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="i in 4" :key="i">
            <el-card>
              <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
              <div style="padding: 14px">
                <el-skeleton-item variant="h3" style="width: 60%" />
                <el-skeleton-item variant="text" style="margin-top: 10px" />
                <el-skeleton-item variant="text" style="width: 80%" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>

      <el-row :gutter="20">
        <el-col
          :xs="24" :sm="12" :md="8" :lg="6"
          v-for="item in recommends"
          :key="item.artifact.id"
        >
          <RecommendCard :item="item" @click="goDetail(item.artifact.id)" />
        </el-col>
      </el-row>
    </el-skeleton>

    <el-empty v-if="!loading && recommends.length === 0" description="暂无推荐数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSimilarArtifacts } from '@/api'
import type { RecommendItem } from '@/types'
import RecommendCard from '@/components/recommend/RecommendCard.vue'

const router = useRouter()
const recommends = ref<RecommendItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getSimilarArtifacts('a001')
    recommends.value = res.data
  } finally {
    loading.value = false
  }
})

function goDetail(id: string) {
  router.push(`/artifact/${id}`)
}
</script>

<style scoped>
.recommend-page {
  padding-bottom: 40px;
}
</style>
