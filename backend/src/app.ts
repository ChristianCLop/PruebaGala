import express from "express";
import cors from "cors";
import postRoutes from "./routes/post.routes";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// --- Middlewares ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// --- Rutas ---
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/posts", postRoutes);

// --- Manejo de errores ---
app.use(errorHandler);

export default app;
