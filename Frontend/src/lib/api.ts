export type UserRole = "student" | "faculty" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function syncUserSession(idToken: string): Promise<SessionUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to sync user session.");
  }

  return data.user as SessionUser;
}
