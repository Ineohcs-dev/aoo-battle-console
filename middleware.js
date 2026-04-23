/**
 * Vercel Edge Middleware — Basic Auth password gate.
 * Works on the free tier. Runs at the CDN edge before any content is served.
 *
 * Setup:
 *   1. Deploy this file (already in repo root).
 *   2. In Vercel dashboard → Project → Settings → Environment Variables:
 *      Add  PASSWORD = <your chosen password>
 *   3. Redeploy.
 *
 * Browser prompt: leave the username field blank (or type anything) and enter
 * the password. Access is remembered until the browser tab is closed.
 */

export default function middleware(request) {
  const authorization = request.headers.get("Authorization");

  if (authorization?.startsWith("Basic ")) {
    const base64 = authorization.slice("Basic ".length);
    const [, password] = atob(base64).split(":");
    if (password === process.env.PASSWORD) {
      return; // correct password — pass through to static files
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AOO Battle Console"',
      "Content-Type": "text/plain",
    },
  });
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
};
