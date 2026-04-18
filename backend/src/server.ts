import "dotenv/config";
import app from "./app";
import { prisma } from "./config/database";

const PUERTO = process.env.PORT ?? 4000;

const iniciar = async (): Promise<void> => {
  try {
    // Comprueba la conexión a la base de datos
    await prisma.$connect();
    console.log("Base de datos conectada correctamente");

    app.listen(PUERTO, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

iniciar();
