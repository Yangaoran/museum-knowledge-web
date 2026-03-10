import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'graph',
        name: 'Graph',
        component: () => import('@/views/GraphView.vue'),
        meta: { title: '知识图谱' },
      },
      {
        path: 'qa',
        name: 'QA',
        component: () => import('@/views/QAView.vue'),
        meta: { title: '智能问答' },
      },
      {
        path: 'recommend',
        name: 'Recommend',
        component: () => import('@/views/RecommendView.vue'),
        meta: { title: '推荐发现' },
      },
      {
        path: 'artifact/:id',
        name: 'ArtifactDetail',
        component: () => import('@/views/ArtifactDetailView.vue'),
        meta: { title: '文物详情' },
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const title = (to.meta?.title as string) || '博物馆知识图谱'
  document.title = `${title} - 博物馆知识图谱交互系统`
  next()
})

export default router
