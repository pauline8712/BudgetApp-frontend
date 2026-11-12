// Dekoda JWT-token och returnera payload som objekt
export function decodeToken(token) {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Hämtar userId ur token från localStorage
export function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  // .NET lägger userId under denna claim-nyckel
  return payload[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
}

// Hämtar budgetId från localStorage
export function getBudgetId() {
  return localStorage.getItem("budgetId");
}

// Kontrollerar om inloggad användare har Admin-rollen
export function isAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  const role =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return role === "Admin";
}
