import { proxyJson, readJsonBody } from "../../_lib/http.js";

export default async function handler(req, res) {
  const body = (await readJsonBody(req)) || {};

  return proxyJson(req, res, {
    envName: "WAHA_BASE_URL",
    baseUrl: process.env.WAHA_BASE_URL,
    pathname: "/api/sessions/start",
    method: "POST",
    body: {
      name: body.name || "default",
    },
    headers: {
      "x-api-key": process.env.WAHA_API_KEY || "",
    },
  });
}
