// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

function roomsDevApiPlugin(): Plugin {
  return {
    name: "rooms-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/rooms")) return next();
        try {
          const { handleRoomsApiRequest } = await import("./src/lib/rooms-service.ts");
          const host = req.headers.host || "localhost:3000";
          const protocol = "http";
          const fullUrl = `${protocol}://${host}${req.url}`;

          let bodyBuffer: Buffer | undefined;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            bodyBuffer = Buffer.concat(chunks);
          }

          const webReq = new Request(fullUrl, {
            method: req.method,
            headers: req.headers as HeadersInit,
            body: bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
          });

          const webRes = await handleRoomsApiRequest(webReq);
          res.statusCode = webRes.status;
          webRes.headers.forEach((v, k) => res.setHeader(k, v));
          const arrayBuf = await webRes.arrayBuffer();
          res.end(Buffer.from(arrayBuf));
        } catch (err: any) {
          console.error("Erro no rooms dev middleware:", err);
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ ok: false, error: err?.message || "Erro no servidor" }));
        }
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [roomsDevApiPlugin()],
  },
});
