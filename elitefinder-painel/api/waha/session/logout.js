import { proxyJson } from "../../_lib/http.js";

export default async function handler(req, res) {
  return proxyJson(req, res, {
    envName: "WAHA_BASE_URL",
    baseUrl: process.env.WAHA_BASE_URL,
    pathname: "/api/sessions/default/logout",
    method: "POST",
    headers: {
      "x-api-key": process.env.WAHA_API_KEY || "",
    },
  });
}
