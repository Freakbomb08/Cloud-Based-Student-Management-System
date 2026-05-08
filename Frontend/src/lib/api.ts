export type UserRole = "student" | "faculty" | "admin";
export type RoleAlias = UserRole | "teacher";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface ProfileUpdateInput {
  name?: string;
  phoneNumber?: string | null;
  photoUrl?: string | null;
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

export async function fetchCurrentUser(idToken: string): Promise<SessionUser> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to fetch user profile.");
  }

  return data.user as SessionUser;
}

export async function updateCurrentUser(idToken: string, input: ProfileUpdateInput): Promise<SessionUser> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to update profile.");
  }

  return data.user as SessionUser;
}

export async function updateUserRole(
  adminIdToken: string,
  firebaseUid: string,
  role: RoleAlias,
): Promise<SessionUser> {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${firebaseUid}/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminIdToken}`,
    },
    body: JSON.stringify({ role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to update user role.");
  }

  return data.user as SessionUser;
}
