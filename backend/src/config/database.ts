import { PrismaClient } from "@prisma/client";

// Instancia global para evitar múltiples conexiones en desarrollo (hot-reload)
const globalParaPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalParaPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
