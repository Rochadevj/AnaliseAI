import { proxyBinary } from "../../_lib/http.js";

export default async function handler(req, res) {
  return proxyBinary(req, res, {
    envName: "WAHA_BASE_URL",
    baseUrl: process.env.WAHA_BASE_URL,
    pathname: "/api/default/auth/qr",
    headers: {
      Accept: "image/png,image/jpeg,*/*",
      "x-api-key": process.env.WAHA_API_KEY || "",
    },
  });
}
