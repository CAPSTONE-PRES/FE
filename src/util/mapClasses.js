export function mapClasses(response) {
  const mapped = {};

  response.forEach((res) => {
    mapped[res.workspaceId] = {
      id: res.workspaceId,
      name: res.workspaceName,
      times: res.workspaceTimeList || [],
      isTeamProject: (res.workspaceMemberList?.length ?? 0) > 1,
      owner: {
        id: res.workspaceOwnerId,
        name: res.workspaceOwnerName,
        avatar: res.workspaceOwnerProfileUrl || "/avatars/user2.svg", //TODO: 랜덤으로
        // email: `owner${idx}@gmail.com`, //TODO: 실제 이메일로 교체
      },
      teamMembers: (res.workspaceMemberList || []).map((m) => ({
        id: m.memberId,
        name: m.memberName,
        avatar: m.memberProfileUrl || "/avatars/user2.svg", //TODO: 랜덤으로
        email: m.memberEmail,
      })),
    };
  });

  return mapped;
}
