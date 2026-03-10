import type { ApiResponse, QARequest, QAResponse } from '@/types'

const qaData: Record<string, QAResponse> = {
  '清明上河图是谁画的': {
    answer: '《清明上河图》是北宋画家张择端所创作的。张择端，字正道，琅琊东武（今山东诸城）人，是北宋末年杰出的现实主义画家。这幅画是中国十大传世名画之一，生动记录了北宋都城汴京的繁华景象。',
    cypher: "MATCH (a:Artifact {name: '清明上河图'})-[:CREATED_BY]->(p:Person) RETURN p.name",
    entities: [
      { id: 'a001', label: '清明上河图', type: 'Artifact' },
      { id: 'a002', label: '张择端', type: 'Person' },
    ],
    related_artifacts: [
      { id: 'a001', name: '清明上河图', summary: '北宋风俗画长卷', image_url: 'https://picsum.photos/seed/qmsht/400/200' },
    ],
    confidence: 0.95,
  },
  '故宫有哪些名画': {
    answer: '故宫博物院收藏了众多传世名画，包括：\n1. 《清明上河图》- 北宋·张择端\n2. 《千里江山图》- 北宋·王希孟\n3. 《步辇图》- 唐代·阎立本\n\n这些都是中国十大传世名画中的珍品，具有极高的艺术价值和历史价值。',
    cypher: "MATCH (m:Museum {name: '故宫博物院'})<-[:HOUSED_IN]-(a:Artifact) RETURN a.name",
    entities: [
      { id: 'a005', label: '故宫博物院', type: 'Museum' },
      { id: 'a001', label: '清明上河图', type: 'Artifact' },
      { id: 'a006', label: '千里江山图', type: 'Artifact' },
      { id: 'a009', label: '步辇图', type: 'Artifact' },
    ],
    related_artifacts: [
      { id: 'a001', name: '清明上河图', summary: '北宋风俗画长卷', image_url: 'https://picsum.photos/seed/qmsht/400/200' },
      { id: 'a006', name: '千里江山图', summary: '北宋青绿山水画', image_url: 'https://picsum.photos/seed/qljst/400/200' },
      { id: 'a009', name: '步辇图', summary: '唐代人物画', image_url: 'https://picsum.photos/seed/bnt/400/200' },
    ],
    confidence: 0.88,
  },
}

export function mockAskQuestion(data: QARequest): ApiResponse<QAResponse> {
  const matched = Object.entries(qaData).find(([key]) => data.question.includes(key) || key.includes(data.question))
  if (matched) {
    return { code: 0, message: 'ok', data: matched[1] }
  }
  return {
    code: 0,
    message: 'ok',
    data: {
      answer: `关于"${data.question}"的信息，我在知识图谱中进行了检索。目前该问题涉及的知识实体尚未完全收录，建议您尝试以下问题：\n\n1. 清明上河图是谁画的？\n2. 故宫有哪些名画？\n3. 司母戊鼎是什么朝代的？`,
      entities: [],
      related_artifacts: [],
      confidence: 0.3,
    },
  }
}
