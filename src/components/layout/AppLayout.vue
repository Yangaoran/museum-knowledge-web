<template>
  <el-container class="app-layout">
    <el-header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <el-icon :size="24"><Connection /></el-icon>
          <span class="logo-text">博物馆知识图谱</span>
        </router-link>
      </div>
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        :ellipsis="false"
        class="header-menu"
        router
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/graph">
          <el-icon><Share /></el-icon>
          <span>知识图谱</span>
        </el-menu-item>
        <el-menu-item index="/qa">
          <el-icon><ChatDotRound /></el-icon>
          <span>智能问答</span>
        </el-menu-item>
        <el-menu-item index="/recommend">
          <el-icon><Star /></el-icon>
          <span>推荐发现</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="app-main">
      <router-view />
    </el-main>
    <el-footer class="app-footer">
      <span>博物馆知识图谱交互系统 &copy; 2026 毕业设计</span>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Share, ChatDotRound, Star, Connection } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => {
  if (route.path.startsWith('/graph')) return '/graph'
  if (route.path.startsWith('/qa')) return '/qa'
  if (route.path.startsWith('/recommend')) return '/recommend'
  return '/'
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  z-index: 100;
  height: 60px;
}

.header-left {
  margin-right: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #303133;
  font-weight: 600;
  font-size: 18px;
  white-space: nowrap;
}

.logo .el-icon {
  color: #409eff;
}

.logo-text {
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-menu {
  border-bottom: none !important;
  flex: 1;
}

.header-menu .el-menu-item {
  font-size: 14px;
}

.app-main {
  padding: 20px;
  min-height: calc(100vh - 60px - 60px);
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 13px;
  height: 60px;
  background: #fff;
  border-top: 1px solid #ebeef5;
}
</style>
