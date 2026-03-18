const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function normalizeBaseUrl(value, envName) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }

  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function appendQuery(url, query = {}) {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null && item !== "") {
          url.searchParams.append(key, String(item));
        }
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

export function buildUpstreamUrl(baseUrl, envName, pathname, query) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl, envName);
  const url = new URL(pathname, `${normalizedBaseUrl}/`);
  appendQuery(url, query);
  return url;
}

export async function readJsonBody(req) {
  if (!req.body) return null;

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return req.body;
}

export async function proxyJson(req, res, options) {
  const {
    envName,
    baseUrl,
    pathname,
    method = req.method || "GET",
    query = req.query,
    body,
    headers = {},
  } = options;

  try {
    const upstreamUrl = buildUpstreamUrl(baseUrl, envName, pathname, query);
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers: {
        Accept: "application/json",
        ...headers,
        ...(body ? JSON_HEADERS : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = upstreamResponse.headers.get("content-type") || "application/json";
    const text = await upstreamResponse.text();

    res.status(upstreamResponse.status);
    res.setHeader("Content-Type", contentType);

    if (!text) {
      return res.end();
    }

    return res.send(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected proxy error";
    return res.status(500).json({ error: "proxy_request_failed", message });
  }
}

export async function proxyBinary(req, res, options) {
  const {
    envName,
    baseUrl,
    pathname,
    method = req.method || "GET",
    query = req.query,
    headers = {},
  } = options;

  try {
    const upstreamUrl = buildUpstreamUrl(baseUrl, envName, pathname, query);
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
    });

    const arrayBuffer = await upstreamResponse.arrayBuffer();

    res.status(upstreamResponse.status);

    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected proxy error";
    return res.status(500).json({ error: "proxy_request_failed", message });
  }
}
