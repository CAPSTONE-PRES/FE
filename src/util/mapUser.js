export function mapUser(userData) {
  if (!userData) return null;

  return {
    id: userData.id,
    name: userData.username || "사용자",
    avatar: userData.profileImageUrl || "/avatars/user2.svg",
    email: userData.email || "",
  };
}
