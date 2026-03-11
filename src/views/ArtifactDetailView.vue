<template>
  <div class="page-container detail-page" v-loading="loading">
    <el-page-header @back="$router.back()" class="detail-header">
      <template #content>
        <span class="detail-header-title">{{ artifact?.name || '文物详情' }}</span>
      </template>
    </el-page-header>

    <template v-if="artifact">
      <el-row :gutter="24" class="detail-body">
        <el-col :xs="24" :md="14">
          <ArtifactImageCarousel :images="allImages" />

          <el-card shadow="never" class="info-card">
            <template #header>
              <span class="card-title">基本信息</span>
            </template>
            <p class="artifact-summary">{{ artifact.summary }}</p>
            <el-descriptions :column="2" border size="default" class="info-descriptions">
              <el-descriptions-item
                v-for="(val, key) in artifact.infobox"
                :key="key"
                :label="String(key)"
              >
                {{ val }}
              </el-descriptions-item>
            </el-descriptions>
            <div class="tag-row" v-if="artifact.tags?.length">
              <el-tag v-for="tag in artifact.tags" :key="tag" effect="plain" size="small">
                {{ tag }}
              </el-tag>
            </div>
          </el-card>

          <el-card shadow="never" class="info-card" v-if="artifact.source_url">
            <template #header>
              <span class="card-title">来源链接</span>
            </template>
            <el-link :href="artifact.source_url" target="_blank" type="primary">
              {{ artifact.source_url }}
            </el-link>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="10">
          <el-card shadow="never" class="info-card">
            <template #header>
              <span class="card-title">知识图谱关系</span>
            </template>
            <ArtifactRelationGraph :artifact-id="id" />
          </el-card>

          <el-card shadow="never" class="info-card">
            <template #header>
              <span class="card-title">相关推荐</span>
            </template>
            <ArtifactRelatedList :artifact-id="id" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <el-empty v-if="!loading && !artifact" description="未找到文物信息" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArtifactDetail } from '@/api'
import type { Artifact } from '@/types'
import ArtifactImageCarousel from '@/components/artifact/ArtifactImageCarousel.vue'
import ArtifactRelationGraph from '@/components/artifact/ArtifactRelationGraph.vue'
import ArtifactRelatedList from '@/components/artifact/ArtifactRelatedList.vue'

const props = defineProps<{ id: string }>()
const route = useRoute()
const artifact = ref<Artifact | null>(null)
const loading = ref(true)

const allImages = computed(() => {
  if (!artifact.value) return []
  return artifact.value.images?.length ? artifact.value.images : [artifact.value.image_url]
})

async function fetchDetail() {
  loading.value = true
  try {
    const res = await getArtifactDetail(props.id)
    artifact.value = res.data
  } catch {
    artifact.value = null
  } finally {
    loading.value = false
  }
}

watch(() => props.id, fetchDetail)
onMounted(fetchDetail)
</script>

<style scoped>
.detail-page {
  padding-bottom: 40px;
}

.detail-header {
  margin-bottom: 24px;
}

.detail-header-title {
  font-size: 20px;
  font-weight: 600;
}

.detail-body {
  margin-top: 8px;
}

.info-card {
  margin-bottom: 20px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
}

.artifact-summary {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 20px;
}

.info-descriptions {
  margin-bottom: 16px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
