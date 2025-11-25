export const mockFeedbackData = {
  sessionId: 987,
  feedbackId: 4321,

  spmScore: 72,
  fillerScore: 81,
  repeatScore: 65,
  silenceScore: 88,
  accuracyScore: 90,
  totalScore: 78,
  grade: "B",
  totalDurationSeconds: 284.7,

  history: [
    {
      sessionId: 950,
      practicedAt: "2025-11-14T13:20:00",
      totalScore: 74,
    },
    {
      sessionId: 960,
      practicedAt: "2025-11-15T10:00:00",
      totalScore: 77,
    },
  ],

  slideFeedbacks: [
    {
      slideNumber: 1,
      timestampSeconds: 10.2,
      slideText: "안녕하세요. 오늘 발표를 시작하겠습니다.",
      thumbnailUrl: "/api/files/2025abcd/page/1",
      thumbnailBase64: null,

      issues: [
        {
          issueType: "SPEED",
          spmUser: 330,
          spmAverage: 290,
          comment: "발표 초반 속도가 다소 빠르게 측정되었습니다.",
        },
      ],
    },

    {
      slideNumber: 2,
      timestampSeconds: 42.8,
      slideText:
        "타당성 분석은 크게 음 네 가지 요소로 구성됩니다. 그리고 음 시장성, 그거 기술성, 재무성, 조직 역량입니다.",
      thumbnailUrl: "/api/files/2025abcd/page/2",
      thumbnailBase64: null,

      issues: [
        {
          issueType: "FILLER",
          fillerCount: 3,
          fillerDetail: { 음: 2, 그거: 1 },
          comment:
            "필러가 세 번 감지되었습니다. 문장 사이 호흡 조절을 해보세요.",
        },
        {
          issueType: "REPETITION",
          repeatCount: 2,
          repeatDetail: { 그리고: 1 },
          comment: "반복되는 연결 어구가 나타났습니다.",
        },
      ],
    },

    {
      slideNumber: 3,
      timestampSeconds: 95.2,
      slideText: "여기에서 가장 중요한 핵심은 데이터의 정확성입니다.",
      thumbnailUrl: "/api/files/2025abcd/page/3",
      thumbnailBase64: null,

      issues: [
        {
          issueType: "ACCURACY",
          errorCount: 1,
          comment: "스크립트와 다른 문장이 1회 감지되었습니다.",
        },
      ],
    },

    {
      slideNumber: 4,
      timestampSeconds: 131.4,
      slideText:
        "따라서 분석은 단순한 검토가 아니라 실행 여부를 결정하는 기준이 됩니다.",
      thumbnailUrl: "/api/files/2025abcd/page/4",
      thumbnailBase64: null,

      issues: [
        {
          issueType: "SILENCE",
          silenceCount: 2,
          totalSilenceDuration: 1.8,
          comment: "두 차례 짧은 공백이 감지되었습니다.",
        },
      ],
    },

    {
      slideNumber: 5,
      timestampSeconds: 170.0,
      slideText: "이제 결론 부분을 말씀드리겠습니다.",
      thumbnailUrl: "/api/files/2025abcd/page/5",
      thumbnailBase64: null,

      issues: [],
    },
  ],

  aiFeedback: {
    hesitation: "몇 군데 머뭇거림이 감지됩니다.",
    repetition: "연결어 위주로 반복되는 표현이 일부 나타났습니다.",
    accuracy: "핵심 문장 일부가 스크립트와 약간 다릅니다.",
    pace: "전반적인 속도는 무난하지만 초반 속도가 빠릅니다.",
  },
};
