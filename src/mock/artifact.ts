import type { ApiResponse, Artifact } from '@/types'

const mockArtifacts: Record<string, Artifact> = {
  a001: {
    id: 'a001',
    name: '清明上河图',
    summary: '《清明上河图》是中国十大传世名画之一，为北宋风俗画，作品以长卷形式生动记录了北宋都城汴京的城市面貌和当时社会各阶层人民的生活状况。',
    image_url: 'https://picsum.photos/seed/qmsht/800/400',
    images: [
      'https://picsum.photos/seed/qmsht1/800/400',
      'https://picsum.photos/seed/qmsht2/800/400',
      'https://picsum.photos/seed/qmsht3/800/400',
    ],
    dynasty: '北宋',
    category: '中国画',
    material: '绢本设色',
    source_url: 'https://zh.wikipedia.org/wiki/清明上河图',
    infobox: {
      '作者': '张择端',
      '年代': '北宋',
      '材质': '绢本设色',
      '尺寸': '24.8×528.7厘米',
      '馆藏': '故宫博物院',
      '类型': '风俗画长卷',
    },
    tags: ['国宝', '十大名画', '北宋', '风俗画'],
  },
  a006: {
    id: 'a006',
    name: '千里江山图',
    summary: '《千里江山图》是北宋王希孟创作的绢本设色画，现收藏于北京故宫博物院。该作品以长卷形式，描绘了连绵的群山冈峦和浩淼的江河湖水。',
    image_url: 'https://picsum.photos/seed/qljst/800/400',
    images: [
      'https://picsum.photos/seed/qljst1/800/400',
      'https://picsum.photos/seed/qljst2/800/400',
    ],
    dynasty: '北宋',
    category: '中国画',
    material: '绢本设色',
    source_url: 'https://zh.wikipedia.org/wiki/千里江山图',
    infobox: {
      '作者': '王希孟',
      '年代': '北宋',
      '材质': '绢本设色',
      '尺寸': '51.5×1191.5厘米',
      '馆藏': '故宫博物院',
    },
    tags: ['国宝', '十大名画', '北宋', '青绿山水'],
  },
  a009: {
    id: 'a009',
    name: '步辇图',
    summary: '《步辇图》是唐代画家阎立本的名作之一，是现藏故宫博物院中国十大传世名画之一。作品描绘了吐蕃使者禄东赞朝见唐太宗的场景。',
    image_url: 'https://picsum.photos/seed/bnt/800/400',
    images: ['https://picsum.photos/seed/bnt1/800/400'],
    dynasty: '唐代',
    category: '中国画',
    material: '绢本设色',
    source_url: 'https://zh.wikipedia.org/wiki/步辇图',
    infobox: {
      '作者': '阎立本',
      '年代': '唐代',
      '材质': '绢本设色',
      '尺寸': '38.5×129.6厘米',
      '馆藏': '故宫博物院',
    },
    tags: ['国宝', '十大名画', '唐代', '人物画'],
  },
  a012: {
    id: 'a012',
    name: '富春山居图',
    summary: '《富春山居图》是元代画家黄公望于1350年创作的纸本水墨画，是中国十大传世名画之一。以浙江富春江为背景，描绘了富春江两岸的初秋景色。',
    image_url: 'https://picsum.photos/seed/fcsjt/800/400',
    images: ['https://picsum.photos/seed/fcsjt1/800/400'],
    dynasty: '元代',
    category: '中国画',
    material: '纸本水墨',
    infobox: {
      '作者': '黄公望',
      '年代': '元代',
      '材质': '纸本水墨',
      '馆藏': '浙江省博物馆 / 台北故宫博物院',
    },
    tags: ['国宝', '十大名画', '元代', '山水画'],
  },
  a013: {
    id: 'a013',
    name: '司母戊鼎',
    summary: '司母戊鼎是商后期（约前14世纪至前11世纪）铸造的青铜器，是已知中国古代最重的青铜器。鼎重达832.84千克，是中国国家博物馆的镇馆之宝。',
    image_url: 'https://picsum.photos/seed/smwd/800/400',
    images: ['https://picsum.photos/seed/smwd1/800/400'],
    dynasty: '商代',
    category: '青铜器',
    material: '青铜',
    source_url: 'https://zh.wikipedia.org/wiki/司母戊鼎',
    infobox: {
      '名称': '司母戊鼎',
      '年代': '商代后期',
      '材质': '青铜',
      '重量': '832.84千克',
      '馆藏': '中国国家博物馆',
    },
    tags: ['国宝', '青铜器', '商代'],
  },
}

export function mockGetArtifactDetail(artifactId: string): ApiResponse<Artifact> {
  const artifact = mockArtifacts[artifactId]
  if (artifact) {
    return { code: 0, message: 'ok', data: artifact }
  }
  return {
    code: 0,
    message: 'ok',
    data: {
      id: artifactId,
      name: '未知文物',
      summary: '暂无简介信息',
      image_url: `https://picsum.photos/seed/${artifactId}/800/400`,
      infobox: {},
    },
  }
}
