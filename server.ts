import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.140.0/http/file_server.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  
  // Serve static files
  if (pathname.startsWith("/assets")) {
    return serveDir(req, {
      fsRoot: "dist",
      urlRoot: "",
    });
  }
  
  // For all other routes, serve the index.html
  return new Response(await Deno.readTextFile("./dist/index.html"), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});