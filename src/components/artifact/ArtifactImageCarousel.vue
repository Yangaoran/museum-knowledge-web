<template>
  <el-card shadow="never" class="carousel-card">
    <el-carousel
      v-if="images.length > 0"
      :interval="5000"
      height="400px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="(img, index) in images" :key="index">
        <img :src="img" alt="文物图片" class="carousel-img" />
      </el-carousel-item>
    </el-carousel>
    <el-empty v-else description="暂无图片" style="height: 300px" />
  </el-card>
</template>

<script setup lang="ts">
defineProps<{ images: string[] }>()
</script>

<style scoped>
.carousel-card {
  margin-bottom: 20px;
  overflow: hidden;
}

.carousel-card :deep(.el-card__body) {
  padding: 0;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
