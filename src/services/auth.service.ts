import { Admin } from "@/types";

const API_BASE = "/api";

function getAdminHeaders(): HeadersInit {
  const token = localStorage.getItem("cherie_admin_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; token: string; admin: Admin }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login gagal");
  }
  return data;
}

export async function getAdminProfile(): Promise<{ admin: Admin }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error("Sesi tidak valid");
  return res.json();
}

export async function UpdateAdminProfile({
  name,
  email,
  currentPassword,
  newPassword,
}: {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ success: boolean; token: string; admin: Admin }> {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify({ name, email, currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Update profile gagal");
  }
  return data;
}
