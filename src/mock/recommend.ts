import type { ApiResponse, RecommendItem } from '@/types'

export function mockGetSimilarArtifacts(artifactId: string): ApiResponse<RecommendItem[]> {
  const allRecommends: RecommendItem[] = [
    {
      artifact: {
        id: 'a001',
        name: '清明上河图',
        summary: '北宋张择端所绘风俗画长卷，中国十大传世名画之一。',
        image_url: 'https://picsum.photos/seed/qmsht/400/300',
        dynasty: '北宋',
        category: '中国画',
      },
      reason: '同为北宋时期传世名画',
      score: 0.92,
    },
    {
      artifact: {
        id: 'a006',
        name: '千里江山图',
        summary: '北宋王希孟的青绿山水画巨作，现藏故宫博物院。',
        image_url: 'https://picsum.photos/seed/qljst/400/300',
        dynasty: '北宋',
        category: '中国画',
      },
      reason: '同为故宫馆藏的北宋绘画精品',
      score: 0.88,
    },
    {
      artifact: {
        id: 'a009',
        name: '步辇图',
        summary: '唐代阎立本名作，描绘吐蕃使者朝见唐太宗的历史场景。',
        image_url: 'https://picsum.photos/seed/bnt/400/300',
        dynasty: '唐代',
        category: '中国画',
      },
      reason: '同为传世名画中的人物画精品',
      score: 0.82,
    },
    {
      artifact: {
        id: 'a012',
        name: '富春山居图',
        summary: '元代黄公望创作的纸本水墨画，中国十大传世名画之一。',
        image_url: 'https://picsum.photos/seed/fcsjt/400/300',
        dynasty: '元代',
        category: '中国画',
      },
      reason: '同为十大传世名画之一',
      score: 0.78,
    },
    {
      artifact: {
        id: 'a013',
        name: '司母戊鼎',
        summary: '商代后期青铜器，已知中国古代最重的青铜器。',
        image_url: 'https://picsum.photos/seed/smwd/400/300',
        dynasty: '商代',
        category: '青铜器',
      },
      reason: '同为国家级博物馆镇馆之宝',
      score: 0.65,
    },
  ]
  return {
    code: 0,
    message: 'ok',
    data: allRecommends.filter((r) => r.artifact.id !== artifactId),
  }
}
