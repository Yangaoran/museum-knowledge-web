<template>
  <div class="page-container home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">博物馆知识图谱交互系统</h1>
        <p class="hero-desc">
          基于知识图谱技术，为您呈现博物馆文物之间的丰富关联。
          通过可视化图谱探索文物关系，借助智能问答获取知识，发现更多精彩文物。
        </p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/graph')">
            <el-icon><Share /></el-icon>
            探索图谱
          </el-button>
          <el-button size="large" @click="$router.push('/qa')">
            <el-icon><ChatDotRound /></el-icon>
            智能问答
          </el-button>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <h2 class="section-title">图谱概览</h2>
      <el-row :gutter="20" class="stats-cards">
        <el-col :xs="12" :sm="6" v-for="item in statsCards" :key="item.label">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" :style="{ background: item.color }">
              <el-icon :size="28"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value.toLocaleString() }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="chart-section">
      <h2 class="section-title">实体类型分布</h2>
      <el-card shadow="hover">
        <div class="chart-container">
          <v-chart :option="chartOption" autoresize style="height: 400px" />
        </div>
      </el-card>
    </section>

    <section class="features-section">
      <h2 class="section-title">功能特色</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8" v-for="feat in features" :key="feat.title">
          <el-card shadow="hover" class="feature-card" @click="$router.push(feat.route)">
            <el-icon :size="40" :style="{ color: feat.color }">
              <component :is="feat.icon" />
            </el-icon>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Share, ChatDotRound, Star, Coin, Connection, User, OfficeBuilding } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getStatsOverview } from '@/api'
import type { StatsOverview } from '@/types'

use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const stats = ref<StatsOverview | null>(null)

const statsCards = computed(() => {
  if (!stats.value) return []
  return [
    { label: '知识节点', value: stats.value.total_nodes, icon: Connection, color: '#409EFF' },
    { label: '关系边', value: stats.value.total_edges, icon: Share, color: '#67C23A' },
    { label: '文物数量', value: stats.value.total_artifacts, icon: Coin, color: '#E6A23C' },
    { label: '实体类型', value: Object.keys(stats.value.entity_type_counts).length, icon: Star, color: '#F56C6C' },
  ]
})

const chartOption = computed(() => {
  if (!stats.value) return {}
  const entries = Object.entries(stats.value.entity_type_counts)
  const colorMap: Record<string, string> = {
    Artifact: '#409EFF', Person: '#67C23A', Dynasty: '#E6A23C',
    Museum: '#F56C6C', Category: '#909399', Material: '#9B59B6',
    Location: '#1ABC9C', Event: '#E74C3C', Style: '#3498DB', Technique: '#F39C12',
  }
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 20, top: 'center' },
    series: [
      {
        name: '实体类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{c}' },
        data: entries.map(([name, value]) => ({
          name,
          value,
          itemStyle: { color: colorMap[name] || '#909399' },
        })),
      },
    ],
  }
})

const features = [
  { title: '知识图谱', desc: '可视化展示文物间的丰富关联关系，支持交互式探索', icon: Share, color: '#409EFF', route: '/graph' },
  { title: '智能问答', desc: '自然语言提问，AI 基于知识图谱为您解答', icon: ChatDotRound, color: '#67C23A', route: '/qa' },
  { title: '推荐发现', desc: '基于知识关联为您推荐相似文物，发现更多精彩', icon: Star, color: '#E6A23C', route: '/recommend' },
]

onMounted(async () => {
  const res = await getStatsOverview()
  stats.value = res.data
})
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 60px 40px;
  margin-bottom: 40px;
  color: #fff;
  text-align: center;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 30px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.hero-actions .el-button {
  padding: 12px 28px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.stats-section {
  margin-bottom: 40px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  width: 100%;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}

.chart-section {
  margin-bottom: 40px;
}

.chart-container {
  padding: 10px;
}

.features-section {
  margin-bottom: 40px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card :deep(.el-card__body) {
  padding: 32px 20px;
}

.feature-card h3 {
  font-size: 18px;
  margin: 16px 0 8px;
  color: #303133;
}

.feature-card p {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
}
</style>
