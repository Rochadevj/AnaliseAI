const WAHA_API_BASE = "/api/waha";

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function requestJson(path: string, init?: RequestInit) {
  const response = await fetch(`${WAHA_API_BASE}${path}`, init);
  const data = await parseJsonResponse(response);

  return { response, data };
}

export async function getWahaSession() {
  return requestJson("/session");
}

export async function startWahaSession(name = "default") {
  return requestJson("/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export async function stopWahaSession() {
  return requestJson("/session/stop", {
    method: "POST",
  });
}

export async function logoutWahaSession() {
  return requestJson("/session/logout", {
    method: "POST",
  });
}

export async function fetchWahaQrBlob() {
  return fetch(`${WAHA_API_BASE}/session/qr`, {
    headers: { Accept: "image/png,image/jpeg,*/*" },
  });
}

export async function fetchWahaSessions() {
  return requestJson("/sessions");
}
