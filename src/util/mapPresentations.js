export function mapPresentations(response) {
  const mapped = {};

  response.forEach((res) => {
    mapped[res.projectId] = {
      id: res.projectId,
      classId: res.workspaceId,
      title: res.projectTitle,
      date: res.date,
      presenter: res.presenterName,
      presenterAvatar: res.presenterProfileUrl,
      lastVisited: res.lastVisited,
    };
  });

  return mapped;
}

/**
 *   p1: {
    id: "p1",
    classId: "c1",
    title: "타당석 분석_기말발표",
    date: "2025-06-16",
    time: "14:00",
    limitTime: { minute: 7, second: 0 },
    presenter: "이호성",
    lastVisited: "2025-08-24T10:10:00",
  },
 */
