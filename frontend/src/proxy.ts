import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Aplica a todas las rutas excepto las rutas internas de Next.js y archivos estáticos
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
