const COOKIE_NAME = "ea_dashboard_session";
const COOKIE_SECRET = "emmaville_dashboard_secret";

export { COOKIE_NAME, COOKIE_SECRET };

export function signSession(username: string) {
  return Buffer.from(`${username}:${COOKIE_SECRET}`).toString("base64");
}

export function verifySession(token: string | undefined) {
  if (!token) return false;
  const decoded = Buffer.from(token, "base64").toString("utf8");
  const [user, secret] = decoded.split(":");
  return Boolean(user) && secret === COOKIE_SECRET;
}
