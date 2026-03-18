import { proxyJson } from "../_lib/http.js";

export default async function handler(req, res) {
  return proxyJson(req, res, {
    envName: "N8N_BASE_URL",
    baseUrl: process.env.N8N_BASE_URL,
    pathname: "/webhook/api/conversations/export",
  });
}
