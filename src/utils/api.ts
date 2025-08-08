export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Login failed");
  }
  return data;
}

export async function registerAdmin(username: string, password: string, role?: string) {
  const body: any = { username, password };
  if (typeof role === "string" && role.trim() !== "") {
    body.role = role;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

export async function requestPasswordReset(email: string) {
  const res = await fetch("/api/auth/admin/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Password reset request failed");
  }
  return data;
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch("/api/auth/admin/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Password reset failed");
  }
  return data;
}

/* --- /dashboard/utils/api.ts --- */
export async function logoutAdmin(token: string) {
  // If your backend expects a token in the URL or header, adjust accordingly.
  // Here, we assume a GET request with Bearer token in Authorization header.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/admin/logout/` + token, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || "Logout failed");
  }
  return data;
}